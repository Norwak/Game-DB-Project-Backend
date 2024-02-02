import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(type => User, user => user.gamelists)
  @JoinColumn()
  user: User;

  @ManyToMany(type => Game, game => game.gamelists)
  games: Game[];
}