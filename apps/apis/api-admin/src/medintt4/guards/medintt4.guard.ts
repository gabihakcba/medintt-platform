import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../../common/types/jwt-payload.type';

@Injectable()
export class Medintt4Guard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = request.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    // 1. SuperAdmin bypass
    if (user.isSuperAdmin) {
      return true;
    }

    // 2. Check specific conditions
    const selfProject = process.env.SELF_PROJECT;
    const roleAdmin = process.env.ROLE_ADMIN;
    const orgM = process.env.ORG_M;

    if (!selfProject || !roleAdmin || !orgM) {
      console.error('Missing environment variables for Medintt4Guard', {
        selfProject,
        roleAdmin,
        orgM,
      });
      throw new ForbiddenException('Server configuration error');
    }

    const membership = user.permissions?.[selfProject];

    if (!membership) {
      throw new ForbiddenException(
        `Access denied: Not a member of project ${selfProject}`,
      );
    }

    const hasRoleAdmin = membership.role === roleAdmin;
    const isOrgM = membership.organizationCode === orgM;

    if (hasRoleAdmin && isOrgM) {
      return true;
    }

    throw new ForbiddenException(
      `Access denied: Requires Role=${roleAdmin} AND Organization=${orgM} in Project=${selfProject}`,
    );
  }
}
