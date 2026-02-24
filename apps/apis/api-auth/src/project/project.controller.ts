import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  ForbiddenException,
  Patch,
  Param,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { AtGuard } from '../auth/guards/at.guard';
import { GetUser as GetCurrentUser } from '../auth/decorators/get-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(AtGuard)
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  private checkAdminRights(user: JwtPayload) {
    const isAdminProjectAdmin =
      user.permissions?.['admin']?.role === process.env.ROLE_ADMIN;

    if (!user.isSuperAdmin && !isAdminProjectAdmin) {
      throw new ForbiddenException(
        'Se requiere ser SuperAdmin o Admin del proyecto "admin".',
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all projects' })
  @ApiResponse({ status: 200, description: 'List of projects' })
  findAll() {
    return this.projectService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Body()
    createProjectDto: { name: string; code: string; description?: string },
    @GetCurrentUser() user: JwtPayload,
  ) {
    this.checkAdminRights(user);
    return this.projectService.create(createProjectDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Param('id') id: string,
    @Body()
    updateProjectDto: { name?: string; code?: string; description?: string },
    @GetCurrentUser() user: JwtPayload,
  ) {
    this.checkAdminRights(user);
    return this.projectService.update(id, updateProjectDto);
  }
}
