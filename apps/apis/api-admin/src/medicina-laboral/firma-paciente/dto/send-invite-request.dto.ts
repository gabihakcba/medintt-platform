import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SendInviteRequestDto {
  @ApiProperty({ description: 'ID del paciente' })
  @IsNotEmpty({ message: 'El ID del paciente no puede estar vacío' })
  @IsNumber()
  pacienteId: number;
}
