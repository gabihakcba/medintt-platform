import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFirmaAdminDto {
  @ApiProperty({ description: 'Firma en formato Base64' })
  @IsNotEmpty({ message: 'La firma no puede estar vacía' })
  @IsString()
  firma: string;
}
