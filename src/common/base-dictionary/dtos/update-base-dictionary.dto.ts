import { IsString } from "class-validator";

export class UpdateBaseDictionaryDto {
  @IsString()
  title: string;
}