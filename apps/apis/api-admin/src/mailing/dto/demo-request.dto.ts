import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BulkMailOptions } from './send-mailing.dto';

export class DemoRequestDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => BulkMailOptions)
  options: BulkMailOptions;
}
