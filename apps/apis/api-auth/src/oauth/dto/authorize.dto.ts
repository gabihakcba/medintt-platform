import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AuthorizeDto {
  @IsString()
  @IsNotEmpty()
  response_type: string; // Must be "code"

  @IsString()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsNotEmpty()
  redirect_uri: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  scope?: string; // Space-separated scopes, e.g., "openid profile email"
}
