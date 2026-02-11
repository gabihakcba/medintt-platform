import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateFirmaDto {
  @IsString()
  @IsNotEmpty()
  proof: string;

  @IsString()
  @IsNotEmpty()
  firma: string;
}
