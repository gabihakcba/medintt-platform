import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    example: "johndoe",
    description: "Nombre de usuario único para la cuenta",
    minLength: 4,
    maxLength: 20,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    example: "example@gmail.com",
    description: "Correo electrónico del usuario",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "Password123!",
    description: "Contraseña segura del usuario",
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  password: string;

  @ApiProperty({
    example: "John",
    description: "Nombre personal del usuario",
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "Doe",
    description: "Apellido del usuario",
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: "12345678",
    description: "Documento Nacional de Identidad",
    minLength: 7,
  })
  @IsString()
  @MinLength(7, { message: "Debe tener la menos 7 caracteres" })
  dni: string;
}
