import { test as base, expect } from '@playwright/test';

import { CartPage } from '../page-objects/CartPage';
import { LoginPage } from '../page-objects/LoginPage';
import { ProductsPage } from '../page-objects/ProductsPage';
import { SauceDemoUsers } from '../utils/test-users';

type SauceDemoFixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartWithProducts: CartPage;
};

export const test = base.extend<SauceDemoFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productsPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard);
    await use(productsPage);
  },

  cartWithProducts: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard);
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.addProductToCart('Sauce Labs Bike Light');
    await productsPage.goToCart();

    await use(new CartPage(page));
  },
});

export { expect };
