import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@medintt/database-auth';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async createLog(data: Prisma.LogCreateInput) {
    try {
      await this.prisma.log.create({ data });
    } catch (error) {
      console.error('Error al crear log de auditoría:', error);
    }
  }
}
