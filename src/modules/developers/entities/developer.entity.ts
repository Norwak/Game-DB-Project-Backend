import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "../../games/entities/game.entity";

@Entity()
export class Developer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(type => Game, game => game.developers)
  games: Game[];
}