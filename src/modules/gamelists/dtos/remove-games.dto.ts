import { IsNumber } from "class-validator";

export class RemoveGamesDto {
  @IsNumber()
  gamelistId: number;

  @IsNumber({}, {each: true})
  gameIds: number[];
}