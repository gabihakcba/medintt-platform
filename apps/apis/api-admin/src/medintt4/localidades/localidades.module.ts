import { Module } from '@nestjs/common';
import { LocalidadesController } from './localidades.controller';
import { LocalidadesService } from './localidades.service';
import { LocalidadesPublicController } from './localidades.public.controller';

@Module({
  controllers: [LocalidadesController, LocalidadesPublicController],
  providers: [LocalidadesService],
})
export class LocalidadesModule {}
