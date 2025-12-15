import { ResetPasswordDto as SharedResetPasswordDto } from '@medintt/types-auth';
import { OmitType } from '@nestjs/swagger';

export class ResetPasswordDto extends OmitType(
  SharedResetPasswordDto,
  [] as const,
) {}
