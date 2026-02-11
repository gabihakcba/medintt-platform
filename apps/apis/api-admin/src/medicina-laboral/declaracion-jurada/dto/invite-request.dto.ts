import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class InviteRequestDto {
  @IsNumber()
  @IsPositive()
  ddjjId: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  ttlMinutes?: number;
}
