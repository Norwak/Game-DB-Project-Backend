import { Expose, Transform } from "class-transformer";

export class GamelistDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  creationDate: Date;

  @Expose()
  lastUpdated: Date;

  @Expose()
  userId: number;
}