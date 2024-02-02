import { Expose } from "class-transformer";
import { Game } from "../../games/entities/game.entity";

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

  @Expose()
  gamesIds: number[];
}