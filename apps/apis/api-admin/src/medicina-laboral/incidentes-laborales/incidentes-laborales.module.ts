import { Module } from '@nestjs/common';
import { IncidentesLaboralesService } from './incidentes-laborales.service';
import { IncidentesLaboralesController } from './incidentes-laborales.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [IncidentesLaboralesController],
  providers: [IncidentesLaboralesService],
})
export class IncidentesLaboralesModule {}
