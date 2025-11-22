import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly websocketGateway: WebsocketGateway,
  ) { }

  async createThread(userId: string, data: any) {
    // For direct messages, check if thread already exists
    if (data.type === 'DIRECT' && data.participantIds?.length === 1) {
      const existingThread = await this.prisma.chatThread.findFirst({
        where: {
          type: 'DIRECT',
          participants: {
            every: {
              userId: {
                in: [userId, data.participantIds[0]],
              },
            },
          },
        },
      });

      if (existingThread) {
        return this.getThread(existingThread.id, userId);
      }
    }

    const thread = await this.prisma.chatThread.create({
      data: {
        type: data.type || 'DIRECT',
        title: data.title,
        description: data.description,
        createdById: userId,
        companyId: data.companyId,
        projectId: data.projectId,
        departmentId: data.departmentId,
        participants: {
          create: [
            {
              userId,
              role: 'owner',
            },
            ...(data.participantIds || []).map((id: string) => ({
              userId: id,
              role: 'member',
            })),
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                lastSeenAt: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Notify participants
    for (const participant of thread.participants) {
      if (participant.userId !== userId) {
        this.websocketGateway.sendNotificationToUser(participant.userId, {
          type: 'chat:thread:created',
          thread,
        });
      }
    }

    return thread;
  }

  async getThreads(userId: string, filters: any = {}) {
    const where: any = {
      participants: {
        some: {
          userId,
          leftAt: null,
        },
      },
      isArchived: false,
    };

    if (filters.type) {
      where.type = filters.type;
    }

    const threads = await this.prisma.chatThread.findMany({
      where,
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                lastSeenAt: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: { lastActivityAt: 'desc' },
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });

    // Add unread count for each thread
    const threadsWithUnread = await Promise.all(
      threads.map(async (thread) => {
        const participant = thread.participants.find(
          (p) => p.userId === userId,
        );

        let unreadCount = 0;
        if (participant?.lastReadAt) {
          unreadCount = await this.prisma.chatMessage.count({
            where: {
              threadId: thread.id,
              createdAt: { gt: participant.lastReadAt },
              senderId: { not: userId },
            },
          });
        }

        return {
          ...thread,
          unreadCount,
          lastMessage: thread.messages[0] || null,
        };
      }),
    );

    return threadsWithUnread;
  }

  async getThread(threadId: string, userId: string) {
    const thread = await this.prisma.chatThread.findFirst({
      where: {
        id: threadId,
        participants: {
          some: {
            userId,
            leftAt: null,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                email: true,
                lastSeenAt: true,
              },
            },
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        // department: {
        //   select: {
        //     id: true,
        //     name: true,
        //   },
        // },
      },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found or access denied');
    }

    return thread;
  }

  async getMessages(
    threadId: string,
    userId: string,
    options: {
      cursor?: string;
      limit?: number;
    } = {},
  ) {
    // Verify access
    await this.verifyThreadAccess(threadId, userId);

    const messages = await this.prisma.chatMessage.findMany({
      where: {
        threadId,
        isDeleted: false,
        ...(options.cursor && {
          createdAt: { lt: new Date(options.cursor) },
        }),
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
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        reads: {
          select: {
            userId: true,
            readAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: options.limit || 50,
    });

    // Mark messages as read
    await this.markThreadAsRead(threadId, userId);

    return messages.reverse();
  }

  async sendMessage(
    threadId: string,
    userId: string,
    data: {
      content: string;
      contentType?: string;
      attachmentUrl?: string;
      attachmentName?: string;
      attachmentSize?: number;
      replyToId?: string;
    },
  ) {
    // Verify access
    await this.verifyThreadAccess(threadId, userId);

    const message = await this.prisma.chatMessage.create({
      data: {
        threadId,
        senderId: userId,
        content: data.content,
        contentType: (data.contentType as any) || 'TEXT',
        attachmentUrl: data.attachmentUrl,
        attachmentName: data.attachmentName,
        attachmentSize: data.attachmentSize,
        replyToId: data.replyToId,
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
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    // Update thread last activity
    await this.prisma.chatThread.update({
      where: { id: threadId },
      data: { lastActivityAt: new Date() },
    });

    // Get participants
    const participants = await this.prisma.chatParticipant.findMany({
      where: { threadId },
      select: { userId: true },
    });

    // Send via WebSocket to all participants
    for (const participant of participants) {
      this.websocketGateway.sendNotificationToUser(participant.userId, {
        type: 'chat:message',
        message,
      });
    }

    return message;
  }

  async updateMessage(
    messageId: string,
    userId: string,
    content: string,
  ) {
    const message = await this.prisma.chatMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    const updated = await this.prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        content,
        isEdited: true,
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

    // Notify participants
    const participants = await this.prisma.chatParticipant.findMany({
      where: { threadId: message.threadId },
      select: { userId: true },
    });

    for (const participant of participants) {
      this.websocketGateway.sendNotificationToUser(participant.userId, {
        type: 'chat:message:updated',
        message: updated,
      });
    }

    return updated;
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prisma.chatMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        content: '[Message deleted]',
      },
    });

    // Notify participants
    const participants = await this.prisma.chatParticipant.findMany({
      where: { threadId: message.threadId },
      select: { userId: true },
    });

    for (const participant of participants) {
      this.websocketGateway.sendNotificationToUser(participant.userId, {
        type: 'chat:message:deleted',
        messageId,
      });
    }

    return { success: true };
  }

  async addReaction(
    messageId: string,
    userId: string,
    emoji: string,
  ) {
    const message = await this.prisma.chatMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    await this.verifyThreadAccess(message.threadId, userId);

    // Update reactions in metadata
    const metadata = (message.metadata as any) || {};
    const reactions = metadata.reactions || {};

    if (!reactions[emoji]) {
      reactions[emoji] = [];
    }

    if (!reactions[emoji].includes(userId)) {
      reactions[emoji].push(userId);
    } else {
      // Remove reaction if already exists
      reactions[emoji] = reactions[emoji].filter((id: string) => id !== userId);
      if (reactions[emoji].length === 0) {
        delete reactions[emoji];
      }
    }

    await this.prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        metadata: {
          ...metadata,
          reactions,
        },
      },
    });

    // Notify participants
    const participants = await this.prisma.chatParticipant.findMany({
      where: { threadId: message.threadId },
      select: { userId: true },
    });

    for (const participant of participants) {
      this.websocketGateway.sendNotificationToUser(participant.userId, {
        type: 'chat:reaction',
        messageId,
        emoji,
        userId,
        reactions,
      });
    }

    return { success: true };
  }

  async markThreadAsRead(threadId: string, userId: string) {
    await this.prisma.chatParticipant.update({
      where: {
        threadId_userId: {
          threadId,
          userId,
        },
      },
      data: {
        lastReadAt: new Date(),
        mentionCount: 0,
      },
    });

    // Get unread messages
    const messages = await this.prisma.chatMessage.findMany({
      where: {
        threadId,
        senderId: { not: userId },
        reads: {
          none: {
            userId,
          },
        },
      },
      select: { id: true },
    });

    // Mark messages as read
    for (const message of messages) {
      await this.prisma.messageRead.create({
        data: {
          messageId: message.id,
          userId,
        },
      });
    }

    // Notify via WebSocket
    this.websocketGateway.sendNotificationToUser(userId, {
      type: 'chat:thread:read',
      threadId,
    });
  }

  async searchMessages(
    userId: string,
    query: string,
    options: {
      threadId?: string;
      limit?: number;
    } = {},
  ) {
    const where: any = {
      content: {
        contains: query,
        mode: 'insensitive',
      },
      isDeleted: false,
      thread: {
        participants: {
          some: {
            userId,
            leftAt: null,
          },
        },
      },
    };

    if (options.threadId) {
      where.threadId = options.threadId;
    }

    const messages = await this.prisma.chatMessage.findMany({
      where,
      include: {
        thread: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: options.limit || 20,
    });

    return messages;
  }

  private async verifyThreadAccess(threadId: string, userId: string) {
    const participant = await this.prisma.chatParticipant.findFirst({
      where: {
        threadId,
        userId,
        leftAt: null,
      },
    });

    if (!participant) {
      throw new ForbiddenException('Access denied to this thread');
    }

    return participant;
  }
}
