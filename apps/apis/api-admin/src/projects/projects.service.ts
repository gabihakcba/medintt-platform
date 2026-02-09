import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(data: { name: string; code: string; description?: string }) {
    return this.prisma.project.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        isActive: true,
      },
    });
  }

  async update(
    id: string,
    data: { name?: string; code?: string; description?: string },
  ) {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }
}
