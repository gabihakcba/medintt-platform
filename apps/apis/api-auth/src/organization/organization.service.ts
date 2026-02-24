import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    id: string;
    name: string;
    code: string;
    cuit?: string;
  }) {
    return this.prisma.organization.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.organization.findMany();
  }

  async findOne(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException(`Organización con ID ${id} no encontrada`);
    }

    return organization;
  }

  async update(
    id: string,
    data: { name?: string; code?: string; cuit?: string },
  ) {
    try {
      return await this.prisma.organization.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Organización con ID ${id} no encontrada`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.organization.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Organización con ID ${id} no encontrada`);
    }
  }
}
