import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { OAuthGuard } from './guards/oauth.guard';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-jwt-secret',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [OAuthController],
  providers: [OAuthService, OAuthGuard],
  exports: [OAuthService],
})
export class OAuthModule {}
