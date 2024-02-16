import { IsDate, IsOptional, IsString } from "class-validator";

export class CreateGameDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsDate()
  @IsOptional()
  releaseDate: Date;

  @IsOptional()
  imagePath?: string;
}