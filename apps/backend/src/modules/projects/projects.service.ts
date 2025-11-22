import { Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface AddMemberDto {
  userId: string;
  role: string;
  allocatedHours?: number;
  hourlyRate?: number;
}

export interface CreateTaskDto {
  projectId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  priority?: string;
  dueDate?: Date;
  estimatedMinutes?: number;
  parentId?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  dueDate?: Date;
  estimatedMinutes?: number;
  actualMinutes?: number;
}

export interface LogWorkDto {
  minutes: number;
  description?: string;
  startedAt?: Date;
  screenshotUrls?: string[];
  isBillable?: boolean;
}

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) { }

  async createProject(userId: string, data: any) {
    const project = await this.prisma.project.create({
      data: {
        ...data,
        code: await this.generateProjectCode(),
        ownerId: userId,
        status: 'PLANNING',
        members: {
          create: {
            userId,
            role: 'owner',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    // Create default boards
    await this.createDefaultBoards(project.id);

    // Send notifications to members
    if (data.memberIds && data.memberIds.length > 0) {
      for (const memberId of data.memberIds) {
        await this.notificationsService.sendNotification({
          userId: memberId,
          type: 'INFO' as any,
          priority: 'NORMAL' as any,
          title: 'Added to Project',
          body: `You have been added to project: ${project.name}`,
          actionUrl: `/projects/${project.id}`,
        });
      }
    }

    return project;
  }

  async getProjects(userId: string, filters: any = {}) {
    const where: any = {
      members: {
        some: {
          userId,
          leftAt: null,
        },
      },
    };

    if (filters.status) {
      where.status = filters.status;
    }

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        include: {
          members: {
            take: 5,
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
          _count: {
            select: {
              tasks: true,
              members: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 10,
        skip: filters.offset || 0,
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: projects,
      total,
      limit: filters.limit || 10,
      offset: filters.offset || 0,
    };
  }

  async getProject(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        members: true,
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check access
    const isMember = project.members.some((m) => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('Access denied');
    }

    return project;
  }

  async getProjectMembers(projectId: string, userId: string) {
    await this.verifyProjectMember(projectId, userId);

    return this.prisma.projectMember.findMany({
      where: { projectId, leftAt: null },
    });
  }

  async addMember(projectId: string, userId: string, data: AddMemberDto) {
    await this.verifyProjectMember(projectId, userId);

    const existingMember = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: data.userId,
        },
      },
    });

    if (existingMember) {
      if (existingMember.leftAt) {
        return this.prisma.projectMember.update({
          where: { id: existingMember.id },
          data: {
            leftAt: null,
            role: data.role,
            allocatedHours: data.allocatedHours,
            hourlyRate: data.hourlyRate,
          },
        });
      }
      throw new BadRequestException('User is already a member of this project');
    }

    return this.prisma.projectMember.create({
      data: {
        projectId,
        userId: data.userId,
        role: data.role,
        allocatedHours: data.allocatedHours,
        hourlyRate: data.hourlyRate,
      },
    });
  }

  async getProjectTasks(projectId: string, userId: string) {
    await this.verifyProjectMember(projectId, userId);

    return this.prisma.task.findMany({
      where: { projectId, parentId: null },
      include: {
        _count: {
          select: {
            subTasks: true,
            workLogs: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTask(userId: string, data: CreateTaskDto) {
    // Verify user is project member
    await this.verifyProjectMember(data.projectId, userId);

    return this.prisma.task.create({
      data: {
        ...data,
        status: 'TODO',
      },
    });
  }

  async updateTask(taskId: string, userId: string, data: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.verifyProjectMember(task.projectId, userId);

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data,
    });

    // Handle status change notifications
    if (data.status && data.status !== task.status) {
      if (data.status === 'DONE') {
        // await this.checkAchievements(userId, task.projectId);
      }

      // Notify relevant users
      // const project = await this.prisma.project.findUnique({
      //   where: { id: task.projectId },
      //   select: { ownerId: true },
      // });

      // if (project?.ownerId && project.ownerId !== userId) {
      //   await this.notificationsService.sendNotification({
      //     userId: project.ownerId,
      //     type: 'INFO' as any,
      //     priority: 'NORMAL' as any,
      //     title: 'Task Status Updated',
      //     body: `Task "${task.title}" status changed to ${data.status}`,
      //     actionUrl: `/projects/${task.projectId}/tasks/${task.id}`,
      //   });
      // }
    }

    return updatedTask;
  }

  async logWork(userId: string, taskId: string, data: LogWorkDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.verifyProjectMember(task.projectId, userId);

    const worklog = await this.prisma.workLog.create({
      data: {
        taskId,
        userId,
        projectId: task.projectId,
        minutes: data.minutes,
        description: data.description,
        startedAt: data.startedAt || new Date(),
        screenshotUrls: data.screenshotUrls ? JSON.stringify(data.screenshotUrls) : '[]',
        isBillable: data.isBillable ?? true,
      },
    });

    // Update task actual time
    const totalMinutes = await this.prisma.workLog.aggregate({
      where: { taskId },
      _sum: { minutes: true },
    });

    await this.prisma.task.update({
      where: { id: taskId },
      data: {
        actualMinutes: totalMinutes._sum.minutes || 0,
      },
    });

    // Check for time-based achievements
    // await this.checkTimeAchievements(userId, task.projectId);

    return worklog;
  }

  async getProjectStats(projectId: string, userId: string) {
    await this.verifyProjectMember(projectId, userId);

    const [
      taskStats,
      memberStats,
      timeStats,
      // milestoneStats,
    ] = await Promise.all([
      // Task statistics
      this.prisma.task.groupBy({
        by: ['status'],
        where: { projectId },
        _count: true,
      }),
      // Member statistics
      this.prisma.projectMember.count({
        where: { projectId, leftAt: null },
      }),
      // Time statistics
      this.prisma.workLog.aggregate({
        where: { projectId },
        _sum: { minutes: true },
        _count: true,
      }),
      // Milestone statistics
      // this.prisma.milestone.groupBy({
      //   by: ['status'],
      //   where: { projectId },
      //   _count: true,
      // }),
    ]);

    return {
      tasks: taskStats,
      members: memberStats,
      time: {
        totalMinutes: timeStats._sum.minutes || 0,
        totalLogs: timeStats._count,
      },
      // milestones: milestoneStats,
    };
  }

  async checkAchievements(userId: string, projectId: string) {
    // Achievement model is missing in schema, disabling for now
    return;
    /*
    // Check for task completion achievements
    const completedTasks = await this.prisma.task.count({
      where: {
        projectId,
        assigneeId: userId,
        status: 'DONE',
      },
    });

    const achievements = [];

    if (completedTasks === 10) {
      achievements.push({
        badgeKey: 'first_10_tasks',
        title: 'Task Rookie',
        description: 'Completed first 10 tasks',
        points: 50,
      });
    }

    if (completedTasks === 50) {
      achievements.push({
        badgeKey: 'task_expert',
        title: 'Task Expert',
        description: 'Completed 50 tasks',
        points: 200,
      });
    }

    if (completedTasks === 100) {
      achievements.push({
        badgeKey: 'task_master',
        title: 'Task Master',
        description: 'Completed 100 tasks',
        points: 500,
      });
    }

    // Award achievements
    for (const achievement of achievements) {
      const existing = await this.prisma.achievement.findFirst({
        where: {
          userId,
          badgeKey: achievement.badgeKey,
        },
      });

      if (!existing) {
        await this.prisma.achievement.create({
          data: {
            userId,
            projectId,
            ...achievement,
          },
        });

        await this.notificationsService.sendNotification({
          userId,
          type: 'SUCCESS' as any,
          priority: 'HIGH' as any,
          title: 'Achievement Unlocked! 🏆',
          body: `You earned: ${achievement.title}`,
          actionUrl: `/profile/achievements`,
        });
      }
    }
    */
  }

  async checkTimeAchievements(userId: string, projectId: string) {
    // Achievement model is missing in schema, disabling for now
    return;
    /*
    // Check for time logging achievements
    const totalTime = await this.prisma.workLog.aggregate({
      where: {
        projectId,
        userId,
      },
      _sum: { minutes: true },
    });

    const totalMinutes = totalTime._sum.minutes || 0;
    const totalHours = Math.floor(totalMinutes / 60);

    const achievements = [];

    if (totalHours >= 40) {
      achievements.push({
        badgeKey: 'week_warrior',
        title: 'Week Warrior',
        description: 'Logged 40+ hours on a project',
        points: 100,
      });
    }

    if (totalHours >= 160) {
      achievements.push({
        badgeKey: 'month_marathoner',
        title: 'Month Marathoner',
        description: 'Logged 160+ hours on a project',
        points: 300,
      });
    }

    // Award achievements
    for (const achievement of achievements) {
      const existing = await this.prisma.achievement.findFirst({
        where: {
          userId,
          projectId,
          badgeKey: achievement.badgeKey,
        },
      });

      if (!existing) {
        await this.prisma.achievement.create({
          data: {
            userId,
            projectId,
            ...achievement,
          },
        });

        await this.notificationsService.sendNotification({
          userId,
          type: 'SUCCESS' as any,
          priority: 'HIGH' as any,
          title: 'Achievement Unlocked! 🏆',
          body: `You earned: ${achievement.title}`,
          actionUrl: `/profile/achievements`,
        });
      }
    }
    */
  }

  private async verifyProjectMember(projectId: string, userId: string) {
    const member = await this.prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
        leftAt: null,
      },
    });

    if (!member) {
      throw new ForbiddenException('Access denied to this project');
    }

    return member;
  }

  private async generateProjectCode(): Promise<string> {
    const prefix = 'PRJ';
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${randomNum}`;
  }

  private async createDefaultBoards(projectId: string) {
    // Create default Kanban columns
    const columns = ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'];

    // This is a simplified version - in a real app, you'd have a boards table
    // For now, we'll use the boardColumn field in tasks
    this.logger.log(`Default boards would be created for project ${projectId}`);
  }
}
