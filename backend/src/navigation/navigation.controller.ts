import { Controller, Get } from '@nestjs/common';
import { NavigationService } from './navigation.service';

@Controller('navigation')
export class NavigationController {
  constructor(private service: NavigationService) {}

  @Get('scrape')
  scrape() {
    return this.service.scrapeAndSave();
  }

  @Get()
  getAll() {
    return this.service.findAll();
  }
}
