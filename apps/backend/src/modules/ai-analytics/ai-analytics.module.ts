import { Module } from '@nestjs/common';
import { AIAnalyticsService } from './ai-analytics.service';
import { AIAnalyticsController } from './ai-analytics.controller';
import { PrismaModule } from '../../database/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PrismaModule,
    NotificationsModule,
    ScheduleModule,
  ],
  controllers: [AIAnalyticsController],
  providers: [AIAnalyticsService],
  exports: [AIAnalyticsService],
})
export class AIAnalyticsModule {}
