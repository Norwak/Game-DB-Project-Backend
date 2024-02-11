import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Gamelist } from "../../gamelists/entities/gamelist.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  password: string;

  @CreateDateColumn()
  registrationDate: Date;

  @Column()
  lastLogin: Date;

  @Column({default: false})
  isAdmin: boolean;

  @OneToMany(type => Gamelist, gamelist => gamelist.user)
  gamelists: Gamelist[];
}