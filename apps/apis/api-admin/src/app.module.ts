import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

import { MedinttMailModule } from '@medintt/mail';
import { UserModule } from './user/user.module';
import { ProjectsModule } from './projects/projects.module'; // Import ProjectsModule
import { ThrottlerModule } from '@nestjs/throttler';
import { AtStrategy } from './common/strategies/at.strategy';
import { PassportModule } from '@nestjs/passport';
// import { APP_GUARD } from '@nestjs/core';
// import { MedinttThrottlerGuard } from './common/guards/throttler-behind-proxy.guard';

import { OrganizationsModule } from './organizations/organizations.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { MembersModule } from './members/members.module';
import { PrismaMedinttModule } from './prisma-medintt/prisma-medintt.module';
import { Medintt4Module } from './medintt4/medintt4.module';
import { MailingModule } from './mailing/mailing.module';
import { MedicinaLaboralModule } from './medicina-laboral/medicina-laboral.module';

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
        limit: 100,
      },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // AdminModule,
    PrismaModule,
    PrismaMedinttModule,
    Medintt4Module,
    UserModule,
    ProjectsModule,
    OrganizationsModule,
    RolesModule,
    PermissionsModule,
    RolePermissionsModule,
    MembersModule,
    HealthModule,
    MailingModule,
    MedicinaLaboralModule,
  ],
  controllers: [AppController],
  providers: [
    AtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: MedinttThrottlerGuard,
    // },

    AppService,
  ],
})
export class AppModule {}
