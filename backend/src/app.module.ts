import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NavigationModule } from './navigation/navigation.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

import { Navigation } from './navigation/navigation.entity';
import { Category } from './category/category.entity';
import { Product } from './product/product.entity';
import { ProductDetail } from './product/product-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Navigation, Category, Product, ProductDetail],
      synchronize: true,
    }),

    NavigationModule,
    CategoryModule,
    ProductModule,
  ],
})
export class AppModule {}
