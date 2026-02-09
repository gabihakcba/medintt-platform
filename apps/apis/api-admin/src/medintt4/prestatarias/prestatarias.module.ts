import { Module } from '@nestjs/common';
import { PrestatariasController } from './prestatarias.controller';
import { PrestatariasService } from './prestatarias.service';
import { PrismaMedinttModule } from '../../prisma-medintt/prisma-medintt.module';

@Module({
  imports: [PrismaMedinttModule],
  controllers: [PrestatariasController],
  providers: [PrestatariasService],
})
export class PrestatariasModule {}
