import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayloadWithRt } from '../types/jwt-payload.type';

interface RequestWithUser extends Request {
  user: JwtPayloadWithRt;
}

export const GetCurrentUser = createParamDecorator(
  (
    data: keyof JwtPayloadWithRt | undefined,
    context: ExecutionContext,
  ): JwtPayloadWithRt | JwtPayloadWithRt[keyof JwtPayloadWithRt] => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!data) return user;
    return user[data];
  },
);
