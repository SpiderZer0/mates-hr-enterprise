import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
// import { UsersModule } from './modules/users/users.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { LeaveModule } from './modules/leave/leave.module';
import { PayrollModule } from './modules/payroll/payroll.module';
// import { OrganizationModule } from './modules/organization/organization.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PrismaModule } from './database/prisma.module';
// import { RedisModule } from './redis/redis.module';
// import { QueueModule } from './queue/queue.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { EmailModule } from './modules/email/email.module';
import { ChatModule } from './modules/chat/chat.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { ScreenShareModule } from './modules/screenshare/screenshare.module';
import { AIAnalyticsModule } from './modules/ai-analytics/ai-analytics.module';
// Guards will be used per route, not globally
import configuration from './config/configuration';
import { validate } from './config/env.validation';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
      cache: true,
      expandVariables: true,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Scheduling
    ScheduleModule.forRoot(),

    // Database
    PrismaModule,

    // Cache & Queue
    RedisModule,
    QueueModule,

    // Core Feature modules
    AuthModule,
    UsersModule,
    EmployeesModule,
    AttendanceModule,
    LeaveModule,
    PayrollModule,
    OrganizationModule,
    NotificationModule,

    // Advanced modules
    WebsocketModule,
    NotificationsModule,
    EmailModule,
    ChatModule,
    ProjectsModule,
    CalendarModule,
    ScreenShareModule,
    AIAnalyticsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
