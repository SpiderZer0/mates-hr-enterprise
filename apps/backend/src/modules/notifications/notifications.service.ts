import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { EmailService } from '../email/email.service';
import { Cron, CronExpression } from '@nestjs/schedule';
// import { NotificationType, NotificationPriority } from '@prisma/client';

export interface NotificationPayload {
  userId: string;
  type: any; // NotificationType
  priority: any; // NotificationPriority
  title: string;
  body: string;
  actionUrl?: string;
  metadata?: any;
  channels?: ('inapp' | 'email' | 'push')[];
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly websocket: WebsocketGateway,
    private readonly emailService: EmailService,
  ) { }

  async sendNotification(payload: NotificationPayload) {
    try {
      // Create notification record
      const notification = await this.prisma.notification.create({
        data: {
          userId: payload.userId,
          type: payload.type,
          priority: payload.priority,
          title: payload.title,
          body: payload.body,
          actionUrl: payload.actionUrl,
          metadata: payload.metadata,
          isRead: false,
        },
      });

      // Send through enabled channels (defaulting to inapp for now)
      await this.sendInAppNotification(notification);

      this.logger.log(`Notification sent to user ${payload.userId}`);
      return notification;
    } catch (error) {
      this.logger.error('Failed to send notification:', error);
      throw error;
    }
  }

  private async sendInAppNotification(notification: any) {
    // Send via WebSocket
    this.websocket.sendNotificationToUser(notification.userId, {
      id: notification.id,
      type: notification.type,
      priority: notification.priority,
      title: notification.title,
      body: notification.body,
      actionUrl: notification.actionUrl,
      timestamp: notification.createdAt,
    });
  }

  private async sendEmailNotification(notification: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: notification.userId },
      select: { email: true, firstName: true, lastName: true },
    });

    if (user) {
      await this.emailService.sendEmail({
        to: user.email,
        subject: notification.title,
        template: 'notification',
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          title: notification.title,
          body: notification.body,
          actionUrl: notification.actionUrl,
        },
      });
    }
  }

  private async sendPushNotification(notification: any) {
    // Implement push notification logic (e.g., FCM, OneSignal)
    this.logger.log('Push notification would be sent here');
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.update({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    // Notify via WebSocket
    this.websocket.sendNotificationToUser(userId, {
      type: 'notification:read',
      notificationId,
    });

    return notification;
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    // Notify via WebSocket
    this.websocket.sendNotificationToUser(userId, {
      type: 'notification:read:all',
    });
  }

  async getNotifications(
    userId: string,
    filters: {
      unread?: boolean;
      type?: any; // NotificationType
      priority?: any; // NotificationPriority
      limit?: number;
      offset?: number;
    } = {},
  ) {
    const where: any = { userId };

    if (filters.unread !== undefined) {
      where.isRead = !filters.unread;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 20,
        skip: filters.offset || 0,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data: notifications,
      total,
      limit: filters.limit || 20,
      offset: filters.offset || 0,
    };
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  private async scheduleNotification(payload: NotificationPayload) {
    // Store for later delivery
    // This could use a queue like BullMQ for better reliability
    this.logger.log('Notification scheduled for later delivery');
  }

  // Notification rules engine
  async processNotificationRule(
    event: string,
    data: any,
    companyId: string,
  ) {
    // Logic disabled due to missing NotificationRule model
    return;
  }

  private evaluateRuleConditions(rule: any, data: any): boolean {
    return true;
  }

  private async getRecipients(rule: any, data: any): Promise<string[]> {
    return [];
  }

  private interpolateTemplate(template: string, data: any): string {
    return template;
  }

  // Cleanup old notifications
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupOldNotifications() {
    // Logic disabled
    return;
  }

  // Send digest emails
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyDigest() {
    // Logic disabled due to missing NotificationPreference model
    return;
  }
}
