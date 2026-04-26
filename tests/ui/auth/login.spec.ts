import { expect, test } from '@playwright/test';

import { SauceDemoUsers } from '../../../src/utils/test-users';

test.describe('SauceDemo login', () => {
  test('standard user can log in and reach the inventory page', async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('Username').fill(SauceDemoUsers.standard.username);
    await page.getByPlaceholder('Password').fill(SauceDemoUsers.standard.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
  });

  test('user sees an error message when the password is invalid', async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('Username').fill(SauceDemoUsers.standard.username);
    await page.getByPlaceholder('Password').fill('incorrect_password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match any user in this service',
    );
  });
});
