import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@medintt/database-auth';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import * as argon2 from 'argon2';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserDeletedEvent } from 'src/auth/events/user-deleted.event';

export interface UpdateUserData {
  email?: string;
  username?: string;
  dni?: string;
  password?: string;
  name?: string;
  lastName?: string;
  cargo?: string;
  celular?: string;
  isVerified?: boolean;
  isActive?: boolean;
}

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
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

  async findAll(currentUser: JwtPayload) {
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

    const roleAdmin = process.env.ROLE_ADMIN;
    if (!roleAdmin) {
      throw new Error('ROLE_ADMIN environment variable not set');
    }

    const adminProjectIds = requester.memberships
      .filter((m) => m.role.code === roleAdmin)
      .map((m) => m.projectId);

    if (adminProjectIds.length === 0) {
      throw new ForbiddenException(
        `No tienes permisos de administrador en ningún proyecto.`,
      );
    }

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

  async remove(id: string) {
    try {
      const userWithMemberships = await this.prisma.user.findUnique({
        where: { id },
        include: {
          memberships: {
            include: { role: true, project: true },
          },
        },
      });

      if (!userWithMemberships) {
        throw new BadRequestException('Usuario no encontrado.');
      }

      const isCloudMember = userWithMemberships.memberships.some(
        (m) =>
          m.project.code === process.env.CLOUD_PROJECT &&
          m.role.code === process.env.ROLE_MEMBER,
      );

      const deleted = await this.prisma.user.delete({
        where: { id },
      });

      this.eventEmitter.emit(
        'user.deleted',
        new UserDeletedEvent(id, isCloudMember),
      );

      return deleted;
    } catch {
      throw new BadRequestException(
        'Usuario no encontrado o conflicto de llaves foráneas.',
      );
    }
  }
}
