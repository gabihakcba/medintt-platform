import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class InviteRequestDto {
  @IsNumber()
  @IsPositive()
  pacienteId: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  ttlMinutes?: number;
}
