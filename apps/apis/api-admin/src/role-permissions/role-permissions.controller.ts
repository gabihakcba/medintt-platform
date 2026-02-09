import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { AtGuard } from '../common/guards/at.guard';
import { SuperAdminOrProjectAdminGuard } from '../common/guards/super-admin-or-project-admin.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Admin Role Permissions')
@Controller('admin/role-permissions')
@UseGuards(AtGuard, SuperAdminOrProjectAdminGuard)
@ApiBearerAuth()
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Assign permission to role' })
  @ApiResponse({ status: 201, description: 'Permission assigned' })
  create(
    @Body() createRolePermissionDto: { roleId: string; permissionId: string },
  ) {
    return this.rolePermissionsService.create(createRolePermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all role permissions' })
  @ApiResponse({ status: 200, description: 'List of role permissions' })
  findAll(@Query('roleId') roleId?: string) {
    if (roleId) {
      return this.rolePermissionsService.findByRole(roleId);
    }
    return this.rolePermissionsService.findAll();
  }

  @Delete(':roleId/:permissionId')
  @ApiOperation({ summary: 'Remove permission from role' })
  @ApiResponse({ status: 200, description: 'Permission removed' })
  remove(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolePermissionsService.remove(roleId, permissionId);
  }
}
