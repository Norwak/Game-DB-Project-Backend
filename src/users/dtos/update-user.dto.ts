import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  nickname: string;

  @IsString()
  @IsOptional()
  password?: string;
}