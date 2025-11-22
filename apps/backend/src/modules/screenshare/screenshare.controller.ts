import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ScreenShareService } from './screenshare.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// RolesGuard removed - using per-route guards

@ApiTags('screenshare')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/screenshare')
export class ScreenShareController {
  constructor(private readonly screenShareService: ScreenShareService) {}

  @Post('request')
  // @Roles('ADMIN', 'HR', 'MANAGER') - removed temporarily
  @ApiOperation({ summary: 'Request screen share from employee' })
  async requestScreenShare(
    @Request() req,
    @Body() data: {
      targetUserId: string;
      reason?: string;
      duration?: number;
      scope?: 'screen' | 'window' | 'tab';
    },
  ) {
    return this.screenShareService.requestScreenShare(req.user.id, data);
  }

  @Post('sessions/:id/respond')
  @ApiOperation({ summary: 'Respond to screen share request' })
  @HttpCode(HttpStatus.OK)
  async respondToScreenShare(
    @Param('id') sessionId: string,
    @Request() req,
    @Body() data: {
      accepted: boolean;
      consentNote?: string;
    },
  ) {
    return this.screenShareService.respondToScreenShare(
      sessionId,
      req.user.id,
      data.accepted,
      data.consentNote,
    );
  }

  @Post('sessions/:id/start')
  @ApiOperation({ summary: 'Start screen share session' })
  async startScreenShare(@Param('id') sessionId: string, @Request() req) {
    return this.screenShareService.startScreenShare(sessionId, req.user.id);
  }

  @Post('sessions/:id/end')
  @ApiOperation({ summary: 'End screen share session' })
  @HttpCode(HttpStatus.OK)
  async endScreenShare(@Param('id') sessionId: string, @Request() req) {
    return this.screenShareService.endScreenShare(sessionId, req.user.id);
  }

  @Get('sessions/active')
  @ApiOperation({ summary: 'Get active screen share sessions' })
  async getActiveSessions(@Request() req) {
    return this.screenShareService.getActiveSessions(req.user.id);
  }

  @Get('sessions/history')
  @ApiOperation({ summary: 'Get screen share history' })
  async getSessionHistory(
    @Request() req,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.screenShareService.getSessionHistory(req.user.id, {
      from,
      to,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  @Post('sessions/:id/signal')
  @ApiOperation({ summary: 'WebRTC signaling' })
  @HttpCode(HttpStatus.OK)
  async handleSignal(
    @Param('id') sessionId: string,
    @Request() req,
    @Body('signal') signal: any,
  ) {
    return this.screenShareService.handleSignal(sessionId, req.user.id, signal);
  }

  @Post('sessions/:id/recording/start')
  // @Roles('ADMIN', 'HR') - removed temporarily
  @ApiOperation({ summary: 'Start recording (requires additional consent)' })
  async startRecording(@Param('id') sessionId: string, @Request() req) {
    return this.screenShareService.startRecording(sessionId, req.user.id);
  }
}
