import { IsIn, IsNumber, IsString } from "class-validator";
import { dictionaryList } from "../../dictionary.list";

export class AddToGameDto {
  @IsNumber()
  gameId: number;

  @IsIn(dictionaryList)
  metaName: string;

  @IsNumber({}, {each: true})
  metaIds: number[];
}