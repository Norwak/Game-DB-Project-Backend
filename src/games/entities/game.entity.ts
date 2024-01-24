import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Gamelist } from "../../gamelists/entities/gamelist.entity";
import { Developer } from "../../developers/entities/developer.entity";
import { Genre } from "../../genres/entities/genre.entity";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  releaseDate: Date;

  @ManyToMany(type => Gamelist, gamelist => gamelist.games)
  @JoinTable()
  gamelists: Gamelist[];

  @ManyToMany(type => Developer, developer => developer.games)
  @JoinTable()
  developers: Developer[];

  @ManyToMany(type => Genre, genre => genre.games)
  @JoinTable()
  genres: Genre[];
}