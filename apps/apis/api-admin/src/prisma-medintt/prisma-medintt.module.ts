import { Global, Module } from '@nestjs/common';
import { PrismaMedinttService } from './prisma-medintt.service';

@Global()
@Module({
  providers: [PrismaMedinttService],
  exports: [PrismaMedinttService],
})
export class PrismaMedinttModule {}
