import { Module } from '@nestjs/common';
import { ScreenShareService } from './screenshare.service';
import { ScreenShareController } from './screenshare.controller';
import { PrismaModule } from '../../database/prisma.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, WebsocketModule, NotificationsModule],
  controllers: [ScreenShareController],
  providers: [ScreenShareService],
  exports: [ScreenShareService],
})
export class ScreenShareModule {}
