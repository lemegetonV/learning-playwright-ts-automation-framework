import { expect, test } from '@playwright/test';

import { CartPage } from '../../../src/page-objects/CartPage';
import { LoginPage } from '../../../src/page-objects/LoginPage';
import { ProductsPage } from '../../../src/page-objects/ProductsPage';
import { SauceDemoUsers } from '../../../src/utils/test-users';

test.describe('SauceDemo cart', () => {
  test('product added from inventory appears in the cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard);
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.goToCart();

    await expect(cartPage.title).toHaveText('Your Cart');
    expect(await cartPage.getItemNames()).toContain('Sauce Labs Backpack');
    expect(await cartPage.getItemPrice('Sauce Labs Backpack')).toBe('$29.99');
  });

  test('standard user can remove a product from the cart page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard);
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.goToCart();

    await cartPage.removeItemByName('Sauce Labs Backpack');

    await expect(cartPage.cartItems).toHaveCount(0);
  });
});
