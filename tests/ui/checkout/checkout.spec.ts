import { expect, test } from '@playwright/test';

import { CartPage } from '../../../src/page-objects/CartPage';
import { CheckoutPage } from '../../../src/page-objects/CheckoutPage';
import { LoginPage } from '../../../src/page-objects/LoginPage';
import { ProductsPage } from '../../../src/page-objects/ProductsPage';
import type { CheckoutCustomer } from '../../../src/types/checkout';
import { SauceDemoUsers } from '../../../src/utils/test-users';

const validCustomer: CheckoutCustomer = {
  firstName: 'Asha',
  lastName: 'Tester',
  postalCode: '560001',
};

test.describe('SauceDemo checkout', () => {
  test('standard user can complete checkout for one product', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard);
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillCustomerInformation(validCustomer);
    await checkoutPage.continue();
    await checkoutPage.finish();

    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('checkout shows a validation error when first name is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(SauceDemoUsers.standard);
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.continue();

    await expect(checkoutPage.errorMessage).toContainText('Error: First Name is required');
  });
});
