import { Injectable } from '@nestjs/common';
import { PrismaMedinttService } from '../../prisma-medintt/prisma-medintt.service';

@Injectable()
export class ProfesionalesService {
  constructor(private prisma: PrismaMedinttService) {}

  findAll() {
    return this.prisma.profesionales.findMany();
  }
}
