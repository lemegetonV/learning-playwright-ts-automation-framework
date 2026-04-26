# File, Iframe, And Dialog Handling

## Why These Behaviors Need Special APIs

Some browser behaviors are not normal clicks and text assertions:

- file inputs interact with the local filesystem
- iframe content lives in a nested browsing context
- dialogs block page execution until accepted or dismissed

Playwright has dedicated APIs for each.

## File Uploads

`tests/advanced/file-handling.spec.ts` demonstrates a real file upload:

```ts
const uploadFilePath = path.join(process.cwd(), 'test-data', 'upload-sample.txt');
await page.locator('#upload').setInputFiles(uploadFilePath);
```

`setInputFiles` bypasses the operating system file picker and assigns the file directly to the input.

This is more reliable than trying to automate the native file picker, which is outside the browser DOM.

## In-Memory Files

The same spec also creates a file in memory:

```ts
await page.locator('#upload').setInputFiles({
  name: 'dynamic-module-05.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('Created by a Module 05 Playwright test.'),
});
```

Use this when the file contents are small and specific to the test.

Use a real file when the file is part of test data, such as a fixture document or image.

## Downloads

Downloads are event-based:

```ts
const downloadPromise = page.waitForEvent('download');
await page.getByRole('link', { name: 'Download sample' }).click();
const download = await downloadPromise;
```

The promise must be created before the click. Otherwise the download event may happen before the test starts waiting.

## Iframes

An iframe is a page inside a page. Normal page locators cannot directly see inside it.

Module 05 uses:

```ts
const editorFrame = page.frameLocator('#editor-frame');
const editor = editorFrame.locator('#editor');
```

`frameLocator` scopes future locators to that iframe.

## Dialogs

Dialogs must be handled before or during the action that triggers them:

```ts
page.once('dialog', async (dialog) => {
  expect(dialog.type()).toBe('alert');
  await dialog.accept();
});

await page.getByRole('button', { name: 'Show alert' }).click();
```

If the test clicks first and only then tries to register the handler, the dialog may already be blocking execution.

## Why Local HTML Is Used

The advanced specs use `page.setContent(...)` instead of a third-party practice site. This keeps the examples deterministic:

- no external site availability risk
- no unwanted UI changes
- the test focuses on the Playwright feature itself

This is acceptable for feature-learning tests. SauceDemo remains the main application target for framework workflows.

## Code References

Read:

- `tests/advanced/file-handling.spec.ts`
- `tests/advanced/iframes-dialogs.spec.ts`
- `test-data/upload-sample.txt`
