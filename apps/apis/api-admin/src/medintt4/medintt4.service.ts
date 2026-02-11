import { Injectable } from '@nestjs/common';
import { PrismaMedinttService } from '../prisma-medintt/prisma-medintt.service';

@Injectable()
export class Medintt4Service {
  constructor(private prisma: PrismaMedinttService) {}

  async checkHealth() {
    try {
      // Simple query to check connection. Adjust if necessary for SQL Server.
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', database: 'medintt4', connection: 'healthy' };
    } catch (error) {
      return {
        status: 'error',
        database: 'medintt4',
        connection: 'unhealthy',
        details: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
