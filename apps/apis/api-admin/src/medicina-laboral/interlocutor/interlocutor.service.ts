import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { JwtPayload } from '../../common/types/jwt-payload.type';

@Injectable()
export class InterlocutorService {
  constructor(private prisma: PrismaService) {}

  async getSelf(user: JwtPayload) {
    // Get user ID from JWT
    const userId = user.sub;

    if (!userId) {
      return null;
    }

    // Find user in auth database
    const authUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        memberships: {
          select: {
            organization: {
              select: {
                id: true,
                name: true,
                code: true,
                cuit: true,
              },
            },
          },
        },
      },
    });

    if (!authUser) {
      return null;
    }

    // Get the medicina-laboral membership organization
    const medLabProject = process.env.MED_LAB_PROJECT;
    const membership = user.permissions?.[medLabProject!];
    const organizationCode = membership?.organizationCode;

    // Find the organization for this membership
    const organization = authUser.memberships.find(
      (m) => m.organization?.code === organizationCode,
    )?.organization;

    return {
      id: authUser.id,
      name: authUser.name,
      lastName: authUser.lastName,
      email: authUser.email,
      organization: organization || null,
    };
  }
}
