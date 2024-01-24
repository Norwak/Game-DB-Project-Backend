import { IsString } from "class-validator";

export class UpdateDeveloperDto {
  @IsString()
  title: string;
}