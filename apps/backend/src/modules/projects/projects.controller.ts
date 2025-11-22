import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  async createProject(
    @Request() req,
    @Body() data: {
      name: string;
      description?: string;
      clientId?: string;
      startDate: Date;
      endDate?: Date;
      budget?: number;
      budgetCurrency?: string;
      estimatedHours?: number;
      memberIds?: string[];
    },
  ) {
    return this.projectsService.createProject(req.user.id, {
      ...data,
      companyId: req.user.companyId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get user projects' })
  async getProjects(
    @Request() req,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.projectsService.getProjects(req.user.id, {
      status,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details' })
  async getProject(@Param('id') id: string, @Request() req) {
    return this.projectsService.getProject(id, req.user.id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get project statistics' })
  async getProjectStats(@Param('id') id: string, @Request() req) {
    return this.projectsService.getProjectStats(id, req.user.id);
  }

  @Post(':id/tasks')
  @ApiOperation({ summary: 'Create a task' })
  async createTask(
    @Param('id') projectId: string,
    @Request() req,
    @Body() data: any,
  ) {
    return this.projectsService.createTask(req.user.id, { ...data, projectId });
  }

  @Put('tasks/:taskId')
  @ApiOperation({ summary: 'Update a task' })
  async updateTask(
    @Param('taskId') taskId: string,
    @Request() req,
    @Body() data: any,
  ) {
    return this.projectsService.updateTask(taskId, req.user.id, data);
  }

  @Post('tasks/:taskId/worklogs')
  @ApiOperation({ summary: 'Log work on a task' })
  async logWork(
    @Param('taskId') taskId: string,
    @Request() req,
    @Body() data: {
      minutes: number;
      description?: string;
      startedAt?: Date;
      screenshotUrls?: string[];
      isBillable?: boolean;
    },
  ) {
    return this.projectsService.logWork(taskId, req.user.id, data);
  }
}
