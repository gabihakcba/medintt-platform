import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEmail,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PacienteDataDto {
  @IsNotEmpty()
  @IsString()
  Apellido: string;

  @IsNotEmpty()
  @IsString()
  Nombre: string;

  @IsNotEmpty()
  @IsString()
  NroDocumento: string;

  @IsNotEmpty()
  @IsDateString() // Or handle date parsing
  FechaNacimiento: string | Date;

  @IsNotEmpty()
  @IsString()
  Direccion: string;

  @IsNotEmpty()
  @IsString()
  Barrio: string;

  @IsNotEmpty()
  @IsNumber()
  Id_Localidad: number;

  @IsOptional()
  @IsString()
  Telefono?: string;

  @IsNotEmpty()
  @IsEmail()
  Email: string;

  @IsOptional()
  @IsString()
  Nacionalidad?: string;

  @IsOptional()
  @IsString()
  CUIL?: string;
}

export class UpdatePacienteDto {
  @IsNotEmpty()
  @IsString()
  proof: string;

  @IsNotEmpty()
  @Type(() => PacienteDataDto)
  paciente: PacienteDataDto;
}
