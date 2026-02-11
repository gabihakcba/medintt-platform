import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, OAuthToken } from '@medintt/database-auth';

import { Request } from 'express';

@Injectable()
export class OAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: any; oauthToken: any }>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Validate token in database
    const oauthToken: (OAuthToken & { user: User }) | null =
      await this.prisma.oAuthToken.findUnique({
        where: { accessToken: token },
        include: { user: true },
      });

    if (!oauthToken) {
      throw new UnauthorizedException('Invalid access token');
    }

    // Check if token has expired
    if (new Date() > oauthToken.accessTokenExpiresAt) {
      throw new UnauthorizedException('Access token has expired');
    }

    // Check if token has been revoked
    if (oauthToken.isRevoked) {
      throw new UnauthorizedException('Access token has been revoked');
    }

    // Attach user and token to request for use in controller
    request.user = oauthToken.user;
    request.oauthToken = oauthToken;

    return true;
  }
}
