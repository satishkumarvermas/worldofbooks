import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from './navigation.entity';
import { chromium } from 'playwright';

@Injectable()
export class NavigationService {
  constructor(
    @InjectRepository(Navigation)
    private repo: Repository<Navigation>,
  ) {}

  async scrapeAndSave() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.worldofbooks.com', {
      timeout: 0,
      waitUntil: 'domcontentloaded',
    });

    await page.waitForTimeout(4000);

    const items = await page.$$eval(
      'a',
      (links) =>
        (links as HTMLAnchorElement[]).map((l) => ({
          title: l.textContent?.trim() || '',
          url: l.href,
        }))
    );

    for (const item of items) {
      if (!item.title || !item.url) continue;

      const exists = await this.repo.findOne({
        where: { url: item.url },
      });

      if (!exists) {
        const nav = this.repo.create(item);
        await this.repo.save(nav);
      }
    }

    await browser.close();
    return { saved: true };
  }

  async findAll() {
    return this.repo.find();
  }
}
