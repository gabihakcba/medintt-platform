import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@medintt/database-auth';
import { RegisterDto } from 'src/auth/dto/register.dto';

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

  findAll() {
    return `This action returns all user`;
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user ${JSON.stringify(updateUserDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
