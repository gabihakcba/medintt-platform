import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  @MinLength(7, { message: 'Debe tener la menos 7 caracteres' })
  dni: string;
}
