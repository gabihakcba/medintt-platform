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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { JwtPayload, JwtPayloadWithRt } from './types/jwt-payload.type';
import { GetUser } from './decorators/get-user.decorator';
import { AtGuard } from './guards/at.guard';
import { RtGuard } from './guards/rt.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/resset-paswwrod.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Throttle } from '@nestjs/throttler';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { VerifyTwoFactorDto } from './dto/verify-2fa.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear usuario' })
  @ApiResponse({
    status: 200,
    description: 'Creacion exitosa, devuelve el usuario.',
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  @UseGuards(AtGuard)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso, devuelve tokens.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetUser('sub') userId: string) {
    return this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@GetUser() user: JwtPayloadWithRt) {
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar contraseña' })
  @UseGuards(AtGuard)
  @Patch('change-password')
  async changePassword(
    @Request() req: { user: JwtPayload },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.sub;
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('confirm')
  async confirm(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token requerido');
    }
    return this.authService.confirmEmail(token);
  }

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
