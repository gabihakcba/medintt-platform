import { VerifyTwoFactorDto as SharedVerifyTwoFactorDto } from '@medintt/types-auth';
import { OmitType } from '@nestjs/swagger';

export class VerifyTwoFactorDto extends OmitType(
  SharedVerifyTwoFactorDto,
  [] as const,
) {}
