import { Module } from '@nestjs/common';
import { CloudSyncWorkerProcessor } from './cloud-sync-worker.processor';
import { PrismaMedinttModule } from '../prisma-medintt/prisma-medintt.module';
import { CloudMedinttModule } from '@medintt/cloud-medintt';

@Module({
  imports: [PrismaMedinttModule, CloudMedinttModule],
  providers: [CloudSyncWorkerProcessor],
})
export class CloudSyncWorkerModule {}
