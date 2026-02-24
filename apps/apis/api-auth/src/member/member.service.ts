import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserPermissionsUpdatedEvent } from '../auth/events/user-permissions-updated.event';

@Injectable()
export class MemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(data: {
    userId: string;
    projectId: string;
    roleId: string;
    organizationId?: string;
  }) {
    const member = await this.prisma.member.create({
      data,
      include: {
        user: true,
        organization: true,
        project: true,
        role: true,
      },
    });

    this.eventEmitter.emit(
      'user.permissions.updated',
      new UserPermissionsUpdatedEvent(
        member.user.id,
        member.user.email,
        member.organization?.id || '',
        member.organization?.name || '',
        `${member.user.lastName} ${member.user.name}`.trim(),
        ['member'], // Default for generic members triggering nextcloud sharing
        false,
        member.user.name,
        member.user.lastName,
        member.user.dni,
        'created',
        member.role.id,
        member.role.code,
        member.project.id,
        member.project.code,
        member.organization?.code,
      ),
    );

    return member;
  }

  async findAll() {
    return this.prisma.member.findMany({
      include: {
        user: true,
        project: true,
        role: true,
        organization: true,
      },
    });
  }

  async findAllByOrg() {
    return this.prisma.organization.findMany({
      include: {
        members: {
          include: {
            user: true,
            project: true,
            role: true,
            organization: true,
          },
        },
      },
    });
  }

  async findAllByUser() {
    return this.prisma.user.findMany({
      where: {
        memberships: {
          some: {}, // Solo retorna usuarios con al menos 1 membresía
        },
      },
      include: {
        memberships: {
          include: {
            project: true,
            role: true,
            organization: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: {
        user: true,
        project: true,
        role: true,
        organization: true,
      },
    });

    if (!member) {
      throw new NotFoundException(`Miembro con ID ${id} no encontrado`);
    }

    return member;
  }

  async update(
    id: string,
    data: {
      userId?: string;
      projectId?: string;
      roleId?: string;
      organizationId?: string;
    },
  ) {
    try {
      const member = await this.prisma.member.update({
        where: { id },
        data,
        include: {
          user: true,
          organization: true,
          project: true,
          role: true,
        },
      });

      this.eventEmitter.emit(
        'user.permissions.updated',
        new UserPermissionsUpdatedEvent(
          member.user.id,
          member.user.email,
          member.organization?.id || '',
          member.organization?.name || '',
          `${member.user.lastName} ${member.user.name}`.trim(),
          ['member'],
          false,
          member.user.name,
          member.user.lastName,
          member.user.dni,
          'updated',
          member.role.id,
          member.role.code,
          member.project.id,
          member.project.code,
          member.organization?.code,
        ),
      );

      return member;
    } catch {
      throw new NotFoundException(`Miembro con ID ${id} no encontrado`);
    }
  }

  async remove(id: string) {
    try {
      const member = await this.prisma.member.delete({
        where: { id },
        include: {
          user: true,
          organization: true,
          project: true,
          role: true,
        },
      });

      this.eventEmitter.emit(
        'user.permissions.updated',
        new UserPermissionsUpdatedEvent(
          member.user.id,
          member.user.email,
          member.organization?.id || '',
          member.organization?.name || '',
          `${member.user.lastName} ${member.user.name}`.trim(),
          [], // No permissions after removal
          false,
          member.user.name,
          member.user.lastName,
          member.user.dni,
          'deleted',
          member.role.id,
          member.role.code,
          member.project.id,
          member.project.code,
          member.organization?.code,
        ),
      );

      return member;
    } catch {
      throw new NotFoundException(`Miembro con ID ${id} no encontrado`);
    }
  }
}
