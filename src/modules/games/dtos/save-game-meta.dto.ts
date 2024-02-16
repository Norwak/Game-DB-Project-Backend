import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";
import { ConsoleDto } from "../../consoles/dtos/console.dto";
import { DeveloperDto } from "../../developers/dtos/developer.dto";
import { GenreDto } from "../../genres/dtos/genre.dto";
import { Developer } from "../../developers/entities/developer.entity";
import { Genre } from "../../genres/entities/genre.entity";
import { Console } from "../../consoles/entities/console.entity";

export class SaveGameMetaDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsDate()
  releaseDate: Date;

  @IsString()
  imagePath: string;

  @Type(() => ConsoleDto)
  consoles: Console[];

  @Type(() => DeveloperDto)
  developers: Developer[];

  @Type(() => GenreDto)
  genres: Genre[];
}