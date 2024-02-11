import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BaseCrudTestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}