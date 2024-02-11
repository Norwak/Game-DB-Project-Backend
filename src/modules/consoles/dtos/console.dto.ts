import { Expose, Type } from "class-transformer";
import { GameDto } from "../../games/dtos/game.dto";
import { Game } from "../../games/entities/game.entity";

export class ConsoleDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  @Type(() => GameDto)
  games: Game[];
}