import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayloadWithRt } from '../types/jwt-payload.type';

type RequestWithCookies = Omit<Request, 'cookies'> & {
  cookies: Record<string, string>;
};

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token: string | null = null;
          if (req && (req as unknown as RequestWithCookies).cookies) {
            token = (req as unknown as RequestWithCookies).cookies['Refresh'];
          }
          return token;
        },
      ]),
      secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayloadWithRt) {
    const refreshToken = (req as unknown as RequestWithCookies).cookies?.[
      'Refresh'
    ];
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    return { ...payload, refreshToken };
  }
}
