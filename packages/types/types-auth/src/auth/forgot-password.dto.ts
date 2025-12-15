import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({
    example: "user@example.com",
    description:
      "Correo electrónico asociado a la cuenta para recuperar contraseña",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
