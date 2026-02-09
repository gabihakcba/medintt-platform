import { Module } from '@nestjs/common';
import { PacientesController } from './pacientes.controller';
import { PacientesService } from './pacientes.service';
import { PrismaMedinttModule } from '../../prisma-medintt/prisma-medintt.module';

@Module({
  imports: [PrismaMedinttModule],
  controllers: [PacientesController],
  providers: [PacientesService],
})
export class PacientesModule {}
