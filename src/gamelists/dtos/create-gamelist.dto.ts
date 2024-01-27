import { IsString } from "class-validator";

export class CreateGamelistDto {
  @IsString()
  title: string;
}