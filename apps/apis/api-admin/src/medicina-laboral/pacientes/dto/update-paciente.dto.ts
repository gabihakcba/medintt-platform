import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class UpdatePacienteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Nombre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Apellido?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  NroDocumento?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  FechaNacimiento?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  Email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Cargo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Puesto?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Funcion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Direccion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Barrio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  Id_Localidad?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Telefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Nacionalidad?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  CUIL?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Genero?: string;
}
