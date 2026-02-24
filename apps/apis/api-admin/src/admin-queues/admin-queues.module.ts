import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ForbiddenException,
} from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CLOUD_SYNC_QUEUE } from '@medintt/cloud-medintt';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { JwtPayload } from '../common/types/jwt-payload.type';

@Module({
  imports: [
    BullModule.registerQueue({
      name: CLOUD_SYNC_QUEUE as string,
    }),
    BullBoardModule.forRoot({
      route: '/admin/queues',
      adapter: ExpressAdapter,
      boardOptions: {
        uiConfig: {
          boardTitle: 'Medintt Cloud Sync Dashboard',
        },
      },
    }),
    BullBoardModule.forFeature({
      name: CLOUD_SYNC_QUEUE as string,
      adapter: BullMQAdapter,
    }),
  ],
})
export class AdminQueuesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 1. Passport JWT Middleware
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const jwtMiddleware = passport.authenticate('jwt', { session: false });

    // 2. Custom Role & Proyecto Authorization (replacing Medintt4Guard)
    const medintt4Middleware = (
      req: Request,
      _res: Response,
      next: NextFunction,
    ) => {
      const user = req.user as JwtPayload | undefined;

      if (!user) {
        return next(new ForbiddenException('User not found in request'));
      }
      if (user.isSuperAdmin) {
        return next();
      }

      const selfProject = process.env.SELF_PROJECT;
      const roleAdmin = process.env.ROLE_ADMIN;
      const orgM = process.env.ORG_M;

      if (!selfProject || !roleAdmin || !orgM) {
        console.error('Missing env vars for BullBoard AuthMiddleware');
        return next(new ForbiddenException('Server configuration error'));
      }

      const membership = user.permissions?.[selfProject];
      if (
        !membership ||
        membership.role !== roleAdmin ||
        membership.organizationCode !== orgM
      ) {
        return next(
          new ForbiddenException(
            'Access denied: Unauthorized role or organization',
          ),
        );
      }

      next();
    };

    consumer
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .apply(jwtMiddleware, medintt4Middleware)
      .forRoutes('/admin/queues');
  }
}
