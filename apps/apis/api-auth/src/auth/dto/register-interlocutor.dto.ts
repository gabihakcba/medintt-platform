import { OmitType } from '@nestjs/swagger';
import { RegisterInterlocutorDto as SharedRegisterInterlocutorDto } from '@medintt/types-auth';

export class RegisterInterlocutorDto extends OmitType(
  SharedRegisterInterlocutorDto,
  [] as const,
) {}
