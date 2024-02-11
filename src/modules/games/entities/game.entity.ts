import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Gamelist } from "../../gamelists/entities/gamelist.entity";
import { Developer } from "../../developers/entities/developer.entity";
import { Genre } from "../../genres/entities/genre.entity";
import { Console } from "../../consoles/entities/console.entity";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  releaseDate: Date;

  @ManyToMany(type => Gamelist, gamelist => gamelist.games)
  gamelists: Gamelist[];

  @ManyToMany(type => Console, console => console.games, { nullable: false, cascade: true })
  @JoinTable()
  consoles: Console[];

  @ManyToMany(type => Developer, developer => developer.games, { nullable: false, cascade: true })
  @JoinTable()
  developers: Developer[];

  @ManyToMany(type => Genre, genre => genre.games, { nullable: false, cascade: true })
  @JoinTable()
  genres: Genre[];
}