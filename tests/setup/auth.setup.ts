import { test as setup } from '@playwright/test';

import { LoginPage } from '../../src/page-objects/LoginPage';
import { SauceDemoUsers } from '../../src/utils/test-users';

const standardUserAuthFile = 'playwright/.auth/standard-user.json';

setup('authenticate as standard SauceDemo user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(SauceDemoUsers.standard);
  await page.waitForURL(/inventory/);
  await page.context().storageState({ path: standardUserAuthFile });
});
