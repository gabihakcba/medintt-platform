import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class OAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validate OAuth client credentials and redirect URI
   */
  async validateClient(clientId: string, redirectUri: string) {
    const client = await this.prisma.oAuthClient.findUnique({
      where: { clientId },
    });

    if (!client) {
      throw new UnauthorizedException('Invalid client_id');
    }

    if (!client.isActive) {
      throw new UnauthorizedException('Client is inactive');
    }

    // Validate redirect URI
    if (!client.redirectUris.includes(redirectUri)) {
      throw new BadRequestException('Invalid redirect_uri');
    }

    return client;
  }

  /**
   * Generate authorization code for user
   */
  async generateAuthorizationCode(
    userId: string,
    clientId: string,
    redirectUri: string,
    scopes: string[],
  ) {
    // Generate secure random code
    const code = randomBytes(32).toString('base64url');

    // Find client
    const client = await this.prisma.oAuthClient.findUnique({
      where: { clientId },
    });

    if (!client) {
      throw new UnauthorizedException('Invalid client');
    }

    // Create authorization code in database (expires in 10 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await this.prisma.oAuthAuthorizationCode.create({
      data: {
        code,
        userId,
        clientId: client.id,
        redirectUri,
        scopes,
        expiresAt,
        isUsed: false,
      },
    });

    return code;
  }

  /**
   * Exchange authorization code for access token and ID token
   */
  async exchangeCodeForToken(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string,
  ) {
    // Validate client credentials
    const client = await this.prisma.oAuthClient.findUnique({
      where: { clientId },
    });

    if (!client || client.clientSecret !== clientSecret) {
      throw new UnauthorizedException('Invalid client credentials');
    }

    // Find authorization code
    const authCode = await this.prisma.oAuthAuthorizationCode.findUnique({
      where: { code },
      include: { user: true },
    });

    if (!authCode) {
      throw new BadRequestException({
        error: 'invalid_grant',
        error_description: 'Authorization code not found',
      });
    }

    // Validate code hasn't been used
    if (authCode.isUsed) {
      throw new BadRequestException({
        error: 'invalid_grant',
        error_description: 'Authorization code already used',
      });
    }

    // Validate code hasn't expired
    if (new Date() > authCode.expiresAt) {
      throw new BadRequestException({
        error: 'invalid_grant',
        error_description: 'Authorization code expired',
      });
    }

    // Validate redirect URI matches
    if (authCode.redirectUri !== redirectUri) {
      throw new BadRequestException({
        error: 'invalid_grant',
        error_description: 'Redirect URI mismatch',
      });
    }

    // Mark code as used
    await this.prisma.oAuthAuthorizationCode.update({
      where: { code },
      data: { isUsed: true },
    });

    // Generate access token (opaque, 1 hour expiry)
    const accessToken = randomBytes(32).toString('base64url');
    const accessTokenExpiresAt = new Date();
    accessTokenExpiresAt.setHours(accessTokenExpiresAt.getHours() + 1);

    // Generate refresh token (7 days expiry)
    const refreshToken = randomBytes(32).toString('base64url');
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

    // Generate ID token (JWT) for OpenID Connect
    const idToken = this.jwtService.sign(
      {
        sub: authCode.user.id,
        name: `${authCode.user.name} ${authCode.user.lastName}`,
        email: authCode.user.email,
        preferred_username: authCode.user.username,
      },
      {
        issuer: 'medintt-auth',
        audience: clientId,
      },
    );

    // Store token in database
    await this.prisma.oAuthToken.create({
      data: {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        userId: authCode.userId,
        clientId: client.id,
        scopes: authCode.scopes,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
        isRevoked: false,
      },
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600, // 1 hour in seconds
      refresh_token: refreshToken,
      id_token: idToken,
    };
  }

  /**
   * Validate access token and return user info
   */
  async getUserInfo(accessToken: string) {
    const token = (await this.prisma.oAuthToken.findUnique({
      where: { accessToken },
      include: {
        user: {
          include: {
            memberships: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    })) as unknown as {
      user: {
        id: string;
        name: string;
        lastName: string;
        email: string;
        username: string;
        memberships: {
          role: {
            code: string;
          };
        }[];
      };
      accessTokenExpiresAt: Date;
      isRevoked: boolean;
    } | null;
    if (!token) {
      throw new UnauthorizedException('Invalid access token');
    }

    if (new Date() > token.accessTokenExpiresAt) {
      throw new UnauthorizedException('Access token expired');
    }

    if (token.isRevoked) {
      throw new UnauthorizedException('Access token revoked');
    }

    // Extract user groups/roles
    const groups = token.user.memberships.map((m) => m.role.code);

    return {
      sub: token.user.id,
      name: `${token.user.name} ${token.user.lastName}`,
      email: token.user.email,
      preferred_username: token.user.username,
      groups,
    };
  }

  /**
   * Validate user access to cloud application
   */
  async validateUserAccess(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            role: true,
            project: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 1. Super Admin check
    if (user.isSuperAdmin) {
      return true;
    }

    const cloudProjectCode = process.env.CLOUD_PROJECT;
    const adminCloudRole = process.env.ADMIN_CLOUD_ROLE;
    const memberCloudRole = process.env.MEMBER_CLOUD_ROLE;

    if (!cloudProjectCode || !adminCloudRole || !memberCloudRole) {
      console.error('Missing cloud project/role env vars');
      throw new UnauthorizedException('System configuration error');
    }

    // 2. & 3. Check for specific project membership and roles
    const hasAccess = user.memberships.some((membership) => {
      // Ensure we are checking the correct project
      if (membership.project.code !== cloudProjectCode) {
        return false;
      }

      // Check for allowed roles
      return (
        membership.role.code === adminCloudRole ||
        membership.role.code === memberCloudRole
      );
    });

    if (hasAccess) {
      return true;
    }

    throw new UnauthorizedException(
      'User does not have required permissions for this application',
    );
  }
}
