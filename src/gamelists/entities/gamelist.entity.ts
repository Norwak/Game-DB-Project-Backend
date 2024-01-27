import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Game } from "../../games/entities/game.entity";

@Entity()
export class Gamelist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  lastUpdated: Date;

  @ManyToOne(type => User, user => user.gamelists)
  user: User;

  @ManyToMany(type => Game, game => game.gamelists)
  games: Game[];
}