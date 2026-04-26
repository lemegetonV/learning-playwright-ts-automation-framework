import { expect, test } from '@playwright/test';

test('login form is visible on the SauceDemo landing page', async ({ page }) => {
  const loginPageTitle: string = 'Swag Labs';
  const loginButtonLabel: string = 'Login';

  await page.goto('/');

  await expect(page).toHaveTitle(loginPageTitle);
  await expect(page.getByPlaceholder('Username')).toBeVisible();
  await expect(page.getByPlaceholder('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: loginButtonLabel })).toBeVisible();
});
