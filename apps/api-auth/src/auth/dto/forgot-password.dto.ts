import { ForgotPasswordDto as SharedForgotPasswordDto } from '@medintt/types-auth';
import { OmitType } from '@nestjs/swagger';

export class ForgotPasswordDto extends OmitType(
  SharedForgotPasswordDto,
  [] as const,
) {}
