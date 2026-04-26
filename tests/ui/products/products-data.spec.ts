import { expect, test } from '@playwright/test';

import products from '../../../test-data/saucedemo-products.json';
import { LoginPage } from '../../../src/page-objects/LoginPage';
import { ProductsPage } from '../../../src/page-objects/ProductsPage';
import type { SauceDemoProductName } from '../../../src/types/products';
import { SauceDemoUsers } from '../../../src/utils/test-users';

type ProductCase = {
  readonly name: SauceDemoProductName;
  readonly price: string;
  readonly expectedInCart: boolean;
};

const productCases = products as ProductCase[];

test.describe('SauceDemo product data checks', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard);
  });

  for (const product of productCases) {
    test(`shows expected price for ${product.name}`, async () => {
      expect(await productsPage.getProductPrice(product.name)).toBe(product.price);
    });

    test(`can add ${product.name} to cart from data`, async () => {
      await productsPage.addProductToCart(product.name);

      expect(await productsPage.isProductInCart(product.name)).toBe(product.expectedInCart);
    });
  }
});
