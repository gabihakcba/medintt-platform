import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  public async generateTwoFactorAuthenticationSecret(
    userEmail: string,
    userId: string,
  ) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      userEmail,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME') || 'MEDINTT',
      secret,
    );

    await this.userService.setTwoFactorSecret(userId, secret);

    const qrCodeUrl = await toDataURL(otpauthUrl);

    return {
      secret,
      qrCodeUrl,
    };
  }

  public isTwoFactorAuthenticationCodeValid(
    twoFactorCode: string,
    userSecret: string,
  ) {
    return authenticator.verify({
      token: twoFactorCode,
      secret: userSecret,
    });
  }
}
