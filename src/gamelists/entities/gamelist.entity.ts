import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";
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



  @ManyToOne(type => User, user => user.gamelists, { nullable: false, eager: true })
  @JoinColumn()
  user: User;

  @ManyToMany(type => Game, game => game.gamelists, { nullable: false, cascade: true })
  @JoinTable()
  games: Game[];
}