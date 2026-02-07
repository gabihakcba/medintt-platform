import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          let token: null | string = null;
          if (
            req &&
            (req as unknown as { cookies: Record<string, string> }).cookies
          ) {
            token = (req as unknown as { cookies: Record<string, string> })
              .cookies['Authentication'];
          }
          return token;
        },
      ]),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
