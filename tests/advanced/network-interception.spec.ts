import { expect, test } from '@playwright/test';

test.describe('Network interception', () => {
  test('mock an API response used by page code', async ({ page }) => {
    await page.route('https://example.test/api/products', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify([
          { id: 1, name: 'Mock Backpack', price: 29.99 },
          { id: 2, name: 'Mock Bike Light', price: 9.99 },
        ]),
      });
    });

    await page.setContent('<p id="product-count"></p>');

    const productCount = await page.evaluate(async () => {
      const response = await fetch('https://example.test/api/products');
      const products = await response.json();
      document.querySelector('#product-count')!.textContent = String(products.length);

      return products.length;
    });

    expect(productCount).toBe(2);
    await expect(page.locator('#product-count')).toHaveText('2');
  });

  test('block image requests', async ({ page }) => {
    const blockedUrls: string[] = [];

    await page.route('**/*.png', async (route) => {
      blockedUrls.push(route.request().url());
      await route.abort();
    });

    await page.setContent('<img src="https://example.test/assets/logo.png" alt="blocked logo" />');

    expect(blockedUrls).toContain('https://example.test/assets/logo.png');
  });

  test('observe requests triggered by the page', async ({ page }) => {
    const observedRequests: string[] = [];

    page.on('request', (request) => {
      observedRequests.push(request.url());
    });

    await page.route('https://example.test/api/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.evaluate(async () => {
      await fetch('https://example.test/api/status');
    });

    expect(observedRequests).toContain('https://example.test/api/status');
  });
});
