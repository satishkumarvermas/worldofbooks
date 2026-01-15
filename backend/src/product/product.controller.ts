import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  // 🔹 Scrape product list
  @Get('scrape')
  scrapeProducts() {
    return this.service.scrapeProducts();
  }

  // 🔹 Get all products
  @Get()
  getAllProducts() {
    return this.service.findAll();
  }

  // 🔹 Scrape product detail by ID
  @Get(':id/detail')
  scrapeProductDetail(@Param('id') id: string) {
    return this.service.scrapeProductDetail(Number(id));
  }
}
