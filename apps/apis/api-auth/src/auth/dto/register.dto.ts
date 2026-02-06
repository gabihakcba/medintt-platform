import { RegisterDto as SharedRegisterDto } from '@medintt/types-auth';
import { OmitType } from '@nestjs/swagger';

export class RegisterDto extends OmitType(SharedRegisterDto, [] as const) {}
