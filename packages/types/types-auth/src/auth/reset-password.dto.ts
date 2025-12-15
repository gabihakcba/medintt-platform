import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "Token de restablecimiento de contraseña enviado por correo",
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    example: "NewSecurePassword123!",
    description: "Nueva contraseña para establecer",
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
