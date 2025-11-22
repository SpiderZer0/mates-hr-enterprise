import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Patch,
  HttpCode,
  HttpStatus,
  Header,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('calendar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('calendars')
  @ApiOperation({ summary: 'Create a calendar' })
  async createCalendar(
    @Request() req,
    @Body() data: {
      name: string;
      description?: string;
      scope?: string;
      color?: string;
      isPublic?: boolean;
    },
  ) {
    return this.calendarService.createCalendar(req.user.id, {
      ...data,
      companyId: req.user.companyId,
    });
  }

  @Get('calendars')
  @ApiOperation({ summary: 'Get user calendars' })
  async getCalendars(@Request() req) {
    return this.calendarService.getCalendars(req.user.id, req.user.companyId);
  }

  @Post('events')
  @ApiOperation({ summary: 'Create an event' })
  async createEvent(
    @Request() req,
    @Body() data: {
      calendarId: string;
      type: string;
      title: string;
      description?: string;
      location?: string;
      startAt: Date;
      endAt: Date;
      isAllDay?: boolean;
      isRecurring?: boolean;
      recurringRule?: string;
      attendeeIds?: string[];
      reminders?: Array<{
        minutesBefore: number;
        channel?: string;
      }>;
    },
  ) {
    return this.calendarService.createEvent(req.user.id, data);
  }

  @Get('events')
  @ApiOperation({ summary: 'Get events' })
  async getEvents(
    @Request() req,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('calendarId') calendarId?: string,
    @Query('type') type?: string,
  ) {
    return this.calendarService.getEvents(req.user.id, {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      calendarId,
      type,
    });
  }

  @Patch('events/:id/response')
  @ApiOperation({ summary: 'Respond to event invitation' })
  async respondToEvent(
    @Param('id') eventId: string,
    @Request() req,
    @Body() data: {
      response: 'accepted' | 'declined' | 'tentative';
      note?: string;
    },
  ) {
    return this.calendarService.updateEventResponse(
      eventId,
      req.user.id,
      data.response,
      data.note,
    );
  }

  @Post('availability')
  @ApiOperation({ summary: 'Check availability' })
  async checkAvailability(
    @Request() req,
    @Body() data: {
      userIds: string[];
      date: Date;
      duration: number;
      startHour?: number;
      endHour?: number;
      timezone?: string;
    },
  ) {
    return this.calendarService.getAvailability(
      data.userIds,
      new Date(data.date),
      data.duration,
      {
        startHour: data.startHour,
        endHour: data.endHour,
        timezone: data.timezone,
      },
    );
  }

  @Post('suggest-times')
  @ApiOperation({ summary: 'Suggest meeting times' })
  async suggestMeetingTimes(
    @Request() req,
    @Body() data: {
      userIds: string[];
      duration: number;
      dateRange?: { from: Date; to: Date };
      preferredTimes?: string[];
      timezone?: string;
    },
  ) {
    return this.calendarService.suggestMeetingTimes(
      data.userIds,
      data.duration,
      {
        dateRange: data.dateRange
          ? {
              from: new Date(data.dateRange.from),
              to: new Date(data.dateRange.to),
            }
          : undefined,
        preferredTimes: data.preferredTimes,
        timezone: data.timezone,
      },
    );
  }

  @Post('import/ics')
  @ApiOperation({ summary: 'Import ICS file' })
  @HttpCode(HttpStatus.OK)
  async importICS(
    @Request() req,
    @Body('icsContent') icsContent: string,
  ) {
    return this.calendarService.importICS(req.user.id, icsContent);
  }

  @Get('calendars/:id/export.ics')
  @ApiOperation({ summary: 'Export calendar as ICS' })
  @Header('Content-Type', 'text/calendar')
  @Header('Content-Disposition', 'attachment; filename="calendar.ics"')
  async exportICS(@Param('id') calendarId: string, @Request() req) {
    return this.calendarService.exportICS(calendarId, req.user.id);
  }
}
