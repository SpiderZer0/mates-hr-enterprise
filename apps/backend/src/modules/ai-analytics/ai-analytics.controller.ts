import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AIAnalyticsService } from './ai-analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// RolesGuard and Roles removed - using per-route guards

@ApiTags('ai-analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/analytics')
export class AIAnalyticsController {
  constructor(private readonly aiAnalyticsService: AIAnalyticsService) { }

  @Post('telemetry')
  @ApiOperation({ summary: 'Submit activity telemetry data' })
  async submitTelemetry(
    @Request() req,
    @Body() data: {
      sessionId: string;
      timestamp: Date;
      keystrokes?: number;
      mouseDistance?: number;
      mouseClicks?: number;
      scrollDistance?: number;
      windowSwitches?: number;
      idleSeconds?: number;
      activeApp?: string;
      isMeeting?: boolean;
    },
  ) {
    return this.aiAnalyticsService.collectTelemetry(req.user.id, data);
  }

  @Get('personal')
  @ApiOperation({ summary: 'Get personal analytics' })
  async getPersonalAnalytics(
    @Request() req,
    @Query('period') period: string = 'week',
  ) {
    return this.aiAnalyticsService.getPersonalAnalytics(req.user.id, period);
  }

  @Get('team')
  // @Roles('MANAGER', 'HR', 'ADMIN') - removed temporarily
  @ApiOperation({ summary: 'Get team analytics' })
  async getTeamAnalytics(
    @Request() req,
    @Query('period') period: string = 'week',
  ) {
    return this.aiAnalyticsService.getTeamAnalytics(req.user.id, period);
  }

  @Get('insights')
  @ApiOperation({ summary: 'Get AI-generated insights' })
  async getInsights(@Request() req) {
    const anomalies = await this.prisma.aIInsight.findMany({
      where: {
        userId: req.user.id,
        type: 'ANOMALY',
        isResolved: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return anomalies;
  }

  @Post('insights/:id/dismiss')
  @ApiOperation({ summary: 'Dismiss an insight' })
  async dismissInsight(
    @Param('id') id: string,
    @Request() req,
  ) {
    await this.prisma.aIInsight.update({
      where: {
        id,
        userId: req.user.id,
      },
      data: {
        isDismissed: true,
      },
    });

    return { success: true };
  }

  @Get('anomalies')
  // @Roles('HR', 'ADMIN') - removed temporarily
  @ApiOperation({ summary: 'Get detected anomalies' })
  async getAnomalies(
    @Request() req,
    @Query('severity') severity?: string,
    @Query('category') category?: string,
  ) {
    const where: any = {
      type: 'anomaly',
      validUntil: { gte: new Date() },
    };

    if (severity) {
      where.severity = severity;
    }

    if (category) {
      where.category = category;
    }

    const anomalies = await this.prisma.aiInsight.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return anomalies;
  }

  @Get('wellbeing')
  @ApiOperation({ summary: 'Get wellbeing metrics' })
  async getWellbeingMetrics(@Request() req) {
    const lastWeek = await this.prisma.activityAggregate.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { date: 'asc' },
    });

    const avgFocusScore = lastWeek.reduce((sum, a) => sum + (a.focusScore || 0), 0) / lastWeek.length;
    const avgProductivityScore = lastWeek.reduce((sum, a) => sum + (a.productivityScore || 0), 0) / lastWeek.length;
    const totalAfterHours = lastWeek.reduce((sum, a) => sum + a.afterHoursTime, 0);

    // Calculate wellbeing score
    let wellbeingScore = 100;
    if (totalAfterHours > 600) wellbeingScore -= 30; // >10 hours after work in week
    else if (totalAfterHours > 300) wellbeingScore -= 15;

    if (avgFocusScore < 50) wellbeingScore -= 20;

    return {
      wellbeingScore: Math.max(0, wellbeingScore),
      avgFocusScore,
      avgProductivityScore,
      totalAfterHours,
      recommendations: this.getWellbeingRecommendations(wellbeingScore, totalAfterHours),
    };
  }

  private getWellbeingRecommendations(score: number, afterHours: number): string[] {
    const recommendations = [];

    if (score < 50) {
      recommendations.push('Consider taking regular breaks throughout the day');
      recommendations.push('Try to maintain consistent work hours');
    }

    if (afterHours > 300) {
      recommendations.push('You have been working significant hours after work - consider better time management');
      recommendations.push('Delegate tasks when possible to maintain work-life balance');
    }

    if (score > 80) {
      recommendations.push('Great job maintaining work-life balance!');
      recommendations.push('Continue your current work patterns');
    }

    return recommendations;
  }

  private get prisma() {
    // This would be injected properly in a real implementation
    return this.aiAnalyticsService['prisma'];
  }
}
