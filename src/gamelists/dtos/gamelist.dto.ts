import { Expose, Type } from "class-transformer";
import { Game } from "../../games/entities/game.entity";
import { User } from "../../users/entities/user.entity";
import { UserDto } from "../../users/dtos/user.dto";
import { GameDto } from "../../games/dtos/game.dto";

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
  @Type(() => UserDto)
  user: User;

  @Expose()
  @Type(() => GameDto)
  games: Game[];
}