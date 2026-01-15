import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private service: CategoryService) {}

  @Get('scrape')
  scrapeCategories() {
    return this.service.scrapeAndSave();
  }

  @Get()
  getAll() {
    return this.service.findAll();
  }
}
