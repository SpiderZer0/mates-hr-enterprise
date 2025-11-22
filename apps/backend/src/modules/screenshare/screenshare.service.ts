import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { v4 as uuidv4 } from 'uuid';

interface ScreenShareRequest {
  targetUserId: string;
  reason?: string;
  duration?: number; // minutes
  scope?: 'screen' | 'window' | 'tab';
}

export interface IceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

@Injectable()
export class ScreenShareService {
  private readonly logger = new Logger(ScreenShareService.name);
  private readonly activeSessions = new Map<string, any>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly websocketGateway: WebsocketGateway,
    private readonly notificationsService: NotificationsService,
  ) { }

  async requestScreenShare(requesterId: string, data: ScreenShareRequest) {
    // Check if requester has permission (must be admin/hr/manager)
    const requester = await this.prisma.user.findUnique({
      where: { id: requesterId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    const hasPermission = requester?.userRoles.some(
      (ur) => ['ADMIN', 'HR', 'MANAGER'].includes(ur.role.name)
    );

    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to request screen share');
    }

    // Check if target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: data.targetUserId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    // Check if there's an active session
    const activeSession = await this.prisma.screenShareSession.findFirst({
      where: {
        OR: [
          { requesterId, status: 'ACTIVE' },
          { targetId: data.targetUserId, status: 'ACTIVE' },
        ],
      },
    });

    if (activeSession) {
      throw new ForbiddenException('There is already an active screen share session');
    }

    // Create screen share session
    const session = await this.prisma.screenShareSession.create({
      data: {
        requesterId,
        targetId: data.targetUserId,
        status: 'PENDING',
        sessionToken: uuidv4(),
        roomId: `screenshare-${uuidv4()}`,
        consentScope: data.scope || 'screen',
        metadata: JSON.stringify({
          reason: data.reason,
          requestedDuration: data.duration || 30,
          requestTime: new Date().toISOString(),
        }),
      },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
          },
        },
      },
    });

    // Send notification to target user
    await this.notificationsService.sendNotification({
      userId: data.targetUserId,
      type: 'INFO' as any,
      priority: 'URGENT' as any,
      title: 'Screen Share Request',
      body: `${requester?.firstName} ${requester?.lastName} is requesting to view your screen. Reason: ${data.reason || 'Support assistance'}`,
      actionUrl: `/screenshare/request/${session.id}`,
      channels: ['inapp'],
    });

    // Send WebSocket notification for immediate popup
    this.websocketGateway.sendNotificationToUser(data.targetUserId, {
      type: 'screenshare:request',
      session: {
        id: session.id,
        requester: (session as any).requester,
        reason: data.reason,
        duration: data.duration,
        scope: data.scope,
      },
    });

    // Set timeout for auto-rejection
    setTimeout(() => {
      this.autoRejectSession(session.id);
    }, 2 * 60 * 1000); // 2 minutes

    return session;
  }

  async respondToScreenShare(
    sessionId: string,
    userId: string,
    accepted: boolean,
    consentNote?: string,
  ) {
    const session = await this.prisma.screenShareSession.findUnique({
      where: { id: sessionId },
      include: {
        requester: true,
        target: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Screen share session not found');
    }

    if (session.targetId !== userId) {
      throw new ForbiddenException('You are not the target of this screen share request');
    }

    if (session.status !== 'PENDING') {
      throw new ForbiddenException('This screen share request has already been processed');
    }

    // Update session status
    const updatedSession = await this.prisma.screenShareSession.update({
      where: { id: sessionId },
      data: {
        status: accepted ? 'ACCEPTED' : 'REJECTED',
        consentGivenAt: accepted ? new Date() : null,
        metadata: JSON.stringify({
          ...((session.metadata as any) || {}),
          consentNote,
          responseTime: new Date().toISOString(),
        }),
      },
    });

    // Notify requester
    await this.notificationsService.sendNotification({
      userId: session.requesterId,
      type: accepted ? 'SUCCESS' : 'WARNING' as any,
      priority: 'HIGH' as any,
      title: `Screen Share ${accepted ? 'Accepted' : 'Rejected'}`,
      body: `${session.target.firstName} ${session.target.lastName} has ${accepted ? 'accepted' : 'rejected'
        } your screen share request.${consentNote ? ` Note: ${consentNote}` : ''}`,
      channels: ['inapp'],
    });

    // Send WebSocket notification
    this.websocketGateway.sendNotificationToUser(session.requesterId, {
      type: 'screenshare:response',
      sessionId,
      accepted,
      consentNote,
    });

    if (accepted) {
      // Initialize WebRTC session
      await this.initializeWebRTCSession(updatedSession);
    }

    return updatedSession;
  }

  async startScreenShare(sessionId: string, userId: string): Promise<any> {
    const session = await this.prisma.screenShareSession.findUnique({
      where: { id: sessionId },
      include: {
        requester: true,
        target: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Screen share session not found');
    }

    if (session.status !== 'ACCEPTED') {
      throw new ForbiddenException('This screen share session has not been accepted');
    }

    if (session.targetId !== userId && session.requesterId !== userId) {
      throw new ForbiddenException('You are not part of this screen share session');
    }

    // Update session to active
    await this.prisma.screenShareSession.update({
      where: { id: sessionId },
      data: {
        status: 'ACTIVE',
        startedAt: new Date(),
      },
    });

    // Store in active sessions
    this.activeSessions.set(sessionId, {
      requesterId: session.requesterId,
      targetId: session.targetId,
      roomId: session.roomId,
      startTime: Date.now(),
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId: session.requesterId,
        action: 'SCREENSHARE_START',
        entityType: 'ScreenShare',
        entityId: sessionId,
        oldValues: JSON.stringify({
          status: session.status,
        }),
        newValues: JSON.stringify({
          status: 'ACTIVE',
          startedAt: new Date().toISOString(),
        }),
        ipAddress: null, // Would be captured from request
      },
    });

    return {
      sessionId,
      roomId: session.roomId,
      iceServers: this.getIceServers(),
      sessionToken: session.sessionToken,
    };
  }

  async endScreenShare(sessionId: string, userId: string) {
    const session = await this.prisma.screenShareSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Screen share session not found');
    }

    if (session.targetId !== userId && session.requesterId !== userId) {
      throw new ForbiddenException('You are not part of this screen share session');
    }

    const duration = session.startedAt
      ? Math.floor((Date.now() - session.startedAt.getTime()) / 1000)
      : 0;

    const metadata = session.metadata ? JSON.parse(session.metadata) : {};

    // Update session
    await this.prisma.screenShareSession.update({
      where: { id: sessionId },
      data: {
        status: 'ENDED',
        endedAt: new Date(),
        duration,
        metadata: JSON.stringify({
          reason: metadata.reason,
          requestTime: metadata.requestTime,
          maxDuration: metadata.requestedDuration,
          scope: metadata.scope,
          endedBy: userId,
          endedAt: new Date().toISOString(),
          duration: duration.toString(),
        }),
      },
    });

    // Remove from active sessions
    this.activeSessions.delete(sessionId);

    // Notify both parties
    const endedByRequester = userId === session.requesterId;
    const otherPartyId = endedByRequester ? session.targetId : session.requesterId;

    await this.notificationsService.sendNotification({
      userId: otherPartyId,
      type: 'INFO' as any,
      priority: 'NORMAL' as any,
      title: 'Screen Share Ended',
      body: `The screen share session has ended. Duration: ${Math.floor(duration / 60)} minutes`,
      channels: ['inapp'],
    });

    // Send WebSocket notification to close the session
    this.websocketGateway.sendNotificationToUser(session.requesterId, {
      type: 'screenshare:ended',
      sessionId,
    });
    this.websocketGateway.sendNotificationToUser(session.targetId, {
      type: 'screenshare:ended',
      sessionId,
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'SCREENSHARE_END',
        entityType: 'ScreenShare',
        entityId: sessionId,
        oldValues: JSON.stringify({
          status: session.status,
          endedAt: null,
        }),
        newValues: JSON.stringify({
          endTime: new Date().toISOString(),
          duration: duration.toString(),
          endedBy: userId,
        }),
        ipAddress: null,
      },
    });

    return { success: true, duration };
  }

  async getActiveSessions(userId: string) {
    const sessions = await this.prisma.screenShareSession.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { targetId: userId },
        ],
        status: { in: ['PENDING', 'ACCEPTED', 'ACTIVE'] },
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
        target: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions;
  }

  async getSessionHistory(userId: string, filters: any = {}) {
    const where: any = {
      OR: [
        { requesterId: userId },
        { targetId: userId },
      ],
      status: 'ENDED',
    };

    if (filters.from && filters.to) {
      where.createdAt = {
        gte: new Date(filters.from),
        lte: new Date(filters.to),
      };
    }

    const sessions = await this.prisma.screenShareSession.findMany({
      where,
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        target: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });

    return sessions;
  }

  private async initializeWebRTCSession(session: any) {
    // Send WebRTC configuration to both parties
    const config = {
      sessionId: session.id,
      roomId: session.roomId,
      iceServers: this.getIceServers(),
      sessionToken: session.sessionToken,
    };

    // Notify requester
    this.websocketGateway.sendNotificationToUser(session.requesterId, {
      type: 'screenshare:ready',
      config,
      role: 'viewer',
    });

    // Notify target
    this.websocketGateway.sendNotificationToUser(session.targetId, {
      type: 'screenshare:ready',
      config,
      role: 'sharer',
    });
  }

  private getIceServers(): IceServer[] {
    // In production, these would come from environment variables
    return [
      {
        urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
      },
      // Add TURN servers for better connectivity
      {
        urls: ['turn:turn.mates-hr.com:3478'],
        username: process.env.TURN_USERNAME || 'mates',
        credential: process.env.TURN_CREDENTIAL || 'turn123',
      },
    ];
  }

  private async autoRejectSession(sessionId: string) {
    try {
      const session = await this.prisma.screenShareSession.findUnique({
        where: { id: sessionId },
      });

      if (session && session.status === 'PENDING') {
        await this.prisma.screenShareSession.update({
          where: { id: sessionId },
          data: {
            status: 'EXPIRED',
            metadata: {
              ...((session.metadata as any) || {}),
              expiredAt: new Date().toISOString(),
            },
          },
        });

        // Notify requester
        await this.notificationsService.sendNotification({
          userId: session.requesterId,
          type: 'WARNING' as any,
          priority: 'NORMAL' as any,
          title: 'Screen Share Request Expired',
          body: 'Your screen share request has expired due to no response.',
          channels: ['inapp'],
        });
      }
    } catch (error) {
      this.logger.error('Failed to auto-reject session:', error);
    }
  }

  // WebRTC Signaling handlers
  async handleSignal(sessionId: string, userId: string, signal: any) {
    const session = await this.prisma.screenShareSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Screen share session not found');
    }

    if (session.targetId !== userId && session.requesterId !== userId) {
      throw new ForbiddenException('You are not part of this screen share session');
    }

    // Forward signal to the other party
    const recipientId = userId === session.requesterId ? session.targetId : session.requesterId;

    this.websocketGateway.sendNotificationToUser(recipientId, {
      type: 'screenshare:signal',
      sessionId,
      signal,
    });
  }

  // Recording functionality (if enabled)
  async startRecording(sessionId: string, userId: string) {
    // Check permissions and consent
    const session = await this.prisma.screenShareSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.requesterId !== userId) {
      throw new ForbiddenException('Only the requester can start recording');
    }

    // Recording would require additional consent and infrastructure
    this.logger.log(`Recording would start for session ${sessionId}`);

    // Notify target that recording has started
    await this.notificationsService.sendNotification({
      userId: session.targetId,
      type: 'WARNING' as any,
      priority: 'HIGH' as any,
      title: 'Recording Started',
      body: 'This screen share session is now being recorded.',
      channels: ['inapp'],
    });

    return { recording: true };
  }
}
