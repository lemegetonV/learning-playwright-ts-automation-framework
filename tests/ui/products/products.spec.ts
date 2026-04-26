import { expect, test } from '@playwright/test';

import { LoginPage } from '../../../src/page-objects/LoginPage';
import { ProductsPage } from '../../../src/page-objects/ProductsPage';
import { ProductSortOption } from '../../../src/types/products';
import { SauceDemoUsers } from '../../../src/utils/test-users';

test.describe('SauceDemo products', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard);
    await expect(productsPage.title).toHaveText('Products');
  });

  test('standard user can see the product catalog @smoke', async () => {
    await test.step('Assert: product catalog controls and items are visible', async () => {
      await expect(productsPage.inventoryItems).toHaveCount(6);
      await expect(productsPage.sortDropdown).toBeVisible();
      await expect(productsPage.shoppingCartLink).toBeVisible();
    });
  });

  test('standard user can add and remove a product from the cart badge', async () => {
    await test.step('Act: add product to the cart', async () => {
      await productsPage.addProductToCart('Sauce Labs Backpack');
    });

    await test.step('Assert: cart badge increments and product card changes state', async () => {
      await expect(productsPage.shoppingCartBadge).toHaveText('1');
      expect(await productsPage.isProductInCart('Sauce Labs Backpack')).toBe(true);
    });

    await test.step('Act: remove product from the cart', async () => {
      await productsPage.removeProductFromCart('Sauce Labs Backpack');
    });

    await test.step('Assert: cart badge is cleared', async () => {
      expect(await productsPage.getCartItemCount()).toBe(0);
    });
  });

  test('standard user can sort products by price low to high', async () => {
    await productsPage.sortBy(ProductSortOption.PriceLowToHigh);

    const productNames = await productsPage.getProductNames();

    expect(productNames[0]).toBe('Sauce Labs Onesie');
  });

  test('product price can be read from a product card', async () => {
    await expect(async () => {
      expect(await productsPage.getProductPrice('Sauce Labs Backpack')).toBe('$29.99');
    }).toPass();
  });
});
