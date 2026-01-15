import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  specs: any;

  @Column({ nullable: true })
  rating: string;

  @Column({ nullable: true })
  reviewsCount: string;
}
