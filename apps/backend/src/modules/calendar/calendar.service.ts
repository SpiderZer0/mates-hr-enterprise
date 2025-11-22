import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import moment from 'moment-timezone';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) { }

  async createCalendar(userId: string, data: any) {
    const calendar = await this.prisma.calendar.create({
      data: {
        ...data,
        ownerId: userId,
        scope: data.scope || 'PERSONAL',
      },
    });

    return calendar;
  }

  async getCalendars(userId: string, companyId: string) {
    const calendars = await this.prisma.calendar.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            companyId,
            OR: [
              { isPublic: true },
              { scope: 'COMPANY' },
            ],
          },
        ],
      },
      include: {
        _count: {
          select: {
            events: true,
          },
        },
      },
    });

    return calendars;
  }

  async createEvent(userId: string, data: any) {
    const calendar = await this.prisma.calendar.findUnique({
      where: { id: data.calendarId },
    });

    if (!calendar) {
      throw new NotFoundException('Calendar not found');
    }

    // Check permissions
    if (calendar.ownerId !== userId && !calendar.isPublic) {
      throw new NotFoundException('Access denied to this calendar');
    }

    const event = await this.prisma.event.create({
      data: {
        ...data,
        attendees: {
          create: {
            userId,
            isOrganizer: true,
            status: 'accepted',
          },
        },
      },
      include: {
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        reminders: true,
      },
    });

    // Send invitations to attendees
    if (data.attendeeIds && data.attendeeIds.length > 0) {
      for (const attendeeId of data.attendeeIds) {
        if (attendeeId !== userId) {
          await this.prisma.eventAttendee.create({
            data: {
              eventId: event.id,
              userId: attendeeId,
              status: 'invited',
            },
          });

          await this.notificationsService.sendNotification({
            userId: attendeeId,
            type: 'INFO' as any,
            priority: 'HIGH' as any,
            title: 'Calendar Invitation',
            body: `You have been invited to: ${event.title}`,
            actionUrl: `/calendar/events/${event.id}`,
            channels: ['inapp', 'email'],
          });
        }
      }
    }

    // Schedule reminders
    if (data.reminders) {
      for (const reminder of data.reminders) {
        await this.prisma.eventReminder.create({
          data: {
            eventId: event.id,
            minutesBefore: reminder.minutesBefore,
            channel: reminder.channel || 'inapp',
          },
        });

        // Schedule the actual reminder notification
        await this.scheduleReminder(event, reminder.minutesBefore);
      }
    }

    return event;
  }

  async getEvents(
    userId: string,
    filters: {
      from?: Date;
      to?: Date;
      calendarId?: string;
      type?: string;
    } = {},
  ) {
    const where: any = {
      OR: [
        {
          attendees: {
            some: {
              userId,
              status: { not: 'declined' },
            },
          },
        },
        {
          calendar: {
            ownerId: userId,
          },
        },
      ],
    };

    if (filters.from && filters.to) {
      where.AND = [
        {
          OR: [
            {
              AND: [
                { startAt: { gte: filters.from } },
                { startAt: { lte: filters.to } },
              ],
            },
            {
              AND: [
                { endAt: { gte: filters.from } },
                { endAt: { lte: filters.to } },
              ],
            },
            {
              AND: [
                { startAt: { lte: filters.from } },
                { endAt: { gte: filters.to } },
              ],
            },
          ],
        },
      ];
    }

    if (filters.calendarId) {
      where.calendarId = filters.calendarId;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    const events = await this.prisma.event.findMany({
      where,
      include: {
        calendar: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        reminders: true,
      },
      orderBy: { startAt: 'asc' },
    });

    // Add computed fields
    const eventsWithComputed = events.map((event) => ({
      ...event,
      isOrganizer: event.attendees.some(
        (a) => a.userId === userId && a.isOrganizer,
      ),
      userStatus: event.attendees.find((a) => a.userId === userId)?.status,
    }));

    return eventsWithComputed;
  }

  async updateEventResponse(
    eventId: string,
    userId: string,
    response: 'accepted' | 'declined' | 'tentative',
    note?: string,
  ) {
    const attendee = await this.prisma.eventAttendee.findFirst({
      where: {
        eventId,
        userId,
      },
    });

    if (!attendee) {
      throw new NotFoundException('Event invitation not found');
    }

    await this.prisma.eventAttendee.update({
      where: { id: attendee.id },
      data: {
        status: response,
        responseNote: note,
        respondedAt: new Date(),
      },
    });

    // Notify organizer
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        attendees: {
          where: { isOrganizer: true },
          include: {
            user: true,
          },
        },
      },
    });

    if (event && event.attendees[0]) {
      const organizer = event.attendees[0].user;
      const respondent = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (organizer && respondent) {
        await this.notificationsService.sendNotification({
          userId: organizer.id,
          type: 'INFO' as any,
          priority: 'NORMAL' as any,
          title: 'Event Response',
          body: `${respondent.firstName} ${respondent.lastName} ${response} your invitation to "${event.title}"`,
          actionUrl: `/calendar/events/${event.id}`,
        });
      }
    }

    return { success: true };
  }

  async getAvailability(
    userIds: string[],
    date: Date,
    duration: number,
    options: {
      startHour?: number;
      endHour?: number;
      timezone?: string;
    } = {},
  ) {
    const startHour = options.startHour || 9;
    const endHour = options.endHour || 17;
    const timezone = options.timezone || 'UTC';

    const startOfDay = moment.tz(date, timezone).startOf('day').toDate();
    const endOfDay = moment.tz(date, timezone).endOf('day').toDate();

    // Get all events for users on the specified date
    const events = await this.prisma.event.findMany({
      where: {
        attendees: {
          some: {
            userId: { in: userIds },
            status: { not: 'declined' },
          },
        },
        OR: [
          {
            AND: [
              { startAt: { gte: startOfDay } },
              { startAt: { lte: endOfDay } },
            ],
          },
          {
            AND: [
              { endAt: { gte: startOfDay } },
              { endAt: { lte: endOfDay } },
            ],
          },
        ],
      },
      select: {
        startAt: true,
        endAt: true,
        attendees: {
          select: {
            userId: true,
          },
        },
      },
    });

    // Calculate available slots
    const slots = [];
    const slotDuration = duration;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotStart = moment.tz(date, timezone)
          .hour(hour)
          .minute(minute)
          .second(0)
          .toDate();

        const slotEnd = moment(slotStart)
          .add(slotDuration, 'minutes')
          .toDate();

        // Check if all users are available during this slot
        let isAvailable = true;
        const unavailableUsers = [];

        for (const userId of userIds) {
          const hasConflict = events.some((event) => {
            const isAttending = event.attendees.some(
              (a) => a.userId === userId,
            );
            if (!isAttending) return false;

            // Check for overlap
            return (
              (event.startAt < slotEnd && event.endAt > slotStart)
            );
          });

          if (hasConflict) {
            isAvailable = false;
            unavailableUsers.push(userId);
          }
        }

        if (isAvailable) {
          slots.push({
            start: slotStart,
            end: slotEnd,
            available: true,
          });
        } else {
          slots.push({
            start: slotStart,
            end: slotEnd,
            available: false,
            unavailableUsers,
          });
        }
      }
    }

    return {
      date,
      timezone,
      duration,
      slots,
    };
  }

  async suggestMeetingTimes(
    userIds: string[],
    duration: number,
    options: {
      dateRange?: { from: Date; to: Date };
      preferredTimes?: string[];
      timezone?: string;
    } = {},
  ) {
    const suggestions = [];
    const from = options.dateRange?.from || new Date();
    const to = options.dateRange?.to || moment().add(7, 'days').toDate();
    const timezone = options.timezone || 'UTC';

    // Check availability for each day in the range
    const current = moment(from);
    const end = moment(to);

    while (current.isBefore(end)) {
      const availability = await this.getAvailability(
        userIds,
        current.toDate(),
        duration,
        { timezone },
      );

      // Find the best slots
      const availableSlots = availability.slots
        .filter((slot) => slot.available)
        .slice(0, 3); // Top 3 slots per day

      for (const slot of availableSlots) {
        suggestions.push({
          start: slot.start,
          end: slot.end,
          score: this.calculateSlotScore(slot, options.preferredTimes),
        });
      }

      current.add(1, 'day');
    }

    // Sort by score and return top suggestions
    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  private calculateSlotScore(slot: any, preferredTimes?: string[]): number {
    let score = 100;

    const hour = moment(slot.start).hour();

    // Prefer morning slots
    if (hour >= 9 && hour <= 11) {
      score += 20;
    }

    // Slightly prefer afternoon slots
    if (hour >= 14 && hour <= 16) {
      score += 10;
    }

    // Penalize early morning and late evening
    if (hour < 9 || hour > 17) {
      score -= 30;
    }

    // Check preferred times
    if (preferredTimes) {
      const timeStr = moment(slot.start).format('HH:mm');
      if (preferredTimes.includes(timeStr)) {
        score += 50;
      }
    }

    return score;
  }

  private async scheduleReminder(event: any, minutesBefore: number) {
    // In a real implementation, this would use a job queue like BullMQ
    // to schedule the reminder notification
    const reminderTime = moment(event.startAt)
      .subtract(minutesBefore, 'minutes')
      .toDate();

    this.logger.log(
      `Reminder would be scheduled for event ${event.id} at ${reminderTime}`,
    );

    // Example with BullMQ (not implemented here):
    // await this.reminderQueue.add(
    //   'send-reminder',
    //   { eventId: event.id },
    //   { delay: reminderTime.getTime() - Date.now() }
    // );
  }

  async importICS(userId: string, icsContent: string) {
    // Parse ICS content and create events
    // This would use a library like ical.js or node-ical
    this.logger.log('ICS import would be processed here');
    return { imported: 0 };
  }

  async exportICS(calendarId: string, userId: string) {
    const events = await this.getEvents(userId, { calendarId });

    // Generate ICS content
    let ics = 'BEGIN:VCALENDAR\r\n';
    ics += 'VERSION:2.0\r\n';
    ics += 'PRODID:-//Mates HR//Calendar//EN\r\n';
    ics += 'CALSCALE:GREGORIAN\r\n';

    for (const event of events) {
      ics += 'BEGIN:VEVENT\r\n';
      ics += `UID:${event.id}@mates-hr.com\r\n`;
      ics += `DTSTART:${moment(event.startAt).format('YYYYMMDDTHHmmss')}Z\r\n`;
      ics += `DTEND:${moment(event.endAt).format('YYYYMMDDTHHmmss')}Z\r\n`;
      ics += `SUMMARY:${event.title}\r\n`;
      if (event.description) {
        ics += `DESCRIPTION:${event.description}\r\n`;
      }
      if (event.location) {
        ics += `LOCATION:${event.location}\r\n`;
      }
      ics += 'END:VEVENT\r\n';
    }

    ics += 'END:VCALENDAR\r\n';

    return ics;
  }
}
