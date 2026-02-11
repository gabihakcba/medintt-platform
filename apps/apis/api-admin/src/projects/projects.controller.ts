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
import { ProjectsService } from './projects.service';
import { AtGuard } from '../common/guards/at.guard';
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';
import type { JwtPayload } from '../common/types/jwt-payload.type';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Admin Projects')
@Controller('admin/projects')
@UseGuards(AtGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List all projects' })
  @ApiResponse({ status: 200, description: 'List of projects' })
  findAll() {
    return this.projectsService.findAll();
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
    // Permission check: SuperAdmin OR Admin of 'admin' project
    const isAdminProjectAdmin =
      user.permissions?.['admin']?.role === process.env.ROLE_ADMIN;

    if (!user.isSuperAdmin && !isAdminProjectAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para crear proyectos. Se requiere ser SuperAdmin o Admin del proyecto "admin".',
      );
    }

    return this.projectsService.create(createProjectDto);
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
    // Permission check: SuperAdmin OR Admin of 'admin' project
    const isAdminProjectAdmin =
      user.permissions?.['admin']?.role === process.env.ROLE_ADMIN;

    if (!user.isSuperAdmin && !isAdminProjectAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para editar proyectos. Se requiere ser SuperAdmin o Admin del proyecto "admin".',
      );
    }

    return this.projectsService.update(id, updateProjectDto);
  }
}
