import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "../../games/entities/game.entity";

@Entity()
export class BaseCrudTestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}