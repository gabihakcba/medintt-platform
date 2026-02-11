import { Injectable } from '@nestjs/common';
import { PrismaMedinttService } from '../../prisma-medintt/prisma-medintt.service';

@Injectable()
export class PrestatariasService {
  constructor(private prisma: PrismaMedinttService) {}

  findAll() {
    return this.prisma.prestatarias.findMany({
      select: {
        Id: true,
        Codigo: true,
        Cuit: true,
        Nombre: true,
      },
    });
  }
}
