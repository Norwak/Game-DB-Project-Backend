import { IsString } from "class-validator";

export class UpdateBaseCrudDto {
  @IsString()
  title: string;
}