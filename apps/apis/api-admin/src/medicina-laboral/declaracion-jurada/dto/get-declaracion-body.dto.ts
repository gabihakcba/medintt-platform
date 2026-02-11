import { IsString, IsNotEmpty } from 'class-validator';

export class GetDeclaracionBodyDto {
  @IsString()
  @IsNotEmpty()
  proof: string;
}
