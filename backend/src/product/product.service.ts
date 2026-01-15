import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { chromium } from 'playwright';
import { Product } from './product.entity';
import { ProductDetail } from './product-detail.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(ProductDetail)
    private detailRepo: Repository<ProductDetail>,
  ) {}

  async scrapeProducts() {
    if (process.env.NODE_ENV === 'production') {
      return {
        message:
          'Scraping is disabled in production. Data is served from the database.',
      };
    }

    const browser = await chromium.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();

      await page.goto(
        'https://www.worldofbooks.com/en-gb/collections/fiction-books',
        {
          timeout: 0,
          waitUntil: 'domcontentloaded',
        },
      );

      await page.waitForTimeout(12000);

      const products = await page.$$eval(
        'a[href*="/products/"]',
        (links) =>
          (links as HTMLAnchorElement[])
            .map((link) => {
              const container =
                link.closest('li') ||
                link.closest('div') ||
                link.closest('article');

              if (!container) return null;

              const title =
                container.querySelector('h3')?.textContent?.trim() || '';

              let price = '';
              const priceSelectors = [
                '[data-testid="price"]',
                '.price',
                'p',
                'span',
              ];

              for (const selector of priceSelectors) {
                const el = container.querySelector(selector);
                if (
                  el &&
                  el.textContent &&
                  el.textContent.includes('£')
                ) {
                  price = el.textContent.trim();
                  break;
                }
              }

              const imageUrl =
                container.querySelector('img')?.getAttribute('src') || '';

              const productUrl = link.href.startsWith('http')
                ? link.href
                : `https://www.worldofbooks.com${link.href}`;

              return {
                sourceId: productUrl.split('/').pop() || productUrl,
                title,
                price,
                imageUrl,
                productUrl,
              };
            })
            .filter((p) => p && p.title),
      );

      let savedCount = 0;

      for (const p of products as any[]) {
        const exists = await this.productRepo.findOne({
          where: { sourceId: p.sourceId },
        });

        if (!exists) {
          await this.productRepo.save(this.productRepo.create(p));
          savedCount++;
        }
      }

      return {
        productsFound: products.length,
        productsSaved: savedCount,
      };
    } catch {
      return { error: 'Product scraping failed' };
    } finally {
      await browser.close();
    }
  }

  async findAll() {
    return this.productRepo.find();
  }

  async scrapeProductDetail(productId: number) {
    if (process.env.NODE_ENV === 'production') {
      return {
        message:
          'Detail scraping is disabled in production. Data is served from the database.',
      };
    }

    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) {
      return { error: 'Product not found' };
    }

    const browser = await chromium.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();

      await page.goto(product.productUrl, {
        timeout: 0,
        waitUntil: 'domcontentloaded',
      });

      await page.waitForTimeout(8000);

      const data = await page.evaluate(() => {
        const description =
          document.querySelector('[data-testid="product-description"]')
            ?.textContent ||
          document.querySelector('section')?.textContent ||
          '';

        const rating =
          document.querySelector('[aria-label*="rating"]')?.textContent || '';

        const reviewsCount =
          document.querySelector('[href*="#reviews"]')?.textContent || '';

        const specs: any = {};
        document.querySelectorAll('li').forEach((li) => {
          const text = li.textContent || '';
          if (text.includes(':')) {
            const [key, value] = text.split(':');
            specs[key.trim()] = value.trim();
          }
        });

        return {
          description: description.trim(),
          rating,
          reviewsCount,
          specs,
        };
      });

      const exists = await this.detailRepo.findOne({
        where: { product: { id: product.id } },
      });

      if (!exists) {
        await this.detailRepo.save(
          this.detailRepo.create({
            product,
            ...data,
          }),
        );
      }

      return {
        productId: product.id,
        detailSaved: true,
      };
    } catch {
      return { error: 'Product detail scraping failed' };
    } finally {
      await browser.close();
    }
  }
}
