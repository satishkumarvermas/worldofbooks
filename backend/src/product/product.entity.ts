import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sourceId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  price: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  productUrl: string;
}
