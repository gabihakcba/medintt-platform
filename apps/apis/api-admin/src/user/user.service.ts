import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@medintt/database-auth';
import { RegisterDto } from '@medintt/types-auth';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: RegisterDto,
    ctx?: Prisma.TransactionClient,
  ): Promise<User> {
    const client = ctx || this.prisma;
    return await client.user.create({
      data: {
        ...data,
        isVerified: false,
      },
    });
  }

  async findOneById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findOneByEmail(
    email: string,
    ctx?: Prisma.TransactionClient,
  ): Promise<User | null> {
    const client = ctx || this.prisma;

    return await client.user.findUnique({
      where: { email },
    });
  }

  async markEmailAsVerified(
    id: string,
    ctx?: Prisma.TransactionClient,
  ): Promise<User> {
    const client = ctx || this.prisma;

    return await client.user.update({
      where: { id },
      data: {
        isVerified: true,
      },
    });
  }

  async updatePassword(id: string, newPasswordHash: string) {
    return await this.prisma.user.update({
      where: { id },
      data: { password: newPasswordHash },
    });
  }

  async setTwoFactorSecret(userId: string, secret: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret,
      },
    });
  }

  async turnOnTwoFactorAuthentication(userId: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        isTwoFactorEnabled: true,
      },
    });
  }
}
