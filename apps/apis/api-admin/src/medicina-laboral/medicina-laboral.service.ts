import { Injectable } from '@nestjs/common';
import { PrismaMedinttService } from '../prisma-medintt/prisma-medintt.service';

@Injectable()
export class MedicinaLaboralService {
  constructor(private readonly prisma: PrismaMedinttService) {}

  getHealth() {
    return {
      status: 'ok',
      module: 'medicina-laboral',
      timestamp: new Date().toISOString(),
    };
  }

  async getPrestatarias() {
    return this.prisma.prestatarias.findMany({
      select: {
        Id: true,
        Nombre: true,
      },
      orderBy: {
        Nombre: 'asc',
      },
    });
  }
}
