import { Injectable, BadRequestException } from '@nestjs/common';
import {
  AssignMemberDto,
  CreateOrganizationDto,
  CreateProjectDto,
  CreateRoleDto,
} from './dto/admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // --- ROLES ---
  async createRole(dto: CreateRoleDto) {
    // Verificar duplicados
    const exists = await this.prisma.role.findUnique({
      where: { name: dto.name },
    });
    if (exists) throw new BadRequestException('El rol ya existe');

    return this.prisma.role.create({ data: dto });
  }

  async getRoles() {
    return this.prisma.role.findMany();
  }

  // --- PROYECTOS ---
  async createProject(dto: CreateProjectDto) {
    return this.prisma.project.create({ data: dto });
  }

  async getProjects() {
    return this.prisma.project.findMany();
  }

  // --- ORGANIZACIONES ---
  async createOrganization(dto: CreateOrganizationDto) {
    return await this.prisma.organization.create({ data: dto });
  }

  async getOrganizations() {
    return await this.prisma.organization.findMany();
  }

  // --- MEMBRESÍAS (ASIGNACIÓN) ---
  async assignMember(dto: AssignMemberDto) {
    // 1. Validar existencia de foreign keys (Opcional, Prisma fallará igual, pero esto da mejor UX)
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) throw new BadRequestException('Usuario no encontrado');

    // 2. Upsert: Crear o Actualizar
    // La clave única es [userId, projectId]
    return this.prisma.member.upsert({
      where: {
        userId_projectId: {
          userId: dto.userId,
          projectId: dto.projectId,
        },
      },
      update: {
        roleId: dto.roleId,
        organizationId: dto.organizationId || null,
      },
      create: {
        userId: dto.userId,
        projectId: dto.projectId,
        roleId: dto.roleId,
        organizationId: dto.organizationId || null,
      },
      include: {
        project: true,
        role: true,
        organization: true,
      },
    });
  }

  async removeMember(userId: string, projectId: string) {
    return this.prisma.member.delete({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });
  }

  // Listar membresías de un usuario
  async getUserMemberships(userId: string) {
    return this.prisma.member.findMany({
      where: { userId },
      include: { project: true, role: true, organization: true },
    });
  }
}
