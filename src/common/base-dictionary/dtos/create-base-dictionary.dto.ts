import { IsString } from "class-validator";

export class CreateBaseDictionaryDto {
  @IsString()
  title: string;
}