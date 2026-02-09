import { Module } from '@nestjs/common';
import { MailingController } from './mailing.controller';

@Module({
  controllers: [MailingController],
  providers: [],
})
export class MailingModule {}
