import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Query,
  BadRequestException,
  Patch,
  Request,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterInterlocutorDto } from './dto/register-interlocutor.dto';
import { LoginDto } from './dto/login.dto';
import type { JwtPayload, JwtPayloadWithRt } from './types/jwt-payload.type';
import { GetUser } from './decorators/get-user.decorator';
import { AtGuard } from './guards/at.guard';
import { OptionalAtGuard } from './guards/optional-at.guard';
import { RtGuard } from './guards/rt.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Throttle } from '@nestjs/throttler';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { VerifyTwoFactorDto } from './dto/verify-2fa.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Crear usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente.',
  })
  @UseGuards(AtGuard)
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Crear usuario interlocutor' })
  @ApiResponse({
    status: 201,
    description: 'Usuario interlocutor creado exitosamente.',
  })
  @UseGuards(AtGuard)
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @Post('register/interlocutor')
  registerInterlocutor(@Body() registerDto: RegisterInterlocutorDto) {
    return this.authService.registerInterlocutor(registerDto);
  }

  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto).then(({ tokens, user }) => {
      const isProd =
        this.configService.get<string>('NODE_ENV') === 'production';

      // Access Token Cookie (15 min)
      res.cookie('Authentication', tokens.access_token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        domain:
          this.configService.getOrThrow<string>('SELF_DOMAIN') || undefined,
        path: '/',
        maxAge:
          Number(this.configService.getOrThrow<string>('JWT_EXPIRATION')) ||
          1000 * 60 * 15, // 15 minutes
      });

      // Refresh Token Cookie (7 days)
      res.cookie('Refresh', tokens.refresh_token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        domain: this.configService.getOrThrow<string>('SELF_DOMAIN'),
        path: '/',
        maxAge:
          Number(
            this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRATION'),
          ) || 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      return { user };
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente.' })
  @UseGuards(OptionalAtGuard)
  @Get('logout')
  async logout(
    @GetUser() user: JwtPayload | undefined,
    @Res() res: Response,
    @Query('from') from?: string,
  ) {
    const userId = user?.sub;

    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax' as const,
      domain: this.configService.getOrThrow<string>('SELF_DOMAIN'),
      path: '/',
    };

    if (userId) {
      await this.authService.logout(userId);
    }

    res.clearCookie('Authentication', cookieOptions);
    res.clearCookie('Refresh', cookieOptions);

    const loginUrl =
      this.configService.get<string>('FRONTEND_URL_AUTH') + '/login';
    const target = from || loginUrl;

    return res.redirect(target);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refrescar tokens de acceso' })
  @ApiResponse({ status: 200, description: 'Tokens refrescados exitosamente.' })
  @ApiResponse({
    status: 401,
    description: 'Token de refresco inválido o expirado.',
  })
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetUser() user: JwtPayloadWithRt,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService
      .refreshTokens(user.sub, user.refreshToken)
      .then(({ tokens, user }) => {
        const isProd =
          this.configService.get<string>('NODE_ENV') === 'production';

        // Access Token Cookie (15 min)
        res.cookie('Authentication', tokens.access_token, {
          httpOnly: true,
          secure: isProd,
          sameSite: 'lax',
          domain: this.configService.getOrThrow<string>('SELF_DOMAIN'),
          path: '/',
          maxAge: 1000 * 60 * 15, // 15 minutes
        });

        // Refresh Token Cookie (7 days)
        res.cookie('Refresh', tokens.refresh_token, {
          httpOnly: true,
          secure: isProd,
          sameSite: 'lax',
          domain: this.configService.getOrThrow<string>('SELF_DOMAIN'),
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });

        return { user };
      });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar contraseña' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada exitosamente.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado / Token Inválido.' })
  @UseGuards(AtGuard)
  @Patch('change-password')
  async changePassword(
    @Request() req: { user: JwtPayload },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.sub;
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @ApiOperation({ summary: 'Solicitar recuperación de contraseña' })
  @ApiResponse({
    status: 200,
    description: 'Correo de recuperación enviado exitosamente.',
  })
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @ApiOperation({ summary: 'Restablecer contraseña' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida exitosamente.',
  })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @ApiOperation({ summary: 'Confirmar correo electrónico' })
  @ApiQuery({
    name: 'token',
    description: 'Token de confirmación recibido por correo',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Correo confirmado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Token inválido o faltante.' })
  @Get('confirm')
  async confirm(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token requerido');
    }
    return this.authService.confirmEmail(token);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Generar secreto para autenticación de dos factores (2FA)',
  })
  @ApiResponse({
    status: 201,
    description: 'Secreto y código QR generados exitosamente.',
  })
  @UseGuards(AtGuard)
  @Post('2fa/generate')
  async register2fa(@Request() req: { user: JwtPayload }) {
    const { qrCodeUrl, secret } =
      await this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(
        req.user.email,
        req.user.sub,
      );
    return { qrCodeUrl, secret };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activar autenticación de dos factores' })
  @ApiResponse({ status: 201, description: '2FA activado exitosamente.' })
  @ApiResponse({
    status: 400,
    description: 'Código inválido o falta generar secreto.',
  })
  @UseGuards(AtGuard)
  @Post('2fa/turn-on')
  async turnOnTwoFactorAuthentication(
    @Request() req: { user: JwtPayload },
    @Body() { code }: VerifyTwoFactorDto,
  ) {
    const user = await this.authService.getUserById(req.user.sub);

    if (!user?.twoFactorSecret) {
      throw new BadRequestException('Primero debes generar el código QR');
    }

    const isCodeValid =
      this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
        code,
        user?.twoFactorSecret,
      );

    if (!isCodeValid) {
      throw new UnauthorizedException('Código de autenticación inválido');
    }
    await this.authService.turnOnTwoFactorAuthentication(req.user.sub);

    return { message: 'Autenticación de dos factores activada correctamente' };
  }
}
