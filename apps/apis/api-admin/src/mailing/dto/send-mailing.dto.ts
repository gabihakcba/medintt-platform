import { IsArray, IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BulkMailOptions {
  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  attachments?: { filename: string; content: string; contentType: string }[];
}

export class SendMailingDto {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  emails: string[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => BulkMailOptions)
  options: BulkMailOptions;
}
