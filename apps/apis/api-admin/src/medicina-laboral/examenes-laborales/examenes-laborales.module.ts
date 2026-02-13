import { Module } from '@nestjs/common';
import { ExamenesLaboralesController } from './examenes-laborales.controller';
import { ExamenesLaboralesService } from './examenes-laborales.service';
import { PrismaMedinttModule } from '../../prisma-medintt/prisma-medintt.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaMedinttModule, ConfigModule],
  controllers: [ExamenesLaboralesController],
  providers: [ExamenesLaboralesService],
})
export class ExamenesLaboralesModule {}
