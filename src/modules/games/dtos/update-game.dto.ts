import { IsDate, IsOptional, IsString } from "class-validator";

export class UpdateGameDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsDate()
  @IsOptional()
  releaseDate: Date;
}