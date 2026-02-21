import { ApiProperty } from "@nestjs/swagger";
import { RegisterDto } from "./register.dto";
import { IsString, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class RegisterMemberDto {
  @ApiProperty({ description: "ID de la Organización (Prestataria)" })
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: "Código del Rol", example: "interlocutor" })
  @IsString()
  @IsNotEmpty()
  roleCode: string;

  @ApiProperty({
    description: "Código del Proyecto",
    example: "medicina-laboral",
  })
  @IsString()
  @IsNotEmpty()
  projectCode: string;
}

export class RegisterInterlocutorDto {
  @ApiProperty({ description: "Datos del usuario" })
  @ValidateNested()
  @Type(() => RegisterDto)
  user: RegisterDto;

  @ApiProperty({ description: "Datos de la membresía" })
  @ValidateNested()
  @Type(() => RegisterMemberDto)
  member: RegisterMemberDto;
}
