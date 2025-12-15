import { LoginDto as SharedLoginDto } from '@medintt/types-auth';
import { OmitType } from '@nestjs/swagger';

export class LoginDto extends OmitType(SharedLoginDto, [] as const) {}
