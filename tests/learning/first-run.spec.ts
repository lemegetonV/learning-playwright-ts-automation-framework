import { expect, test } from '@playwright/test';

import { SauceDemoUsers } from '../../src/utils/test-users';

test('login form is visible on the SauceDemo landing page', async ({ page }) => {
  const loginPageTitle: string = 'Swag Labs';
  const standardUser = SauceDemoUsers.standard;
  const loginButtonLabel: string = 'Login';

  await page.goto('/');

  await expect(page).toHaveTitle(loginPageTitle);
  await expect(page.getByPlaceholder('Username')).toBeVisible();
  await expect(page.getByPlaceholder('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: loginButtonLabel })).toBeVisible();

  await page.getByPlaceholder('Username').fill(standardUser.username);
  await expect(page.getByPlaceholder('Username')).toHaveValue(standardUser.username);
});
