import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditBookmarkDto {
  // @IsString()
  // userId: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  link: string;

  @IsString()
  @IsOptional()
  description?: string;
}
