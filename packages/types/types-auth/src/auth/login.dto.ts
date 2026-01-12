import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "admin@medintt.com",
    description: "Correo del usuario",
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Password123!", minimum: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "123456", minimum: 6 })
  @IsOptional()
  @IsString()
  twoFactorCode?: string;
}
