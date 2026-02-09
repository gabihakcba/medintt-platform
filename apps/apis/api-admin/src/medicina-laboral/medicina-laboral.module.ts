import { Module } from '@nestjs/common';
import { MedicinaLaboralController } from './medicina-laboral.controller';
import { MedicinaLaboralService } from './medicina-laboral.service';
import { PacientesModule } from './pacientes/pacientes.module';
import { AusentismosModule } from './ausentismos/ausentismos.module';
import { InterlocutorModule } from './interlocutor/interlocutor.module';

@Module({
  imports: [PacientesModule, AusentismosModule, InterlocutorModule],
  controllers: [MedicinaLaboralController],
  providers: [MedicinaLaboralService],
})
export class MedicinaLaboralModule {}
