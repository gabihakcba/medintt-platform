import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({
    example: "OldPassword123!",
    description: "Contraseña actual del usuario para verificación",
  })
  @IsString()
  @IsNotEmpty({ message: "La contraseña actual es requerida" })
  oldPassword: string;

  @ApiProperty({
    example: "NewPassword123!",
    description: "Nueva contraseña deseada",
    minLength: 6,
  })
  @IsString()
  @MinLength(6, {
    message: "La nueva contraseña debe tener al menos 6 caracteres",
  })
  newPassword: string;
}
