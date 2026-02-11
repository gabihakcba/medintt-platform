import { Module } from '@nestjs/common';
import { PacientesController } from './pacientes.controller';
import { PacientesService } from './pacientes.service';
import { PrismaMedinttModule } from '../../prisma-medintt/prisma-medintt.module';
import { DeclaracionJuradaModule } from '../../medicina-laboral/declaracion-jurada/declaracion-jurada.module';

@Module({
  imports: [PrismaMedinttModule, DeclaracionJuradaModule],
  controllers: [PacientesController],
  providers: [PacientesService],
  exports: [PacientesService],
})
export class PacientesModule {}
