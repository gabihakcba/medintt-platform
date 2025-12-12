import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MedinttMailModule } from '@medintt/mail';

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
    PrismaModule,
    HealthModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
