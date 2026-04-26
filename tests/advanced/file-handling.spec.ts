import { expect, test } from '@playwright/test';
import path from 'path';

test.describe('File handling', () => {
  test('upload a local file through a file input', async ({ page }) => {
    await page.setContent(`
      <label for="upload">Upload file</label>
      <input id="upload" type="file" />
      <p id="file-name"></p>
      <script>
        document.querySelector('#upload').addEventListener('change', (event) => {
          document.querySelector('#file-name').textContent = event.target.files[0]?.name ?? '';
        });
      </script>
    `);

    const uploadFilePath = path.join(process.cwd(), 'test-data', 'upload-sample.txt');

    await page.locator('#upload').setInputFiles(uploadFilePath);

    await expect(page.locator('#file-name')).toHaveText('upload-sample.txt');
  });

  test('upload an in-memory file', async ({ page }) => {
    await page.setContent(`
      <input id="upload" type="file" />
      <p id="file-name"></p>
      <script>
        document.querySelector('#upload').addEventListener('change', (event) => {
          document.querySelector('#file-name').textContent = event.target.files[0]?.name ?? '';
        });
      </script>
    `);

    await page.locator('#upload').setInputFiles({
      name: 'dynamic-module-05.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Created by a Module 05 Playwright test.'),
    });

    await expect(page.locator('#file-name')).toHaveText('dynamic-module-05.txt');
  });

  test('download generated content and inspect the filename', async ({ page }) => {
    await page.setContent(`
      <a download="module-05-download.txt"
         href="data:text/plain,downloaded%20from%20module%2005">
        Download sample
      </a>
    `);

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('link', { name: 'Download sample' }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('module-05-download.txt');

    const downloadPath = path.join(test.info().outputDir, download.suggestedFilename());
    await download.saveAs(downloadPath);
    expect(downloadPath).toContain('module-05-download.txt');
  });
});
