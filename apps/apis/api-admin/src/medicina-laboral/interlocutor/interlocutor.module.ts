import { Module } from '@nestjs/common';
import { InterlocutorController } from './interlocutor.controller';
import { InterlocutorService } from './interlocutor.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InterlocutorController],
  providers: [InterlocutorService],
})
export class InterlocutorModule {}
