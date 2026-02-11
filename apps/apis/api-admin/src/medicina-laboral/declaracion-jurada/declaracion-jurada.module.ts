import { Module } from '@nestjs/common';
import { DeclaracionJuradaService } from './declaracion-jurada.service';
import { DeclaracionJuradaController } from './declaracion-jurada.controller';
import { PrismaMedinttModule } from '../../prisma-medintt/prisma-medintt.module';
import { FirmaPacienteModule } from '../firma-paciente/firma-paciente.module';

@Module({
  imports: [PrismaMedinttModule, FirmaPacienteModule],
  controllers: [DeclaracionJuradaController],
  providers: [DeclaracionJuradaService],
  exports: [DeclaracionJuradaService],
})
export class DeclaracionJuradaModule {}
