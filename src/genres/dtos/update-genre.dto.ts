import { IsString } from "class-validator";

export class UpdateGenreDto {
  @IsString()
  title: string;
}