# Playwright Reports, Traces, And Artifacts

## What A Test Report Should Answer

A useful test report answers more than "passed" or "failed."

For a failed UI test, the report should help answer:

- Which test failed?
- Which project/browser failed?
- What step was running?
- What assertion failed?
- What did the page look like?
- What network calls happened?
- Was there a console error?
- Can the failure be reproduced from the trace?

Module 06 configures Playwright so those answers are easier to find.

## HTML Report

`playwright.config.ts` writes the built-in HTML report here:

```ts
['html', { outputFolder: 'reports/playwright-html', open: 'never' }]
```

Open it after a run:

```bash
npm run report
```

The HTML report is the first report a beginner should learn because it connects test titles, steps, screenshots, traces, and errors in one UI.

## JSON Report

Module 06 also writes:

```ts
['json', { outputFile: 'reports/test-results/results.json' }]
```

JSON is useful for scripts or dashboards. A human can read it, but it is mostly for tools.

Example use cases:

- count failures by project
- compare duration over time
- feed results into a custom dashboard

## JUnit Report

Module 06 writes:

```ts
['junit', { outputFile: 'reports/test-results/junit.xml' }]
```

JUnit XML is a long-standing CI test result format. Many CI systems can display it natively or ingest it into test analytics tools.

## Screenshots, Videos, And Traces

The shared `use` config includes:

```ts
trace: 'on-first-retry',
screenshot: 'only-on-failure',
video: 'retain-on-failure',
```

What this means:

- screenshots are kept for failures
- videos are retained when a test fails
- traces are collected when a failed test is retried

This balances debugging value and artifact size. Keeping video and traces for every passing test would make reports heavy.

## Manual Attachments

`tests/reporting/artifact-capture.spec.ts` demonstrates explicit artifact capture:

```ts
const screenshotPath = testInfo.outputPath('module-06-report-artifact.png');
await page.screenshot({ path: screenshotPath, fullPage: true });
await testInfo.attach('module-06-report-artifact', {
  path: screenshotPath,
  contentType: 'image/png',
});
```

This is useful when a test needs a named artifact even when it passes, such as:

- a receipt page
- a generated chart
- a visual checkpoint used for review

Use manual screenshots sparingly. Most tests should rely on failure-only artifacts.

## Trace Viewer

When a trace exists, open it with:

```bash
npx playwright show-trace path/to/trace.zip
```

A trace can show:

- action timeline
- DOM snapshots before/after actions
- network requests
- console messages
- source line links

The trace is often better than guessing from the final screenshot because it shows how the page reached the failure.

## Code References

Read:

- `playwright.config.ts`
- `tests/reporting/artifact-capture.spec.ts`
- `package.json`
- `.gitignore`
