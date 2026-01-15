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

  // ==================================================
  // PRODUCT LIST SCRAPING (WITH PRICE FIX)
  // ==================================================
  async scrapeProducts() {
    console.log('🚀 Product scraping started');

    const browser = await chromium.launch({
      headless: false, // keep false for debugging
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();

      // ✅ CORRECT & WORKING URL
      const categoryUrl =
        'https://www.worldofbooks.com/en-gb/collections/fiction-books';

      await page.goto(categoryUrl, {
        timeout: 0,
        waitUntil: 'domcontentloaded',
      });

      // ⏳ Safe wait for dynamic content
      await page.waitForTimeout(12000);

      // 🔥 STABLE PRODUCT EXTRACTION
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

              // --------------------
              // TITLE
              // --------------------
              const title =
                container.querySelector('h3')?.textContent?.trim() || '';

              // --------------------
              // PRICE (ROBUST LOGIC)
              // --------------------
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

              // --------------------
              // IMAGE
              // --------------------
              const imageUrl =
                container.querySelector('img')?.getAttribute('src') || '';

              // --------------------
              // PRODUCT URL
              // --------------------
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
            .filter((p) => p && p.title)
      );

      console.log(`🧾 Products found: ${products.length}`);

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

      console.log(`✅ Products saved: ${savedCount}`);

      return {
        productsFound: products.length,
        productsSaved: savedCount,
      };
    } catch (error) {
      console.error('❌ Product scraping failed:', error);
      return { error: 'Product scraping failed' };
    } finally {
      await browser.close();
    }
  }

  // ==================================================
  // GET ALL PRODUCTS
  // ==================================================
  async findAll() {
    return this.productRepo.find();
  }

  // ==================================================
  // PRODUCT DETAIL SCRAPING
  // ==================================================
  async scrapeProductDetail(productId: number) {
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
        const detail = this.detailRepo.create({
          product,
          ...data,
        });
        await this.detailRepo.save(detail);
      }

      return {
        productId: product.id,
        detailSaved: true,
      };
    } catch (error) {
      console.error('❌ Product detail scraping failed:', error);
      return { error: 'Product detail scraping failed' };
    } finally {
      await browser.close();
    }
  }
}
