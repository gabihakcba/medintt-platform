import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailService } from '@medintt/mail';
import { ResetPasswordDto } from './dto/resset-paswwrod.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { UserService } from 'src/user/user.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private mailService: MailService,
    private usersService: UserService,
  ) {}

  async register(dto: RegisterDto) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (userExists) {
      throw new BadRequestException('El usuario o email ya están registrados');
    }

    const hash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hash,
        name: dto.name,
        lastName: dto.lastName,
        dni: dto.dni,
      },
    });

    const token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: this.config.get('JWT_CONFIRM'),
        expiresIn: this.config.get('JWT_CONFIRM_EXPIRATION'),
      },
    );

    const url = `${this.config.getOrThrow('FRONTEND_URL_AUTH')}${this.config.getOrThrow('FRONTEND_PATH_CONFIRM')}?token=${token}`;
    await this.mailService.sendUserConfirmation(user.email, url);

    return {
      message:
        'Usuario registrado. Por favor revisa tu email para confirmar la cuenta.',
      user,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const pwMatches = await argon2.verify(user.password, dto.password);
    if (!pwMatches) throw new UnauthorizedException('Credenciales inválidas');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: { id: userId, hashedRefreshToken: { not: null } },
      data: { hashedRefreshToken: null },
    });
    return { loggedOut: true };
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.hashedRefreshToken)
      throw new ForbiddenException('Acceso Denegado');

    const rtMatches = await argon2.verify(user.hashedRefreshToken, rt);
    if (!rtMatches) throw new ForbiddenException('Acceso Denegado');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // True para no revelear existencia de mails
    if (!user) return true;

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.getOrThrow('JWT_RESET_SECRET'),
      expiresIn: '15m',
    });

    const url = `${this.config.getOrThrow('FRONTEND_URL_AUTH')}${this.config.getOrThrow('FRONTEND_PATH_RESET')}?token=${token}`;

    await this.mailService.sendPasswordReset(user.email, url);

    return { message: 'Correo enviado si el usuario existe' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const key: string = this.config.getOrThrow('JWT_RESET_SECRET');
      const payload: JwtPayload = await this.jwtService.verifyAsync(dto.token, {
        secret: key,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) throw new BadRequestException('Usuario inválido');

      const hash = await argon2.hash(dto.newPassword);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hash },
      });

      await this.updateRtHash(user.id, null);

      return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.password) {
      throw new BadRequestException(
        'Este usuario no tiene contraseña configurada (Login Social)',
      );
    }

    const isMatch = await argon2.verify(user.password, oldPassword);
    if (!isMatch) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    const hashedPassword = await argon2.hash(newPassword);

    await this.usersService.updatePassword(userId, hashedPassword);

    return { message: 'Contraseña actualizada correctamente' };
  }

  async confirmEmail(token: string) {
    try {
      const payload: JwtPayload = this.jwtService.verify(token, {
        secret: this.config.getOrThrow('JWT_CONFIRM'),
      } as JwtVerifyOptions);

      const email = payload.email;

      const user = await this.usersService.findOneByEmail(email);

      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      if (user.isVerified) {
        throw new BadRequestException('El correo ya ha sido verificado');
      }

      await this.usersService.markEmailAsVerified(user.id);

      return { message: 'Email confirmado exitosamente' };
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new BadRequestException('El token de confirmación ha expirado');
      }
      throw new BadRequestException('Token de confirmación inválido');
    }
  }

  // --- HELPERS PRIVADOS ---

  async updateRtHash(userId: string, rt: string | null) {
    let hash = rt;
    if (rt) {
      hash = await argon2.hash(rt);
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hash },
    });
  }

  async getTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.config.getOrThrow<string>('JWT_EXPIRATION'),
      } as JwtSignOptions),
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.getOrThrow<string>('JWT_REFRESH_EXPIRATION'),
      } as JwtSignOptions),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
