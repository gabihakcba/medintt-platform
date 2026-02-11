import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { resource: string; action: string; code: string }) {
    const exists = await this.prisma.permission.findFirst({
      where: {
        OR: [
          { resource: data.resource, action: data.action },
          { code: data.code },
        ],
      },
    });

    if (exists) {
      throw new Error('Permission already exists (resource/action or code)');
    }

    return this.prisma.permission.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.permission.findMany();
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }

    return permission;
  }

  async update(id: string, data: { resource?: string; action?: string }) {
    try {
      return await this.prisma.permission.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.permission.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }
  }
}
