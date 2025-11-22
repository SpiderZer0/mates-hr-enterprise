import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/ws',
  transports: ['websocket', 'polling'],
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);
  private readonly connectedUsers = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const decoded = await this.jwtService.verify(token);
      const userId = decoded.sub;
      
      // Store user connection
      if (!this.connectedUsers.has(userId)) {
        this.connectedUsers.set(userId, new Set());
      }
      this.connectedUsers.get(userId).add(client.id);

      // Join user-specific room
      client.join(`user:${userId}`);
      
      // Join company room
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { companyId: true },
      });
      if (user?.companyId) {
        client.join(`company:${user.companyId}`);
      }

      // Update user last seen
      await this.prisma.user.update({
        where: { id: userId },
        data: { lastSeenAt: new Date() },
      });

      // Emit connection event
      client.emit('connected', { 
        userId, 
        socketId: client.id,
        timestamp: new Date(),
      });

      this.logger.log(`User ${userId} connected with socket ${client.id}`);
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (token) {
        const decoded = await this.jwtService.verify(token);
        const userId = decoded.sub;
        
        // Remove connection
        const userSockets = this.connectedUsers.get(userId);
        if (userSockets) {
          userSockets.delete(client.id);
          if (userSockets.size === 0) {
            this.connectedUsers.delete(userId);
          }
        }

        this.logger.log(`User ${userId} disconnected from socket ${client.id}`);
      }
    } catch (error) {
      this.logger.error('Disconnect error:', error);
    }
  }

  // Send notification to specific user
  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  // Send notification to company
  sendNotificationToCompany(companyId: string, notification: any) {
    this.server.to(`company:${companyId}`).emit('notification', notification);
  }

  // Broadcast to all connected users
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Get online users list
  getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  // Chat message handler
  @SubscribeMessage('chat:message')
  async handleChatMessage(
    @MessageBody() data: { threadId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const token = client.handshake.auth?.token;
      const decoded = await this.jwtService.verify(token);
      const userId = decoded.sub;

      // Save message to database
      const message = await this.prisma.chatMessage.create({
        data: {
          threadId: data.threadId,
          senderId: userId,
          content: data.content,
          contentType: 'TEXT',
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      });

      // Get thread participants
      const participants = await this.prisma.chatParticipant.findMany({
        where: { threadId: data.threadId },
        select: { userId: true },
      });

      // Send message to all participants
      participants.forEach((participant) => {
        this.server.to(`user:${participant.userId}`).emit('chat:message', message);
      });

      // Update thread last activity
      await this.prisma.chatThread.update({
        where: { id: data.threadId },
        data: { lastActivityAt: new Date() },
      });

    } catch (error) {
      this.logger.error('Chat message error:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  // Typing indicator
  @SubscribeMessage('chat:typing')
  async handleTyping(
    @MessageBody() data: { threadId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const token = client.handshake.auth?.token;
      const decoded = await this.jwtService.verify(token);
      const userId = decoded.sub;

      // Get thread participants
      const participants = await this.prisma.chatParticipant.findMany({
        where: { threadId: data.threadId, userId: { not: userId } },
        select: { userId: true },
      });

      // Send typing indicator to other participants
      participants.forEach((participant) => {
        this.server.to(`user:${participant.userId}`).emit('chat:typing', {
          threadId: data.threadId,
          userId,
          isTyping: data.isTyping,
        });
      });
    } catch (error) {
      this.logger.error('Typing indicator error:', error);
    }
  }

  // Mark message as read
  @SubscribeMessage('chat:read')
  async handleMessageRead(
    @MessageBody() data: { messageId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const token = client.handshake.auth?.token;
      const decoded = await this.jwtService.verify(token);
      const userId = decoded.sub;

      await this.prisma.messageRead.create({
        data: {
          messageId: data.messageId,
          userId,
        },
      });

      // Get message details
      const message = await this.prisma.chatMessage.findUnique({
        where: { id: data.messageId },
        select: { threadId: true, senderId: true },
      });

      if (message) {
        // Notify sender that message was read
        this.server.to(`user:${message.senderId}`).emit('chat:read', {
          messageId: data.messageId,
          userId,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      this.logger.error('Message read error:', error);
    }
  }

  // Screen share request
  @SubscribeMessage('screenshare:request')
  async handleScreenShareRequest(
    @MessageBody() data: { targetUserId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const token = client.handshake.auth?.token;
      const decoded = await this.jwtService.verify(token);
      const requesterId = decoded.sub;

      // Create screen share session
      const sessionToken = Math.random().toString(36).substring(7);
      const roomId = `room_${Math.random().toString(36).substring(7)}`;
      
      const session = await this.prisma.screenShareSession.create({
        data: {
          requesterId,
          targetId: data.targetUserId,
          status: 'PENDING',
          sessionToken,
          roomId,
        },
        include: {
          requester: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      });

      // Send request to target user
      this.server.to(`user:${data.targetUserId}`).emit('screenshare:request', {
        sessionId: session.id,
        requesterId: session.requesterId,
        timestamp: new Date(),
      });

      client.emit('screenshare:request:sent', { sessionId: session.id });
    } catch (error) {
      this.logger.error('Screen share request error:', error);
      client.emit('error', { message: 'Failed to send screen share request' });
    }
  }

  // Screen share response
  @SubscribeMessage('screenshare:response')
  async handleScreenShareResponse(
    @MessageBody() data: { sessionId: string; accepted: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const token = client.handshake.auth?.token;
      const decoded = await this.jwtService.verify(token);
      const userId = decoded.sub;

      const session = await this.prisma.screenShareSession.update({
        where: { id: data.sessionId },
        data: {
          status: data.accepted ? 'ACCEPTED' : 'REJECTED',
          consentGivenAt: data.accepted ? new Date() : null,
        },
        include: {
          requester: true,
          target: true,
        },
      });

      // Notify requester
      this.server.to(`user:${session.requesterId}`).emit('screenshare:response', {
        sessionId: session.id,
        accepted: data.accepted,
        timestamp: new Date(),
      });

      if (data.accepted) {
        // Create room for screen share
        const roomId = `screenshare:${session.id}`;
        client.join(roomId);
        this.server.to(`user:${session.requesterId}`).emit('screenshare:ready', {
          sessionId: session.id,
          roomId,
        });
      }
    } catch (error) {
      this.logger.error('Screen share response error:', error);
      client.emit('error', { message: 'Failed to respond to screen share request' });
    }
  }

  // WebRTC signaling for screen share
  @SubscribeMessage('screenshare:signal')
  async handleScreenShareSignal(
    @MessageBody() data: { sessionId: string; signal: any },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const roomId = `screenshare:${data.sessionId}`;
      client.to(roomId).emit('screenshare:signal', data.signal);
    } catch (error) {
      this.logger.error('Screen share signal error:', error);
    }
  }
}
