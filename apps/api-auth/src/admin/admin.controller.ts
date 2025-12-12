import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AtGuard } from '../auth/guards/at.guard';
import { SuperAdminGuard } from '../common/guards/super-admin.guard';
import { AdminService } from './admin.service';
import {
  AssignMemberDto,
  CreateOrganizationDto,
  CreateProjectDto,
  CreateRoleDto,
} from './dto/admin.dto';

@UseGuards(AtGuard, SuperAdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // --- ROLES ---
  @Post('roles')
  createRole(@Body() dto: CreateRoleDto) {
    return this.adminService.createRole(dto);
  }

  @Get('roles')
  getRoles() {
    return this.adminService.getRoles();
  }

  // --- PROYECTOS ---
  @Post('projects')
  createProject(@Body() dto: CreateProjectDto) {
    return this.adminService.createProject(dto);
  }

  @Get('projects')
  getProjects() {
    return this.adminService.getProjects();
  }

  // --- ORGANIZACIONES ---
  @Post('organizations')
  createOrganization(@Body() dto: CreateOrganizationDto) {
    return this.adminService.createOrganization(dto);
  }

  @Get('organizations')
  getOrganizations() {
    return this.adminService.getOrganizations();
  }

  // --- MEMBRESÍAS ---

  // Asignar o Cambiar Rol (Upsert)
  @Post('members')
  assignMember(@Body() dto: AssignMemberDto) {
    return this.adminService.assignMember(dto);
  }

  // Eliminar acceso a un proyecto
  @Delete('members/:userId/:projectId')
  removeMember(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.adminService.removeMember(userId, projectId);
  }

  // Ver qué accesos tiene un usuario
  @Get('users/:userId/memberships')
  getUserMemberships(@Param('userId') userId: string) {
    return this.adminService.getUserMemberships(userId);
  }
}
