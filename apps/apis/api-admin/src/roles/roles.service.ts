import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; description?: string; code: string }) {
    return this.prisma.role.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.role.findMany();
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return role;
  }

  async update(id: string, data: { name?: string; description?: string }) {
    try {
      return await this.prisma.role.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.role.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
  }
}
