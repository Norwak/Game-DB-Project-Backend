import { IsNumber } from "class-validator";

export class addGenresDto {
  @IsNumber()
  gameId: number;

  @IsNumber({}, {each: true})
  genreIds: number[];
}