import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import moment from 'moment';

interface ActivityMetrics {
  userId: string;
  date: Date;
  focusScore: number;
  productivityScore: number;
  wellbeingScore: number;
  anomalyScore: number;
  insights: string[];
  recommendations: string[];
}

interface TeamMetrics {
  teamId: string;
  date: Date;
  averageFocusScore: number;
  averageProductivityScore: number;
  collaborationIndex: number;
  burnoutRisk: number;
  topPerformers: string[];
  needsAttention: string[];
}

@Injectable()
export class AIAnalyticsService {
  private readonly logger = new Logger(AIAnalyticsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) { }

  // Collect activity telemetry from desktop agent
  async collectTelemetry(userId: string, data: any) {
    const telemetry = await this.prisma.activityTelemetry.create({
      data: {
        userId,
        sessionId: data.sessionId,
        timestamp: new Date(data.timestamp),
        keystrokes: data.keystrokes || 0,
        mouseDistance: data.mouseDistance || 0,
        mouseClicks: data.mouseClicks || 0,
        scrollDistance: data.scrollDistance || 0,
        windowSwitches: data.windowSwitches || 0,
        idleSeconds: data.idleSeconds || 0,
        activeApp: data.activeApp,
        activeCategory: this.categorizeApp(data.activeApp),
        isMeeting: data.isMeeting || false,
      },
    });

    // Check for real-time anomalies
    await this.detectRealTimeAnomalies(userId, data);

    return telemetry;
  }

  // Aggregate daily metrics
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async aggregateDailyMetrics() {
    const yesterday = moment().subtract(1, 'day').startOf('day').toDate();
    const today = moment().startOf('day').toDate();

    // Get all users
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
    });

    for (const user of users) {
      await this.aggregateUserMetrics(user.id, yesterday, today);
    }

    // Generate team insights
    await this.generateTeamInsights(yesterday);
  }

  async aggregateUserMetrics(userId: string, startDate: Date, endDate: Date) {
    const telemetryData = await this.prisma.activityTelemetry.findMany({
      where: {
        userId,
        timestamp: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    if (telemetryData.length === 0) {
      return;
    }

    // Calculate aggregates
    const totalKeystrokes = telemetryData.reduce((sum, t) => sum + t.keystrokes, 0);
    const totalClicks = telemetryData.reduce((sum, t) => sum + t.mouseClicks, 0);
    const totalDistance = telemetryData.reduce((sum, t) => sum + t.mouseDistance, 0);
    const totalActiveTime = telemetryData.filter(t => t.idleSeconds < 30).length;
    const totalIdleTime = telemetryData.filter(t => t.idleSeconds >= 30).length;
    const totalMeetingTime = telemetryData.filter(t => t.isMeeting).length;
    const contextSwitches = telemetryData.reduce((sum, t) => sum + t.windowSwitches, 0);

    // Calculate scores
    const focusScore = this.calculateFocusScore(telemetryData);
    const productivityScore = this.calculateProductivityScore(telemetryData);
    const wellbeingScore = this.calculateWellbeingScore(telemetryData);

    // Save aggregate
    await this.prisma.activityAggregate.upsert({
      where: {
        userId_date: {
          userId,
          date: startDate,
        },
      },
      create: {
        userId,
        date: startDate,
        totalKeystrokes,
        totalClicks,
        totalDistance,
        totalActiveTime,
        totalIdleTime,
        totalMeetingTime,
        focusScore,
        productivityScore,
        contextSwitches,
        afterHoursTime: this.calculateAfterHoursTime(telemetryData),
      },
      update: {
        totalKeystrokes,
        totalClicks,
        totalDistance,
        totalActiveTime,
        totalIdleTime,
        totalMeetingTime,
        focusScore,
        productivityScore,
        contextSwitches,
        afterHoursTime: this.calculateAfterHoursTime(telemetryData),
      },
    });

    // Generate AI insights
    await this.generateInsights(userId, startDate, {
      focusScore,
      productivityScore,
      wellbeingScore,
      contextSwitches,
      afterHoursTime: this.calculateAfterHoursTime(telemetryData),
    });
  }

  private calculateFocusScore(telemetry: any[]): number {
    // Focus score based on context switches and continuous work periods
    let score = 100;
    const avgSwitches = telemetry.reduce((sum, t) => sum + t.windowSwitches, 0) / telemetry.length;

    // Penalize high context switching
    score -= Math.min(avgSwitches * 5, 50);

    // Reward continuous work periods
    let continuousWork = 0;
    for (const t of telemetry) {
      if (t.idleSeconds < 30 && t.windowSwitches < 2) {
        continuousWork++;
      }
    }
    score += Math.min((continuousWork / telemetry.length) * 30, 30);

    return Math.max(0, Math.min(100, score));
  }

  private calculateProductivityScore(telemetry: any[]): number {
    // Productivity score based on activity levels and patterns
    let score = 0;

    const activeRatio = telemetry.filter(t => t.idleSeconds < 30).length / telemetry.length;
    score += activeRatio * 40; // 40 points for active time

    const avgKeystrokes = telemetry.reduce((sum, t) => sum + t.keystrokes, 0) / telemetry.length;
    if (avgKeystrokes > 100) score += 20;
    else if (avgKeystrokes > 50) score += 10;

    const avgClicks = telemetry.reduce((sum, t) => sum + t.mouseClicks, 0) / telemetry.length;
    if (avgClicks > 20) score += 20;
    else if (avgClicks > 10) score += 10;

    // Meeting participation
    const meetingRatio = telemetry.filter(t => t.isMeeting).length / telemetry.length;
    score += meetingRatio * 20;

    return Math.max(0, Math.min(100, score));
  }

  private calculateWellbeingScore(telemetry: any[]): number {
    // Wellbeing score based on work patterns and breaks
    let score = 100;

    // Check for continuous work without breaks
    let continuousWork = 0;
    let maxContinuous = 0;

    for (const t of telemetry) {
      if (t.idleSeconds < 30) {
        continuousWork++;
        maxContinuous = Math.max(maxContinuous, continuousWork);
      } else {
        continuousWork = 0;
      }
    }

    // Penalize working too long without breaks
    if (maxContinuous > 120) { // 2 hours
      score -= 30;
    } else if (maxContinuous > 90) {
      score -= 15;
    }

    // Check for after-hours work
    const afterHours = this.calculateAfterHoursTime(telemetry);
    if (afterHours > 120) { // 2 hours after work
      score -= 20;
    } else if (afterHours > 60) {
      score -= 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  private calculateAfterHoursTime(telemetry: any[]): number {
    // Count minutes worked outside of 9-6
    let afterHoursMinutes = 0;

    for (const t of telemetry) {
      const hour = moment(t.timestamp).hour();
      if (hour < 9 || hour >= 18) {
        if (t.idleSeconds < 30) {
          afterHoursMinutes++;
        }
      }
    }

    return afterHoursMinutes;
  }

  private categorizeApp(appName: string | null): string {
    if (!appName) return 'unknown';

    const categories: Record<string, string[]> = {
      'development': ['vscode', 'intellij', 'sublime', 'atom', 'terminal', 'git'],
      'communication': ['slack', 'teams', 'zoom', 'discord', 'outlook', 'gmail'],
      'browser': ['chrome', 'firefox', 'safari', 'edge'],
      'documentation': ['word', 'docs', 'notion', 'confluence'],
      'spreadsheet': ['excel', 'sheets'],
      'design': ['figma', 'sketch', 'photoshop', 'illustrator'],
    };

    const lowerApp = appName.toLowerCase();
    for (const [category, apps] of Object.entries(categories)) {
      if (apps.some(app => lowerApp.includes(app))) {
        return category;
      }
    }

    return 'other';
  }

  async generateInsights(userId: string, date: Date, metrics: any) {
    const insights = [];
    const recommendations = [];

    // Focus insights
    if (metrics.focusScore < 50) {
      insights.push('Low focus score detected - high context switching');
      recommendations.push('Try blocking focus time in your calendar');
    } else if (metrics.focusScore > 80) {
      insights.push('Excellent focus maintained throughout the day');
    }

    // Productivity insights
    if (metrics.productivityScore < 40) {
      insights.push('Below average productivity levels');
      recommendations.push('Consider breaking tasks into smaller chunks');
    } else if (metrics.productivityScore > 75) {
      insights.push('High productivity achieved');
    }

    // Wellbeing insights
    if (metrics.wellbeingScore < 60) {
      insights.push('Wellbeing at risk - long continuous work periods detected');
      recommendations.push('Take regular breaks every hour');
    }

    // After hours work
    if (metrics.afterHoursTime > 60) {
      insights.push(`${metrics.afterHoursTime} minutes worked after hours`);
      recommendations.push('Consider better work-life balance');
    }

    // Context switching
    if (metrics.contextSwitches > 50) {
      insights.push('High context switching detected');
      recommendations.push('Group similar tasks together');
    }

    // Save insights
    for (const insight of insights) {
      await this.prisma.aIInsight.create({
        data: {
          userId,
          type: 'WELLBEING',
          title: 'Risk of Burnout',
          description: 'Extended working hours detected',
          confidence: 0.9,
          metadata: JSON.stringify({
            averageHours: metrics.totalActiveTime / 3600,
            threshold: 10,
          }),
          validUntil: moment().add(3, 'days').toDate(),
        },
      });
    }

    // Send notifications for critical insights
    if (metrics.wellbeingScore < 50 || metrics.afterHoursTime > 120) {
      await this.notificationsService.sendNotification({
        userId,
        type: 'WARNING' as any,
        priority: 'HIGH' as any,
        title: 'Wellbeing Alert',
        body: 'Your work patterns suggest you may need a break. Check your analytics for recommendations.',
        actionUrl: '/analytics/personal',
        channels: ['inapp'],
      });
    }

    return { insights, recommendations };
  }

  private determineSeverity(metrics: any): string {
    if (metrics.wellbeingScore < 40 || metrics.afterHoursTime > 180) {
      return 'critical';
    }
    if (metrics.focusScore < 50 || metrics.productivityScore < 40) {
      return 'warning';
    }
    return 'info';
  }

  async detectRealTimeAnomalies(userId: string, data: any) {
    // Detect unusual patterns in real-time
    const recentTelemetry = await this.prisma.activityTelemetry.findMany({
      where: {
        userId,
        timestamp: {
          gte: moment().subtract(1, 'hour').toDate(),
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 60, // Last hour of data
    });

    // Check for sudden inactivity
    const recentInactivity = recentTelemetry.filter(t => t.idleSeconds > 300).length;
    if (recentInactivity > 10) {
      await this.createAnomaly(userId, 'sudden_inactivity', 'Unusual inactivity detected');
    }

    // Check for unusual app usage
    if (data.activeApp && this.isUnusualApp(data.activeApp, userId)) {
      await this.createAnomaly(userId, 'unusual_app', `Unusual application detected: ${data.activeApp}`);
    }

    // Check for extreme activity
    if (data.keystrokes > 1000 || data.mouseClicks > 200) {
      await this.createAnomaly(userId, 'extreme_activity', 'Unusually high activity detected');
    }
  }

  private async isUnusualApp(appName: string, userId: string): Promise<boolean> {
    // Check if this app is unusual for this user
    const commonApps = await this.prisma.activityTelemetry.groupBy({
      by: ['activeApp'],
      where: {
        userId,
        timestamp: {
          gte: moment().subtract(30, 'days').toDate(),
        },
      },
      _count: true,
      orderBy: {
        _count: {
          activeApp: 'desc',
        },
      },
      take: 20,
    });

    const commonAppNames = commonApps.map(a => a.activeApp);
    return !commonAppNames.includes(appName);
  }

  private async createAnomaly(userId: string, type: string, description: string) {
    await this.prisma.aiInsight.create({
      data: {
        type: 'anomaly',
        category: 'activity',
        userId,
        severity: 'warning',
        title: 'Activity Anomaly Detected',
        description,
        data: { anomalyType: type },
        validUntil: moment().add(1, 'day').toDate(),
      },
    });
  }

  async generateTeamInsights(date: Date) {
    // Get all departments/teams
    const departments = await this.prisma.department.findMany({
      include: {
        employees: {
          select: { userId: true },
        },
      },
    });

    for (const dept of departments) {
      const userIds = dept.employees.map(e => e.userId);

      if (userIds.length === 0) continue;

      // Get aggregated metrics for team
      const aggregates = await this.prisma.activityAggregate.findMany({
        where: {
          userId: { in: userIds },
          date,
        },
      });

      if (aggregates.length === 0) continue;

      // Calculate team metrics
      const avgFocus = aggregates.reduce((sum, a) => sum + (a.focusScore || 0), 0) / aggregates.length;
      const avgProductivity = aggregates.reduce((sum, a) => sum + (a.productivityScore || 0), 0) / aggregates.length;
      const totalAfterHours = aggregates.reduce((sum, a) => sum + a.afterHoursTime, 0);

      // Identify top performers and those needing attention
      const sorted = aggregates.sort((a, b) => (b.productivityScore || 0) - (a.productivityScore || 0));
      const topPerformers = sorted.slice(0, 3).map(a => a.userId);
      const needsAttention = sorted.filter(a => (a.productivityScore || 0) < 40).map(a => a.userId);

      // Calculate burnout risk
      const burnoutRisk = this.calculateBurnoutRisk(aggregates);

      // Save team insight
      await this.prisma.aiInsight.create({
        data: {
          type: 'analysis',
          category: 'team',
          teamId: dept.id,
          severity: burnoutRisk > 70 ? 'warning' : 'info',
          title: `Team Analytics - ${dept.name}`,
          description: `Average Focus: ${avgFocus.toFixed(0)}%, Average Productivity: ${avgProductivity.toFixed(0)}%`,
          data: {
            avgFocus,
            avgProductivity,
            totalAfterHours,
            topPerformers,
            needsAttention,
            burnoutRisk,
          },
          validUntil: moment().add(7, 'days').toDate(),
        },
      });

      // Notify managers if burnout risk is high
      if (burnoutRisk > 70) {
        const manager = await this.prisma.employee.findFirst({
          where: {
            departmentId: dept.id,
            position: { contains: 'Manager' },
          },
        });

        if (manager) {
          await this.notificationsService.sendNotification({
            userId: manager.userId,
            type: 'WARNING' as any,
            priority: 'HIGH' as any,
            title: 'Team Wellbeing Alert',
            body: `High burnout risk detected in your team. ${needsAttention.length} team members may need support.`,
            actionUrl: '/analytics/team',
            channels: ['inapp', 'email'],
          });
        }
      }
    }
  }

  private calculateBurnoutRisk(aggregates: any[]): number {
    let riskScore = 0;

    // Factor 1: After hours work
    const avgAfterHours = aggregates.reduce((sum, a) => sum + a.afterHoursTime, 0) / aggregates.length;
    if (avgAfterHours > 120) riskScore += 30;
    else if (avgAfterHours > 60) riskScore += 15;

    // Factor 2: Low focus scores
    const lowFocusCount = aggregates.filter(a => (a.focusScore || 0) < 50).length;
    riskScore += (lowFocusCount / aggregates.length) * 30;

    // Factor 3: High context switching
    const avgSwitches = aggregates.reduce((sum, a) => sum + a.contextSwitches, 0) / aggregates.length;
    if (avgSwitches > 100) riskScore += 20;
    else if (avgSwitches > 50) riskScore += 10;

    // Factor 4: Consistent long hours
    const longHoursCount = aggregates.filter(a => a.totalActiveTime > 540).length; // > 9 hours
    riskScore += (longHoursCount / aggregates.length) * 20;

    return Math.min(100, riskScore);
  }

  // API Methods
  async getPersonalAnalytics(userId: string, period: string = 'week') {
    const startDate = this.getStartDate(period);

    const aggregates = await this.prisma.activityAggregate.findMany({
      where: {
        userId,
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    });

    const insights = await this.prisma.aIInsight.findMany({
      where: {
        userId,
        type: 'ANOMALY',
        isResolved: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      aggregates,
      insights,
      summary: this.calculateSummary(aggregates),
    };
  }

  async getTeamAnalytics(managerId: string, period: string = 'week') {
    // Get manager's team
    const manager = await this.prisma.employee.findFirst({
      where: { userId: managerId },
      include: {
        department: {
          include: {
            employees: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!manager?.department) {
      return { error: 'No team found' };
    }

    const userIds = manager.department.employees.map(e => e.userId);
    const startDate = this.getStartDate(period);

    const aggregates = await this.prisma.activityAggregate.findMany({
      where: {
        userId: { in: userIds },
        date: { gte: startDate },
      },
    });

    const insights = await this.prisma.aiInsight.findMany({
      where: {
        teamId: manager.departmentId,
        validUntil: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      teamId: manager.departmentId,
      teamName: manager.department.name,
      memberCount: userIds.length,
      aggregates: this.groupByDate(aggregates),
      insights,
      summary: this.calculateTeamSummary(aggregates, userIds.length),
    };
  }

  private getStartDate(period: string): Date {
    switch (period) {
      case 'day':
        return moment().startOf('day').toDate();
      case 'week':
        return moment().startOf('week').toDate();
      case 'month':
        return moment().startOf('month').toDate();
      default:
        return moment().subtract(7, 'days').toDate();
    }
  }

  private calculateSummary(aggregates: any[]) {
    if (aggregates.length === 0) {
      return null;
    }

    return {
      averageFocusScore: aggregates.reduce((sum, a) => sum + (a.focusScore || 0), 0) / aggregates.length,
      averageProductivityScore: aggregates.reduce((sum, a) => sum + (a.productivityScore || 0), 0) / aggregates.length,
      totalActiveTime: aggregates.reduce((sum, a) => sum + a.totalActiveTime, 0),
      totalAfterHoursTime: aggregates.reduce((sum, a) => sum + a.afterHoursTime, 0),
      totalKeystrokes: aggregates.reduce((sum, a) => sum + a.totalKeystrokes, 0),
      trend: this.calculateTrend(aggregates),
    };
  }

  private calculateTeamSummary(aggregates: any[], memberCount: number) {
    const grouped = this.groupByDate(aggregates);
    const dates = Object.keys(grouped).sort();

    const summary = dates.map(date => {
      const dayAggregates = grouped[date];
      return {
        date,
        averageFocusScore: dayAggregates.reduce((sum, a) => sum + (a.focusScore || 0), 0) / dayAggregates.length,
        averageProductivityScore: dayAggregates.reduce((sum, a) => sum + (a.productivityScore || 0), 0) / dayAggregates.length,
        activeMembers: dayAggregates.length,
        totalAfterHoursTime: dayAggregates.reduce((sum, a) => sum + a.afterHoursTime, 0),
      };
    });

    return summary;
  }

  private groupByDate(aggregates: any[]) {
    const grouped: Record<string, any[]> = {};

    for (const aggregate of aggregates) {
      const dateStr = moment(aggregate.date).format('YYYY-MM-DD');
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(aggregate);
    }

    return grouped;
  }

  private calculateTrend(aggregates: any[]) {
    if (aggregates.length < 2) {
      return 'stable';
    }

    const recent = aggregates.slice(-3);
    const previous = aggregates.slice(-6, -3);

    const recentAvg = recent.reduce((sum, a) => sum + (a.productivityScore || 0), 0) / recent.length;
    const previousAvg = previous.reduce((sum, a) => sum + (a.productivityScore || 0), 0) / previous.length;

    if (recentAvg > previousAvg * 1.1) return 'improving';
    if (recentAvg < previousAvg * 0.9) return 'declining';
    return 'stable';
  }
}
