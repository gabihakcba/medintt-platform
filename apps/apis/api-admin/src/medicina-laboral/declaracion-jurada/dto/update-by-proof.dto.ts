import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateDeclaracionDto } from './update-declaracion.dto';

export class UpdateByProofDto {
  @IsString()
  @IsNotEmpty()
  proof: string;

  @ValidateNested()
  @Type(() => UpdateDeclaracionDto)
  data: UpdateDeclaracionDto;
}
