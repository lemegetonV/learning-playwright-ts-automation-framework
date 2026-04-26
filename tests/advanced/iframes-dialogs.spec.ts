import { expect, test } from '@playwright/test';

test.describe('Iframes and dialogs', () => {
  test('interact with content inside an iframe', async ({ page }) => {
    await page.setContent(`
      <h1>Host page</h1>
      <iframe
        id="editor-frame"
        srcdoc="<label for='editor'>Editor</label><textarea id='editor'></textarea><p id='preview'></p><script>document.querySelector('#editor').addEventListener('input', event => { document.querySelector('#preview').textContent = event.target.value; });</script>"
      ></iframe>
    `);

    const editorFrame = page.frameLocator('#editor-frame');
    const editor = editorFrame.locator('#editor');

    await editor.fill('Hello from Module 05');

    await expect(editorFrame.locator('#preview')).toHaveText('Hello from Module 05');
    await expect(page.getByRole('heading', { name: 'Host page' })).toBeVisible();
  });

  test('accept an alert dialog', async ({ page }) => {
    await page.setContent(`
      <button id="alert-button">Show alert</button>
      <p id="result"></p>
      <script>
        document.querySelector('#alert-button').addEventListener('click', () => {
          alert('Module 05 alert');
          document.querySelector('#result').textContent = 'Alert handled';
        });
      </script>
    `);

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('Module 05 alert');
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Show alert' }).click();

    await expect(page.locator('#result')).toHaveText('Alert handled');
  });

  test('accept a prompt dialog with custom text', async ({ page }) => {
    await page.setContent(`
      <button id="prompt-button">Show prompt</button>
      <p id="result"></p>
      <script>
        document.querySelector('#prompt-button').addEventListener('click', () => {
          const value = prompt('Enter module text', '');
          document.querySelector('#result').textContent = value;
        });
      </script>
    `);

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept('Module 05 prompt value');
    });

    await page.getByRole('button', { name: 'Show prompt' }).click();

    await expect(page.locator('#result')).toHaveText('Module 05 prompt value');
  });
});
