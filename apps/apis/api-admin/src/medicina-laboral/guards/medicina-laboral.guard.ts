import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../../common/types/jwt-payload.type';

@Injectable()
export class MedicinaLaboralGuard implements CanActivate {
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

    // 2. Check environment variables
    const medLabProject = process.env.MED_LAB_PROJECT;
    const roleAdmin = process.env.ROLE_ADMIN;
    const roleInterlocutor = process.env.ROLE_INTERLOCUTOR;
    const orgM = process.env.ORG_M;

    if (!medLabProject || !roleAdmin || !roleInterlocutor || !orgM) {
      console.error('Missing environment variables for MedicinaLaboralGuard', {
        medLabProject,
        roleAdmin,
        roleInterlocutor,
        orgM,
      });
      throw new ForbiddenException('Server configuration error');
    }

    // 3. Check membership in medicina-laboral project
    const membership = user.permissions?.[medLabProject];

    if (!membership) {
      throw new ForbiddenException(
        `Access denied: Not a member of project ${medLabProject}`,
      );
    }

    // 4. Check if user has admin role in medintt organization
    const hasRoleAdmin = membership.role === roleAdmin;
    const isOrgM = membership.organizationCode === orgM;

    if (hasRoleAdmin && isOrgM) {
      return true;
    }

    // 5. Check if user has interlocutor role in medicina-laboral project
    const hasRoleInterlocutor = membership.role === roleInterlocutor;

    if (hasRoleInterlocutor) {
      return true;
    }

    throw new ForbiddenException(
      `Access denied: Requires Role=${roleAdmin} in Organization=${orgM} OR Role=${roleInterlocutor} in Project=${medLabProject}`,
    );
  }
}
