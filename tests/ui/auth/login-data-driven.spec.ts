import { expect, test } from '@playwright/test';

import { LoginPage } from '../../../src/page-objects/LoginPage';
import { SauceDemoUsers } from '../../../src/utils/test-users';

const invalidLoginCases = [
  {
    title: 'missing username',
    username: '',
    password: SauceDemoUsers.standard.password,
    expectedError: 'Epic sadface: Username is required',
  },
  {
    title: 'missing password',
    username: SauceDemoUsers.standard.username,
    password: '',
    expectedError: 'Epic sadface: Password is required',
  },
  {
    title: 'locked user',
    username: SauceDemoUsers.locked.username,
    password: SauceDemoUsers.locked.password,
    expectedError: 'Epic sadface: Sorry, this user has been locked out.',
  },
];

test.describe('SauceDemo data-driven login validation', () => {
  for (const loginCase of invalidLoginCases) {
    test(`shows an error for ${loginCase.title}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.loginWithCredentials(loginCase.username, loginCase.password);

      await expect(loginPage.errorMessage).toContainText(loginCase.expectedError);
    });
  }
});
