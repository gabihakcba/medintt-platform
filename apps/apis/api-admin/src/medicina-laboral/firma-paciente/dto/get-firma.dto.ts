import { IsString, IsNotEmpty } from 'class-validator';

export class GetFirmaDto {
  @IsString()
  @IsNotEmpty()
  proof: string;
}
