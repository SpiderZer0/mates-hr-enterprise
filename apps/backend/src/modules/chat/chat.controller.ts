import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('threads')
  @ApiOperation({ summary: 'Create a new chat thread' })
  async createThread(
    @Request() req,
    @Body() data: {
      type: string;
      title?: string;
      description?: string;
      participantIds?: string[];
      projectId?: string;
      departmentId?: string;
    },
  ) {
    return this.chatService.createThread(req.user.id, {
      ...data,
      companyId: req.user.companyId,
    });
  }

  @Get('threads')
  @ApiOperation({ summary: 'Get user chat threads' })
  async getThreads(
    @Request() req,
    @Query('type') type?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.chatService.getThreads(req.user.id, {
      type,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  @Get('threads/:id')
  @ApiOperation({ summary: 'Get thread details' })
  async getThread(@Param('id') id: string, @Request() req) {
    return this.chatService.getThread(id, req.user.id);
  }

  @Get('threads/:id/messages')
  @ApiOperation({ summary: 'Get thread messages' })
  async getMessages(
    @Param('id') threadId: string,
    @Request() req,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatService.getMessages(threadId, req.user.id, {
      cursor,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Post('threads/:id/messages')
  @ApiOperation({ summary: 'Send a message' })
  async sendMessage(
    @Param('id') threadId: string,
    @Request() req,
    @Body() data: {
      content: string;
      contentType?: string;
      attachmentUrl?: string;
      attachmentName?: string;
      attachmentSize?: number;
      replyToId?: string;
    },
  ) {
    return this.chatService.sendMessage(threadId, req.user.id, data);
  }

  @Patch('messages/:id')
  @ApiOperation({ summary: 'Edit a message' })
  async updateMessage(
    @Param('id') messageId: string,
    @Request() req,
    @Body('content') content: string,
  ) {
    return this.chatService.updateMessage(messageId, req.user.id, content);
  }

  @Delete('messages/:id')
  @ApiOperation({ summary: 'Delete a message' })
  async deleteMessage(@Param('id') messageId: string, @Request() req) {
    return this.chatService.deleteMessage(messageId, req.user.id);
  }

  @Post('messages/:id/reactions')
  @ApiOperation({ summary: 'Add reaction to message' })
  async addReaction(
    @Param('id') messageId: string,
    @Request() req,
    @Body('emoji') emoji: string,
  ) {
    return this.chatService.addReaction(messageId, req.user.id, emoji);
  }

  @Post('threads/:id/read')
  @ApiOperation({ summary: 'Mark thread as read' })
  async markThreadAsRead(@Param('id') threadId: string, @Request() req) {
    return this.chatService.markThreadAsRead(threadId, req.user.id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search messages' })
  async searchMessages(
    @Request() req,
    @Query('q') query: string,
    @Query('threadId') threadId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatService.searchMessages(req.user.id, query, {
      threadId,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }
}
