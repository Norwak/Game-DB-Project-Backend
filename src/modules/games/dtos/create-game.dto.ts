import { IsDate, IsString } from "class-validator";

export class CreateGameDto {
  @IsString()
  title: string;

  @IsDate()
  releaseDate: Date;
}