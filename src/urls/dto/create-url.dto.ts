import { IsNumber, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @MinLength(1)
  @IsUrl()
  original: string;
}
