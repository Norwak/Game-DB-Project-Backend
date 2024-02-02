import { IsArray, IsNumber } from "class-validator";

export class AddGamesDto {
  @IsNumber()
  gamelistId: number;

  @IsNumber({}, {each: true})
  gameIds: number[];
}