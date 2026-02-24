import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { RegisterInterlocutorDto } from './dto/register-interlocutor.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailService } from '@medintt/mail';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload, PermissionsPayload } from './types/jwt-payload.type';
import { UserService } from 'src/user/user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { Prisma } from '@medintt/database-auth';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserPermissionsUpdatedEvent } from './events/user-permissions-updated.event';

type MemberWithContext = Prisma.MemberGetPayload<{
  include: {
    project: true;
    role: true;
    organization: true;
  };
}>;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private mailService: MailService,
    private usersService: UserService,
    private twoFactorAuthService: TwoFactorAuthService,
    private eventEmitter: EventEmitter2,
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
        cargo: dto.cargo,
        celular: dto.celular,
        devLogs: 'Creacion Web',
        isVerified: false,
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

    // Emitir evento
    this.eventEmitter.emit(
      'user.permissions.updated',
      new UserPermissionsUpdatedEvent(
        user.id,
        user.email,
        '', // Sin empresaId por defecto
        '', // Sin nombreEmpresa
        `${user.lastName} ${user.name}`.trim(),
        [], // Sin permisos
        false,
        user.name,
        user.lastName,
        user.dni,
        'registered',
      ),
    );

    return {
      message:
        'Usuario registrado. Por favor revisa tu email para confirmar la cuenta.',
      user,
    };
  }

  async registerInterlocutor(dto: RegisterInterlocutorDto) {
    const { user: userDto, member: memberDto } = dto;

    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: userDto.email }, { username: userDto.username }],
      },
    });

    if (userExists) {
      throw new BadRequestException('El usuario o email ya están registrados');
    }

    const hash = await argon2.hash(userDto.password);

    // Get Role
    const role = await this.prisma.role.findUnique({
      where: { code: memberDto.roleCode },
    });

    if (!role) {
      throw new BadRequestException('Rol no encontrado');
    }

    // Get Project
    const project = await this.prisma.project.findUnique({
      where: { code: memberDto.projectCode },
    });

    if (!project) {
      throw new BadRequestException('Proyecto no encontrado');
    }

    // Get Organization
    const organization = await this.prisma.organization.findUnique({
      where: { id: memberDto.organizationId },
    });

    if (!organization) {
      throw new BadRequestException('Organización no encontrada');
    }

    const result = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          username: userDto.username,
          email: userDto.email,
          password: hash,
          name: userDto.name,
          lastName: userDto.lastName,
          dni: userDto.dni,
          cargo: userDto.cargo,
          celular: userDto.celular,
          devLogs: 'Creacion Web (Interlocutor)',
          isVerified: false,
        },
      });

      const member = await prisma.member.create({
        data: {
          userId: user.id,
          roleId: role.id,
          projectId: project.id,
          organizationId: organization.id,
        },
      });

      return { user, member };
    });

    const token = this.jwtService.sign(
      { sub: result.user.id, email: result.user.email },
      {
        secret: this.config.get('JWT_CONFIRM'),
        expiresIn: this.config.get('JWT_CONFIRM_EXPIRATION'),
      },
    );

    const url = `${this.config.getOrThrow('FRONTEND_URL_AUTH')}${this.config.getOrThrow('FRONTEND_PATH_CONFIRM')}?token=${token}`;
    await this.mailService.sendUserConfirmation(result.user.email, url);

    // Emitir evento para interlocutor
    this.eventEmitter.emit(
      'user.permissions.updated',
      new UserPermissionsUpdatedEvent(
        result.user.id,
        result.user.email,
        organization.id,
        organization.name,
        `${result.user.lastName} ${result.user.name}`.trim(),
        ['member'], // Asumimos que siendo interlocutor de una ORG obtiene 'member' implícito
        false, // No es paciente en este contexto
        result.user.name,
        result.user.lastName,
        result.user.dni,
        'registered',
        role.id,
        role.code,
        project.id,
        project.code,
        organization.code,
      ),
    );

    return {
      message:
        'Usuario interlocutor registrado. Por favor revisa tu email para confirmar la cuenta.',
      user: result.user,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const pwMatches = await argon2.verify(user.password, dto.password);
    if (!pwMatches) throw new UnauthorizedException('Credenciales inválidas');

    if (user.isTwoFactorEnabled) {
      if (!dto.twoFactorCode) {
        throw new BadRequestException({
          message: 'Se requiere código de autenticación de dos factores',
          code: '2FA_REQUIRED',
        });
      }

      if (!user.twoFactorSecret) {
        throw new BadRequestException('Error en 2FA: Secreto no encontrado');
      }

      const isCodeValid =
        this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
          dto.twoFactorCode,
          user.twoFactorSecret,
        );

      if (!isCodeValid) {
        throw new UnauthorizedException('Código de autenticación 2FA inválido');
      }
    }

    const members = await this.getMembersWithDetails(user.id);
    const permissionsPayload = this.formatPermissions(members);

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.username,
      user.isSuperAdmin,
      permissionsPayload,
    );

    await this.updateRtHash(user.id, tokens.refresh_token);

    const membersResponse = members.map((member) => ({
      project: {
        code: member.project.code,
        id: member.projectId,
      },
      role: member.role.code,
      organization: member.organization
        ? {
            id: member.organization.id,
            name: member.organization.name,
            code: member.organization.code,
          }
        : undefined,
    }));

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        permissions: permissionsPayload,
        isSuperAdmin: user.isSuperAdmin,
        members: membersResponse,
      },
    };
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

    const members = await this.getMembersWithDetails(user.id);
    const permissionsPayload = this.formatPermissions(members);

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.username,
      user.isSuperAdmin,
      permissionsPayload,
    );

    await this.updateRtHash(user.id, tokens.refresh_token);

    const membersResponse = members.map((member) => ({
      project: {
        code: member.project.code,
        id: member.projectId,
      },
      role: member.role.code,
      organization: member.organization
        ? {
            id: member.organization.id,
            name: member.organization.name,
            code: member.organization.code,
          }
        : undefined,
    }));

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        permissions: permissionsPayload,
        isSuperAdmin: user.isSuperAdmin,
        members: membersResponse,
      },
    };
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
      expiresIn: this.config.get('JWT_RESET_EXPIRATION'),
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
      console.error(error);
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

  async turnOnTwoFactorAuthentication(userId: string) {
    return await this.usersService.turnOnTwoFactorAuthentication(userId);
  }

  async getUserById(id: string) {
    return await this.usersService.findOneById(id);
  }

  // --- HELPERS PRIVADOS ---

  /**
   * Obtiene (o formatea si ya se tienen) los permisos para el token.
   * Ahora delega en getMembersWithDetails si no se pasan miembros.
   */
  async getPermissions(userId: string): Promise<PermissionsPayload> {
    const members = await this.getMembersWithDetails(userId);
    return this.formatPermissions(members);
  }

  private formatPermissions(members: MemberWithContext[]): PermissionsPayload {
    const permissionsPayload = {};

    members.forEach((member) => {
      permissionsPayload[member.project.code] = {
        role: member.role?.code,
        organizationCode: member.organization?.code,
        projectCode: member.project.code,
      };
    });

    return permissionsPayload;
  }

  private async getMembersWithDetails(
    userId: string,
  ): Promise<MemberWithContext[]> {
    return await this.prisma.member.findMany({
      where: { userId },
      include: {
        project: true,
        role: true,
        organization: true,
      },
    });
  }

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

  async getTokens(
    userId: string,
    email: string,
    username: string,
    isSuperAdmin: boolean,
    permissionsPayload: PermissionsPayload,
  ) {
    const payload = {
      sub: userId,
      email,
      username,
      isSuperAdmin,
      permissions: permissionsPayload,
    };

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
