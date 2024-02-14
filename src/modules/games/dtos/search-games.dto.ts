import { IsArray, IsNumber, IsNumberString, IsOptional, IsString, Min } from "class-validator";

export class SearchGamesDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsArray()
  @IsNumberString({}, {each: true})
  @IsOptional()
  years?: string[];

  @IsArray()
  @IsNumberString({}, {each: true})
  @IsOptional()
  genres?: number[];

  @IsArray()
  @IsNumberString({}, {each: true})
  @IsOptional()
  developers?: number[];

  @IsArray()
  @IsNumberString({}, {each: true})
  @IsOptional()
  consoles?: number[];

  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;
}