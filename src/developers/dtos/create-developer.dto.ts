import { IsString } from "class-validator";

export class CreateDeveloperDto {
  @IsString()
  title: string;
}