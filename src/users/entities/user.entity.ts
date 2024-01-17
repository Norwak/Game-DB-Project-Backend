import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Gamelist } from "../../gamelists/entities/gamelist.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  registrationDate: Date;

  @Column()
  lastLogin: Date;

  @OneToMany(type => Gamelist, gamelist => gamelist.user)
  gamelists: Gamelist[];
}