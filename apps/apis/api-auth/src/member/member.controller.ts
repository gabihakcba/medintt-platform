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
import { MemberService } from './member.service';
import { AtGuard } from '../auth/guards/at.guard';
import { GetUser as GetCurrentUser } from '../auth/decorators/get-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Members')
@Controller('members')
@UseGuards(AtGuard)
@ApiBearerAuth()
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

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
    @GetCurrentUser() user: JwtPayload,
  ) {
    this.checkAdminRights(user);
    return this.memberService.create(createMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all members' })
  @ApiResponse({ status: 200, description: 'List of members' })
  findAll(@GetCurrentUser() user: JwtPayload) {
    this.checkAdminRights(user);
    return this.memberService.findAll();
  }

  @Get('by-org')
  @ApiOperation({ summary: 'List all members grouped by organization' })
  @ApiResponse({
    status: 200,
    description: 'List of organizations with their members',
  })
  findAllByOrg(@GetCurrentUser() user: JwtPayload) {
    this.checkAdminRights(user);
    return this.memberService.findAllByOrg();
  }

  @Get('by-user')
  @ApiOperation({ summary: 'List all members grouped by user' })
  @ApiResponse({
    status: 200,
    description: 'List of users with their memberships',
  })
  findAllByUser(@GetCurrentUser() user: JwtPayload) {
    this.checkAdminRights(user);
    return this.memberService.findAllByUser();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get member by id' })
  @ApiResponse({ status: 200, description: 'Member details' })
  findOne(@Param('id') id: string, @GetCurrentUser() user: JwtPayload) {
    this.checkAdminRights(user);
    return this.memberService.findOne(id);
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
    @GetCurrentUser() user: JwtPayload,
  ) {
    this.checkAdminRights(user);
    return this.memberService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a member' })
  @ApiResponse({ status: 200, description: 'Member deleted' })
  remove(@Param('id') id: string, @GetCurrentUser() user: JwtPayload) {
    this.checkAdminRights(user);
    return this.memberService.remove(id);
  }
}
