import { expect, test } from '@playwright/test';

test.describe('Module 06 reporting artifacts @reporting', () => {
  test('attaches a named screenshot for report review', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      {
        type: 'description',
        description: 'Demonstrates manual artifact attachment for the Module 06 reporting lesson.',
      },
      {
        type: 'severity',
        description: 'normal',
      },
      {
        type: 'tag',
        description: '@reporting',
      },
    );

    await page.setContent(`
      <main style="font-family: Arial, sans-serif; padding: 24px;">
        <h1>Module 06 report artifact</h1>
        <p>This page exists only to demonstrate screenshot attachments in Playwright reports.</p>
      </main>
    `);

    await expect(page.getByRole('heading', { name: 'Module 06 report artifact' })).toBeVisible();

    const screenshotPath = testInfo.outputPath('module-06-report-artifact.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    await testInfo.attach('module-06-report-artifact', {
      path: screenshotPath,
      contentType: 'image/png',
    });
  });
});
