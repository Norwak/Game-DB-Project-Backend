import { Expose, Type } from "class-transformer";
import { Developer } from "../../developers/entities/developer.entity";
import { Genre } from "../../genres/entities/genre.entity";

export class GameDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  releaseDate: Date;

  @Expose()
  @Type(() => Developer)
  developers: Developer[];

  @Expose()
  @Type(() => Genre)
  genres: Genre[];
}