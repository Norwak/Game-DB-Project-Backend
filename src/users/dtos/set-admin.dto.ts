import { IsBoolean, IsNumber, IsString } from "class-validator";

export class setAdminDto {
  @IsNumber()
  userId: number;

  @IsString()
  adminKey: string;

  @IsBoolean()
  value: boolean;
}