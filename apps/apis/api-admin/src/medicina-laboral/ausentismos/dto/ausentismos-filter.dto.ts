import { IsOptional, IsISO8601 } from 'class-validator';

export class AusentismosFilterDto {
  @IsOptional()
  @IsISO8601()
  desde?: string;

  @IsOptional()
  @IsISO8601()
  hasta?: string;

  @IsOptional()
  @IsISO8601()
  mesReferencia?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  prestatariaId?: number;
}
