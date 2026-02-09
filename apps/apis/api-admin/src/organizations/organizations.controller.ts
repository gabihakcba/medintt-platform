import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { AtGuard } from '../common/guards/at.guard';
import { SuperAdminOrProjectAdminGuard } from '../common/guards/super-admin-or-project-admin.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Admin Organizations')
@Controller('admin/organizations')
@UseGuards(AtGuard, SuperAdminOrProjectAdminGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({ status: 201, description: 'Organization created' })
  create(
    @Body()
    createOrganizationDto: {
      name: string;
      code: string;
      cuit?: string;
    },
  ) {
    console.log(createOrganizationDto);
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all organizations' })
  @ApiResponse({ status: 200, description: 'List of organizations' })
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by id' })
  @ApiResponse({ status: 200, description: 'Organization details' })
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an organization' })
  @ApiResponse({ status: 200, description: 'Organization updated' })
  update(
    @Param('id') id: string,
    @Body()
    updateOrganizationDto: { name?: string; code?: string; cuit?: string },
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organization' })
  @ApiResponse({ status: 200, description: 'Organization deleted' })
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }
}
