import { IsString } from "class-validator";

export class CreateBaseCrudDto {
  @IsString()
  title: string;
}