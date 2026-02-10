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
import { AtGuard } from '../auth/guards/at.guard';
import { OAuthGuard } from './guards/oauth.guard';

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
  @UseGuards(AtGuard)
  async authorize(
    @Query() query: AuthorizeDto,
    @Req() req: Request & { user: { sub: string } },
    @Res() res: Response,
  ) {
    console.log(query);
    const { response_type, client_id, redirect_uri, state, scope } = query;
    // Validate response_type
    if (response_type !== 'code') {
      return res.redirect(
        `${redirect_uri}?error=unsupported_response_type&error_description=Only code flow is supported&state=${state || ''}`,
      );
    }

    try {
      // Validate client and redirect URI
      await this.oauthService.validateClient(client_id, redirect_uri);

      // Parse scopes (default to openid if not specified)
      const scopes = scope ? scope.split(' ') : ['openid'];

      // Generate authorization code
      const code = await this.oauthService.generateAuthorizationCode(
        req.user.sub, // User ID from JWT
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
