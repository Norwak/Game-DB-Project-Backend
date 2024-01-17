import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
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
  gamelists: Gamelist[];

  @ManyToMany(type => Developer, developer => developer.games)
  developers: Developer[];

  @ManyToMany(type => Genre, genre => genre.games)
  genres: Genre[];
}