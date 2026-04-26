import { expect, test } from '@playwright/test';

import { ProductsPage } from '../../../src/page-objects/ProductsPage';

test('authenticated user can open the inventory page without UI login @auth', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  await productsPage.goto();

  await expect(page).toHaveURL(/inventory/);
  await expect(productsPage.title).toHaveText('Products');
  await expect(productsPage.inventoryItems).toHaveCount(6);
});
