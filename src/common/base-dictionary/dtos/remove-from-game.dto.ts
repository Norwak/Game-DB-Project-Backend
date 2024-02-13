import { IsIn, IsNumber } from "class-validator";
import { dictionaryList } from "../../dictionary.list";

export class RemoveFromGameDto {
  @IsNumber()
  gameId: number;

  @IsIn(dictionaryList)
  metaName: string;

  @IsNumber({}, {each: true})
  metaIds: number[];
}