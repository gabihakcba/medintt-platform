import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    projectId: string;
    roleId: string;
    organizationId?: string;
  }) {
    return this.prisma.member.create({
      data,
    });
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
      return await this.prisma.member.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Miembro con ID ${id} no encontrado`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.member.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Miembro con ID ${id} no encontrado`);
    }
  }
}
