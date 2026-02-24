import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';
import { CLOUD_SYNC_QUEUE } from '@medintt/cloud-medintt';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { UserModule } from 'src/user/user.module';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { CloudMedinttListener } from './listeners/cloud-medintt.listener';

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
    BullModule.registerQueue({
      name: CLOUD_SYNC_QUEUE as string,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    TwoFactorAuthService,
    CloudMedinttListener,
  ],
})
export class AuthModule {}
