import { IsString, IsNotEmpty, Matches, IsOptional } from 'class-validator';

export class VerifyRequestDto {
  @IsString()
  @IsNotEmpty()
  inviteToken: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{7,9}$/, {
    message: 'El DNI debe tener entre 7 y 9 dígitos numéricos',
  })
  dni: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha de nacimiento debe tener formato YYYY-MM-DD',
  })
  fechaNacimiento?: string;
}
