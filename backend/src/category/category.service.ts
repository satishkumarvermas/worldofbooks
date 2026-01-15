import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { chromium } from 'playwright';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  async scrapeAndSave() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.worldofbooks.com', {
      timeout: 0,
      waitUntil: 'domcontentloaded',
    });

    await page.waitForTimeout(5000);

    // 🔥 CATEGORY LINKS (IMPORTANT SELECTOR)
    const categories = await page.$$eval(
      'a',
      (links) =>
        (links as HTMLAnchorElement[])
          .filter((l) =>
            l.href.includes('/collections') ||
            l.href.includes('/books')
          )
          .map((l) => ({
            title: l.textContent?.trim() || '',
            url: l.href,
          }))
    );

    for (const cat of categories) {
      if (!cat.title || !cat.url) continue;

      const exists = await this.repo.findOne({
        where: { url: cat.url },
      });

      if (!exists) {
        await this.repo.save(this.repo.create(cat));
      }
    }

    await browser.close();
    return { categoriesSaved: true };
  }

  findAll() {
    return this.repo.find();
  }
}
