import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Navigation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  url: string;
}
