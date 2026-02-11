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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { AtGuard } from 'src/common/guards/at.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import type { JwtPayload } from 'src/common/types/jwt-payload.type';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Admin Users')
@Controller('admin/users')
@UseGuards(AtGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'List users based on admin permissions' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 403, description: 'Forbidden if not admin' })
  findAll(@GetCurrentUser() user: JwtPayload) {
    return this.userService.findAll(user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Body() createUserDto: CreateUserDto,
    @GetCurrentUser() user: JwtPayload,
  ) {
    // Permission check: SuperAdmin OR Admin of 'admin' project
    const isAdminProjectAdmin =
      user.permissions?.['admin']?.role === process.env.ROLE_ADMIN;

    if (!user.isSuperAdmin && !isAdminProjectAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para crear usuarios. Se requiere ser SuperAdmin o Admin del proyecto "admin".',
      );
    }

    return this.userService.createUser(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
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
