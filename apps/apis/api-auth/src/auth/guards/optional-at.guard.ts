import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAtGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any): any {
    // If error or no user, return null instead of throwing
    if (err || !user) {
      return null;
    }
    return user;
  }
}
