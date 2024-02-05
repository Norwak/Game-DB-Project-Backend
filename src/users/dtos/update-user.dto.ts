import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsDate()
  @IsOptional()
  lastLogin?: Date;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}