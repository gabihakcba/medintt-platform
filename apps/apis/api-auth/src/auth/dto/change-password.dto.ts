import { ChangePasswordDto as SharedChangePasswordDto } from '@medintt/types-auth';
import { OmitType } from '@nestjs/swagger';

export class ChangePasswordDto extends OmitType(
  SharedChangePasswordDto,
  [] as const,
) {}
