import { Injectable } from '@nestjs/common';
import { PrismaMedinttService } from '../../prisma-medintt/prisma-medintt.service';
import { Localidades } from '@medintt/database-medintt4';

@Injectable()
export class LocalidadesService {
  constructor(private prisma: PrismaMedinttService) {}

  findAll(): Promise<Localidades[]> {
    return this.prisma.localidades.findMany();
  }
}
