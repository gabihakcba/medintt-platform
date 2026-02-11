import { Module } from '@nestjs/common';
import { MedicinaLaboralController } from './medicina-laboral.controller';
import { MedicinaLaboralService } from './medicina-laboral.service';
import { PacientesModule } from './pacientes/pacientes.module';
import { AusentismosModule } from './ausentismos/ausentismos.module';
import { InterlocutorModule } from './interlocutor/interlocutor.module';
import { DeclaracionJuradaModule } from './declaracion-jurada/declaracion-jurada.module';
import { FirmaPacienteModule } from './firma-paciente/firma-paciente.module';

@Module({
  imports: [
    PacientesModule,
    AusentismosModule,
    InterlocutorModule,
    DeclaracionJuradaModule,
    FirmaPacienteModule,
  ],
  controllers: [MedicinaLaboralController],
  providers: [MedicinaLaboralService],
})
export class MedicinaLaboralModule {}
