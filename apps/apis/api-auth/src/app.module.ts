import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MedinttMailModule } from '@medintt/mail';
import { UserModule } from './user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MedinttThrottlerGuard } from './common/guards/throttler-behind-proxy.guard';

import { AuditModule } from './audit/audit.module';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { OAuthModule } from './oauth/oauth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MedinttMailModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        host: config.getOrThrow('MAIL_HOST'),
        port: Number(config.get('MAIL_PORT') ?? 587),
        secure: config.get('MAIL_SECURE') === 'true',
        user: config.getOrThrow('MAIL_USER'),
        pass: config.getOrThrow('MAIL_PASS'),
        senderName: config.get('MAIL_NAME') ?? 'MEDINTT SRL',
        senderEmail: config.get('MAIL_FROM') ?? 'no-reply@medintt.com',
      }),
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 5,
      },
    ]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UserModule,
    AuditModule,
    OAuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: MedinttThrottlerGuard,
    },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
    AppService,
  ],
})
export class AppModule {}
