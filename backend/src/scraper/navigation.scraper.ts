import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Starting Playwright test...');

  const browser = await chromium.launch({
    headless: false, // IMPORTANT: show browser
    slowMo: 50,      // slow down actions
  });

  const page = await browser.newPage();

  console.log('🌍 Opening WorldOfBooks...');
  await page.goto('https://www.worldofbooks.com', {
    timeout: 0, // disable timeout
    waitUntil: 'domcontentloaded',
  });

  console.log('⏳ Waiting for page...');
  await page.waitForTimeout(5000);

  const links = await page.$$eval(
    'a',
    (anchors) =>
      (anchors as HTMLAnchorElement[]).map((a) => ({
        title: a.textContent?.trim() || '',
        url: a.href,
      }))
  );

  console.log('✅ Links scraped (first 10):');
  console.log(links.slice(0, 10));

  await browser.close();
  console.log('🎉 Done');
})();
