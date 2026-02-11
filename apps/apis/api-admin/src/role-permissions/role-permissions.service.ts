import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolePermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { roleId: string; permissionId: string }) {
    return this.prisma.rolePermission.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.rolePermission.findMany({
      include: {
        role: true,
        permission: true,
      },
    });
  }

  // Composite ID handling could be complex in REST, so maybe filtering by roleId is better for standard usage.
  // But strictly following CRUD for the resource:

  async findByRole(roleId: string) {
    return this.prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });
  }

  async remove(roleId: string, permissionId: string) {
    try {
      return await this.prisma.rolePermission.delete({
        where: { roleId_permissionId: { roleId, permissionId } },
      });
    } catch {
      throw new NotFoundException(`Asignación de permiso no encontrada`);
    }
  }
}
