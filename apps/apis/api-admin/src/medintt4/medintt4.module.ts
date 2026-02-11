import { Module } from '@nestjs/common';
import { Medintt4Controller } from './medintt4.controller';
import { Medintt4Service } from './medintt4.service';
import { LocalidadesModule } from './localidades/localidades.module';
import { ProfesionalesModule } from './profesionales/profesionales.module';
import { EmailsModule } from './emails/emails.module';
import { PrestatariasModule } from './prestatarias/prestatarias.module';
import { ProvinciasModule } from './provincias/provincias.module';
import { PacientesModule } from './pacientes/pacientes.module';

@Module({
  imports: [
    LocalidadesModule,
    ProfesionalesModule,
    EmailsModule,
    PrestatariasModule,
    ProvinciasModule,
    PacientesModule,
  ],
  controllers: [Medintt4Controller],
  providers: [Medintt4Service],
})
export class Medintt4Module {}
