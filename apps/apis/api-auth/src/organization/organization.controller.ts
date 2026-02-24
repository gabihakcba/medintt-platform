import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { AtGuard } from '../auth/guards/at.guard';
import { GetUser as GetCurrentUser } from '../auth/decorators/get-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(AtGuard)
@ApiBearerAuth()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  private checkAdminRights(user: JwtPayload) {
    const isAdminProjectAdmin =
      user.permissions?.['admin']?.role === process.env.ROLE_ADMIN;

    if (!user.isSuperAdmin && !isAdminProjectAdmin) {
      throw new ForbiddenException(
        'Se requiere ser SuperAdmin o Admin del proyecto "admin".',
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({ status: 201, description: 'Organization created' })
  create(
    @Body()
    createOrganizationDto: {
      id: string;
      name: string;
      code: string;
      cuit?: string;
    },
    @GetCurrentUser() user: JwtPayload,
  ) {
    this.checkAdminRights(user);
    return this.organizationService.create(createOrganizationDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all organizations' })
  @ApiResponse({ status: 200, description: 'List of organizations' })
  findAll(@GetCurrentUser() user: JwtPayload) {
    this.checkAdminRights(user);
    return this.organizationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by id' })
  @ApiResponse({ status: 200, description: 'Organization details' })
  findOne(@Param('id') id: string, @GetCurrentUser() user: JwtPayload) {
    this.checkAdminRights(user);
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an organization' })
  @ApiResponse({ status: 200, description: 'Organization updated' })
  update(
    @Param('id') id: string,
    @Body()
    updateOrganizationDto: { name?: string; code?: string; cuit?: string },
    @GetCurrentUser() user: JwtPayload,
  ) {
    this.checkAdminRights(user);
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organization' })
  @ApiResponse({ status: 200, description: 'Organization deleted' })
  remove(@Param('id') id: string, @GetCurrentUser() user: JwtPayload) {
    this.checkAdminRights(user);
    return this.organizationService.remove(id);
  }
}
