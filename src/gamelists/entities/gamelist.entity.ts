import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Game } from "../../games/entities/game.entity";

@Entity()
export class Gamelist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  creationDate: Date;

  @Column()
  lastUpdated: Date;

  @ManyToOne(type => User, user => user.gamelists)
  user: User;

  @ManyToMany(type => Game, game => game.gamelists)
  games: Game[];
}