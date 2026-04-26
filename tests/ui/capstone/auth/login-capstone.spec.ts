import { expect, test } from '@playwright/test';

import { LoginPage } from '../../../../src/page-objects/LoginPage';
import { ProductsPage } from '../../../../src/page-objects/ProductsPage';
import {
  EmptyFieldCases,
  InvalidCredentialCases,
  ValidLoginCases,
} from '../../../../src/utils/capstone-data';

test.describe('Capstone authentication coverage', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.describe('Valid login scenarios', () => {
    for (const loginCase of ValidLoginCases) {
      test(`valid login succeeds for ${loginCase.title}`, async ({ page }) => {
        const productsPage = new ProductsPage(page);

        await loginPage.login(loginCase.user);

        await expect(page).toHaveURL(/inventory.html/);
        await expect(productsPage.title).toHaveText('Products');
      });
    }
  });

  test.describe('Invalid credentials handling', () => {
    for (const loginCase of InvalidCredentialCases) {
      test(`invalid login is rejected for ${loginCase.title}`, async ({ page }) => {
        await loginPage.loginWithCredentials(loginCase.username, loginCase.password);

        await expect(page).toHaveURL(/saucedemo\.com\/?$/);
        await expect(loginPage.errorMessage).toContainText(loginCase.expectedError);
      });
    }
  });

  test.describe('Empty field validation', () => {
    for (const loginCase of EmptyFieldCases) {
      test(`empty field validation shows ${loginCase.title} error`, async () => {
        await loginPage.loginWithCredentials(loginCase.username, loginCase.password);

        await expect(loginPage.errorMessage).toContainText(loginCase.expectedError);
      });
    }
  });
});
