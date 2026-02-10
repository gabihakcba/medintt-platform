import { Module } from '@nestjs/common';
import { FirmaPacienteService } from './firma-paciente.service';
import { FirmaPacienteController } from './firma-paciente.controller';
import { PrismaMedinttModule } from '../../prisma-medintt/prisma-medintt.module';

@Module({
  imports: [PrismaMedinttModule],
  controllers: [FirmaPacienteController],
  providers: [FirmaPacienteService],
  exports: [FirmaPacienteService],
})
export class FirmaPacienteModule {}
