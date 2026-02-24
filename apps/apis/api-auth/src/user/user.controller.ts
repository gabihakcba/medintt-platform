import {
  Controller,
  Get,
  Body,
  UseGuards,
  ForbiddenException,
  Patch,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AtGuard } from 'src/auth/guards/at.guard';
import { GetUser as GetCurrentUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(AtGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'List users based on permissions' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll(@GetCurrentUser() user: JwtPayload) {
    return this.userService.findAll(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: any,
    @GetCurrentUser() user: JwtPayload,
  ) {
    // Permission check: SuperAdmin OR Admin of 'admin' project
    const isAdminProjectAdmin =
      user.permissions?.['admin']?.role === process.env.ROLE_ADMIN;

    if (!user.isSuperAdmin && !isAdminProjectAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para editar usuarios. Se requiere ser SuperAdmin o Admin del proyecto "admin".',
      );
    }

    return this.userService.updateUser(id, updateUserDto);
  }
}
