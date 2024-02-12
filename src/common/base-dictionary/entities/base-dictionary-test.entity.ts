import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BaseDictionaryTestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}