import { expect, test } from '@playwright/test';

import { LoginPage } from '../../../src/page-objects/LoginPage';
import { ProductsPage } from '../../../src/page-objects/ProductsPage';
import { SauceDemoUsers } from '../../../src/utils/test-users';

test.describe('SauceDemo login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);

    await loginPage.goto();
  });

  test('standard user can log in and reach the inventory page', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await loginPage.login(SauceDemoUsers.standard);

    await expect(page).toHaveURL(/inventory.html/);
    await expect(productsPage.title).toHaveText('Products');
  });

  test('user sees an error message for invalid login credentials', async ({ page }) => {
    await loginPage.loginWithCredentials(SauceDemoUsers.standard.username, 'wrong_password');

    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(loginPage.errorMessage).toContainText(
      'Epic sadface: Username and password do not match any user in this service',
    );
  });

  test('locked user sees the locked-out message', async () => {
    await loginPage.login(SauceDemoUsers.locked);

    await expect(loginPage.errorMessage).toContainText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
  });

  test('user can clear a login error message', async () => {
    await loginPage.loginWithCredentials(SauceDemoUsers.standard.username, 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();

    await loginPage.clearError();

    await expect(loginPage.errorMessage).toBeHidden();
  });
});
