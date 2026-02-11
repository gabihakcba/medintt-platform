import { Module } from '@nestjs/common';
import { ProvinciasController } from './provincias.controller';
import { ProvinciasService } from './provincias.service';
import { PrismaMedinttModule } from '../../prisma-medintt/prisma-medintt.module';

@Module({
  imports: [PrismaMedinttModule],
  controllers: [ProvinciasController],
  providers: [ProvinciasService],
  exports: [ProvinciasService],
})
export class ProvinciasModule {}
