import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../types/jwt-payload.type';

import { Request } from 'express'; // Added import

@Injectable()
export class SuperAdminOrProjectAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload;

    if (!user) return false;

    // 1. Super Admin (God Mode)
    if (user.isSuperAdmin) return true;

    // 2. Check for 'admin' project permission with role 'ADMIN'
    // Assuming user.permissions structure from JwtStrategy:
    // permissions: { [projectCode]: { role: string, organizationId?: string } }
    const roleAdmin = process.env.ROLE_ADMIN;
    const selfProject = process.env.SELF_PROJECT;

    if (!selfProject || !roleAdmin) {
      throw new Error(
        'SELF_PROJECT or ROLE_ADMIN environment variable not set',
      );
    }

    const adminPermission = user.permissions?.[selfProject];
    const isAdminProjectAdmin = adminPermission?.role === roleAdmin;

    if (isAdminProjectAdmin) return true;

    throw new ForbiddenException(
      `Se requiere ser SuperAdmin o tener rol "${roleAdmin}" en el proyecto "${selfProject}".`,
    );
  }
}
