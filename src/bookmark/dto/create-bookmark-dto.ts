import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class BookmarkDto {
  // @IsString()
  // userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsOptional()
  description?: string;
}
