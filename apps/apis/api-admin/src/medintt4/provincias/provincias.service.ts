import { Injectable } from '@nestjs/common';
import { PrismaMedinttService } from '../../prisma-medintt/prisma-medintt.service';

@Injectable()
export class ProvinciasService {
  constructor(private readonly prisma: PrismaMedinttService) {}

  async findAll() {
    return this.prisma.provincias.findMany({
      orderBy: { Provincia: 'asc' },
    });
  }
}
