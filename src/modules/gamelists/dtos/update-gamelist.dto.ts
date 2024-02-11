import { IsString } from "class-validator";

export class UpdateGamelistDto {
  @IsString()
  title: string;
}