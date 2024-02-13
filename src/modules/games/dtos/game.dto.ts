import { Expose, Type } from "class-transformer";
import { Developer } from "../../developers/entities/developer.entity";
import { Genre } from "../../genres/entities/genre.entity";
import { Console } from "../../consoles/entities/console.entity";
import { DeveloperDto } from "../../developers/dtos/developer.dto";
import { GenreDto } from "../../genres/dtos/genre.dto";
import { ConsoleDto } from "../../consoles/dtos/console.dto";

export class GameDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  releaseDate: Date;

  @Expose()
  @Type(() => DeveloperDto)
  developers: Developer[];

  @Expose()
  @Type(() => GenreDto)
  genres: Genre[];

  @Expose()
  @Type(() => ConsoleDto)
  consoles: Console[];
}