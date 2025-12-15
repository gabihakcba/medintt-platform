import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyTwoFactorDto {
  @ApiProperty({
    example: "123456",
    description: "Código de autenticación de dos factores (2FA)",
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: "El código debe tener 6 dígitos" })
  code: string;
}
