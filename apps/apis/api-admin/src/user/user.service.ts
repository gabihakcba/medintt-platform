import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@medintt/database-auth';
import { RegisterDto } from '@medintt/types-auth';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username },
          { dni: data.dni },
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        'El usuario ya existe (email, username o DNI duplicado).',
      );
    }

    const hashedPassword = await argon2.hash(data.password);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        isVerified: false,
      },
    });
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.prisma.user.findUnique({ where: { id } });

    if (!userToUpdate) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    if (data.email || data.username || data.dni) {
      const conflicts: Prisma.UserWhereInput[] = [];
      if (data.email) conflicts.push({ email: data.email });
      if (data.username) conflicts.push({ username: data.username });
      if (data.dni) conflicts.push({ dni: data.dni });

      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: conflicts,
          NOT: {
            id: id,
          },
        },
      });

      if (existingUser) {
        throw new BadRequestException(
          'El email, username o DNI ya está en uso por otro usuario.',
        );
      }
    }

    if (data.password) {
      data.password = await argon2.hash(data.password);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async create(
    data: RegisterDto,
    ctx?: Prisma.TransactionClient,
  ): Promise<User> {
    const client = ctx || this.prisma;
    return await client.user.create({
      data: {
        ...data,
        isVerified: false,
      },
    });
  }

  async findOneById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(
    email: string,
    ctx?: Prisma.TransactionClient,
  ): Promise<User | null> {
    const client = ctx || this.prisma;

    return await client.user.findUnique({
      where: { email },
    });
  }

  async markEmailAsVerified(
    id: string,
    ctx?: Prisma.TransactionClient,
  ): Promise<User> {
    const client = ctx || this.prisma;

    return await client.user.update({
      where: { id },
      data: {
        isVerified: true,
      },
    });
  }

  async updatePassword(id: string, newPasswordHash: string) {
    return await this.prisma.user.update({
      where: { id },
      data: { password: newPasswordHash },
    });
  }

  async setTwoFactorSecret(userId: string, secret: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret,
      },
    });
  }

  async turnOnTwoFactorAuthentication(userId: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        isTwoFactorEnabled: true,
      },
    });
  }

  // --- NEW METHOD FOR ADMIN USERS LIST ---
  async findAll(currentUser: JwtPayload) {
    // 1. If SuperAdmin, return all users
    if (currentUser.isSuperAdmin) {
      return this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          lastName: true,
          dni: true,
          isVerified: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    // 2. If not SuperAdmin, check DB for Project Admin permissions
    // Fetch requester with memberships and roles
    const requester = await this.prisma.user.findUnique({
      where: { id: currentUser.sub },
      include: {
        memberships: {
          include: {
            role: true,
            project: true,
          },
        },
      },
    });

    if (!requester) {
      throw new ForbiddenException('Usuario no encontrado.');
    }

    // Filter projects where requester has 'ADMIN' role
    // Note: Assuming role code 'ADMIN' exists in DB.
    const roleAdmin = process.env.ROLE_ADMIN;
    if (!roleAdmin) {
      throw new Error('ROLE_ADMIN environment variable not set');
    }

    const adminProjectIds = requester.memberships
      .filter((m) => m.role.code === roleAdmin)
      .map((m) => m.projectId);

    if (adminProjectIds.length === 0) {
      throw new ForbiddenException(
        `No tienes permisos de administrador en ningún proyecto. Debug: ${JSON.stringify(
          currentUser,
        )}`,
      );
    }

    // Return users who are members of those projects
    return this.prisma.user.findMany({
      where: {
        memberships: {
          some: {
            projectId: { in: adminProjectIds },
          },
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        lastName: true,
        dni: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
