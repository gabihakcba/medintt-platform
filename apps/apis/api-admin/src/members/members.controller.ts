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
import { MembersService } from './members.service';
import { AtGuard } from '../common/guards/at.guard';
import { SuperAdminOrProjectAdminGuard } from '../common/guards/super-admin-or-project-admin.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Admin Members')
@Controller('admin/members')
@UseGuards(AtGuard, SuperAdminOrProjectAdminGuard)
@ApiBearerAuth()
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({ status: 201, description: 'Member created' })
  create(
    @Body()
    createMemberDto: {
      userId: string;
      projectId: string;
      roleId: string;
      organizationId?: string;
    },
  ) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all members' })
  @ApiResponse({ status: 200, description: 'List of members' })
  findAll() {
    return this.membersService.findAll();
  }

  @Get('by-org')
  @ApiOperation({ summary: 'List all members grouped by organization' })
  @ApiResponse({
    status: 200,
    description: 'List of organizations with their members',
  })
  findAllByOrg() {
    return this.membersService.findAllByOrg();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get member by id' })
  @ApiResponse({ status: 200, description: 'Member details' })
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a member' })
  @ApiResponse({ status: 200, description: 'Member updated' })
  update(
    @Param('id') id: string,
    @Body()
    updateMemberDto: {
      roleId?: string;
      organizationId?: string;
    },
  ) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a member' })
  @ApiResponse({ status: 200, description: 'Member deleted' })
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
