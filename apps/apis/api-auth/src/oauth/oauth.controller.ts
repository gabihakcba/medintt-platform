import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { OAuthService } from './oauth.service';
import { AuthorizeDto } from './dto/authorize.dto';
import { TokenDto } from './dto/token.dto';
// import { AtGuard } from '../auth/guards/at.guard';
import { OAuthGuard } from './guards/oauth.guard';
import { OptionalAtGuard } from '../auth/guards/optional-at.guard';

interface OAuthTokenPayload {
  accessToken: string;
  userId: string;
  scopes: string[];
}

@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  /**
   * GET /oauth/authorize
   * Authorization endpoint - requires user to be logged in
   */
  @Get('authorize')
  @UseGuards(OptionalAtGuard)
  async authorize(
    @Query() query: AuthorizeDto,
    @Req() req: Request & { user?: { sub: string } },
    @Res() res: Response,
  ) {
    const { response_type, client_id, redirect_uri, state, scope } = query;

    // Validate response_type
    if (response_type !== 'code') {
      return res.redirect(
        `${redirect_uri}?error=unsupported_response_type&error_description=Only code flow is supported&state=${state || ''}`,
      );
    }

    try {
      // 1. Check if user is authenticated
      if (!req.user) {
        console.error(
          `User not authenticated for OAuth flow (client_id: ${client_id})`,
        );

        // Redirect to login page with returnTo parameter
        const loginUrl = new URL(
          process.env.FRONTEND_URL_AUTH || 'https://auth.medintt.com/login',
        );
        const returnTo = new URL(
          req.url,
          `http://${req.headers.host}`,
        ).toString();

        loginUrl.searchParams.set('returnTo', returnTo);
        return res.redirect(loginUrl.toString());
      }

      // 2. Validate client and redirect URI
      await this.oauthService.validateClient(client_id, redirect_uri);

      // 3. Validate user access permissions
      try {
        await this.oauthService.validateUserAccess(req.user.sub);
      } catch {
        console.warn(
          `User ${req.user.sub} UNAUTHORIZED for OAuth client ${client_id}`,
        );
        // Redirect to IDP denied page
        const deniedUrl = new URL(process.env.FRONTEND_URL_DENIED!);
        deniedUrl.searchParams.set(
          'message',
          'No tienes permisos para esta aplicación, comunícate con nosotros.',
        );
        return res.redirect(deniedUrl.toString());
      }

      // Parse scopes (default to openid if not specified)
      const scopes = scope ? scope.split(' ') : ['openid'];

      // Generate authorization code
      const code = await this.oauthService.generateAuthorizationCode(
        req.user.sub,
        client_id,
        redirect_uri,
        scopes,
      );

      // Redirect back to client with code and state
      const redirectUrl = new URL(redirect_uri);
      redirectUrl.searchParams.set('code', code);
      if (state) {
        redirectUrl.searchParams.set('state', state);
      }

      return res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('OAuth Authorization Error:', error);
      // Redirect with error
      const redirectUrl = new URL(redirect_uri);
      redirectUrl.searchParams.set('error', 'server_error');
      redirectUrl.searchParams.set(
        'error_description',
        error instanceof Error ? error.message : 'Unknown error',
      );
      if (state) {
        redirectUrl.searchParams.set('state', state);
      }

      return res.redirect(redirectUrl.toString());
    }
  }

  /**
   * POST /oauth/token
   * Token endpoint - exchanges authorization code for tokens
   */
  @Post('token')
  async token(@Body() body: TokenDto) {
    const { grant_type, code, client_id, client_secret, redirect_uri } = body;

    // Validate grant_type
    if (grant_type !== 'authorization_code') {
      return {
        error: 'unsupported_grant_type',
        error_description: 'Only authorization_code grant is supported',
      };
    }

    // Exchange code for tokens
    return this.oauthService.exchangeCodeForToken(
      code,
      client_id,
      client_secret,
      redirect_uri,
    );
  }

  /**
   * GET /oauth/userinfo
   * UserInfo endpoint - returns user information for valid access token
   */
  @Get('userinfo')
  @UseGuards(OAuthGuard)
  async userinfo(
    @Req() req: Request & { user: any; oauthToken: OAuthTokenPayload },
  ) {
    // User is already attached to request by OAuthGuard
    return this.oauthService.getUserInfo(req.oauthToken.accessToken);
  }
}
