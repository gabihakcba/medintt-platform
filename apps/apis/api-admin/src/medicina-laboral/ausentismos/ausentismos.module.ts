import { Module } from '@nestjs/common';
import { AusentismosController } from './ausentismos.controller';
import { AusentismosService } from './ausentismos.service';
import { PrismaMedinttModule } from '../../prisma-medintt/prisma-medintt.module';

@Module({
  imports: [PrismaMedinttModule],
  controllers: [AusentismosController],
  providers: [AusentismosService],
})
export class AusentismosModule {}
