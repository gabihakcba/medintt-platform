import { IsDateString, IsNumberString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetPacientesEmailsDto {
  @ApiPropertyOptional({ description: 'Start date (ISO8601)' })
  @IsOptional()
  @IsDateString()
  desde?: string;

  @ApiPropertyOptional({ description: 'End date (ISO8601)' })
  @IsOptional()
  @IsDateString()
  hasta?: string;

  @ApiPropertyOptional({ description: 'Profesional ID' })
  @IsOptional()
  @IsNumberString()
  profesionalId?: string;
}
