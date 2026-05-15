# Playwright Configuration Deep Dive

## Why [playwright.config.ts](../../playwright.config.ts) Is The Framework's Control Panel

Specs describe test behavior. [playwright.config.ts](../../playwright.config.ts) describes how the test runner should execute that behavior.

It answers questions such as:

- Where are the tests?
- Which browsers should run?
- How long should actions and assertions wait?
- What should happen in CI?
- Where should reports and artifacts be written?
- What is the base URL?

The config is code, not JSON, so it can use TypeScript imports, environment variables, and conditional logic.

## `defineConfig`

```ts
import { defineConfig, devices } from '@playwright/test';
```

`defineConfig` gives editor support and type checking for config options.

`devices` provides predefined browser/device settings such as Desktop Chrome or Pixel 5.

## Test Directory

```ts
testDir: './tests',
```

This tells Playwright where to discover specs. The repo uses `tests/` from Module 01 onward.

Future modules organize tests by domain:

- [tests/ui/auth](../../tests/ui/auth)
- [tests/ui/products](../../tests/ui/products)
- [tests/ui/cart](../../tests/ui/cart)
- [tests/ui/checkout](../../tests/ui/checkout)
- [tests/api](../../tests/api)

## Parallelism

```ts
fullyParallel: true,
workers: process.env.CI ? 1 : undefined,
```

`fullyParallel: true` allows tests to run independently and quickly. This is a professional default only when tests are isolated.

`workers` uses one worker in CI to reduce resource pressure. Locally, `undefined` lets Playwright choose a sensible default.

The learning point: parallel execution rewards clean tests and punishes hidden state sharing.

## CI Protection

```ts
forbidOnly: !!process.env.CI,
retries: process.env.CI ? 2 : 0,
```

`forbidOnly` prevents accidentally committing `test.only` and running just one test in CI.

Retries are enabled in CI but not locally:

- local failures should be visible immediately
- CI may hit occasional network or infrastructure noise

Retries do not fix bad tests. They are a safety net, not a design strategy.

## Timeouts

```ts
timeout: 30_000,
expect: {
  timeout: 5_000,
},
```

`timeout` is the maximum duration for one test.

`expect.timeout` is how long Playwright assertions retry before failing.

Action and navigation timeouts are configured under `use`:

```ts
actionTimeout: 10_000,
navigationTimeout: 30_000,
```

These values make failures bounded. A broken selector should fail clearly, not hang indefinitely.

## Reports And Artifacts

```ts
outputDir: 'reports/test-artifacts',
reporter: [
  ['list'],
  ['html', { outputFolder: 'reports/playwright-html', open: 'never' }],
],
```

`list` gives readable terminal output.

HTML report is useful after local or CI runs. It is stored under `reports/`, which is ignored by Git because reports are generated artifacts.

Module 06 expands reporting further. Module 02 only creates the stable location.

## `baseURL`

```ts
const baseURL = process.env.BASE_URL ?? 'https://www.saucedemo.com';
```

The `baseURL` lets tests write:

```ts
await page.goto('/');
```

instead of repeating the full URL.

The environment variable allows the same test code to point to a different environment later:

```bash
BASE_URL=https://staging.example.com npm test
```

For SauceDemo learning, the fallback is the public demo site.

## Browser Projects

```ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
],
```

A project is a named execution environment. The same spec can run against multiple browsers.

This is more maintainable than duplicating tests for each browser.

## Why Module 02 Adds Multiple Browsers

Module 01 ran only Chromium to keep the first feedback loop fast. Module 02 introduces cross-browser awareness because a real UI framework should reveal browser-specific issues.

The default `npm test` now runs all configured projects. Browser-specific scripts allow focused runs:

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:mobile
```

## Key Takeaways

- Config is the runner's control panel.
- Keep test behavior in specs and execution policy in config.
- Environment-based config makes the framework portable.
- Reports and artifacts need stable ignored folders.
- Browser projects scale coverage without duplicating specs.
