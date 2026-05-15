# Module 06 Exercises

These exercises extend the Module 06 reporting and CI/CD implementation.

## Exercise 1: Inspect The HTML Report

Run:

```bash
npm run test:reporting
npm run report
```

Open the reporting test and identify:

- test title
- project name
- attached screenshot
- test annotations

Hint: The reporting test lives in [tests/reporting/artifact-capture.spec.ts](../../tests/reporting/artifact-capture.spec.ts).

## Exercise 2: Generate Allure Locally

Run:

```bash
npm run test:allure
npm run allure:generate
```

Then inspect the generated files under [reports/allure-report](../../reports/allure-report).

Hint: Generated report folders are intentionally ignored by Git.

## Exercise 3: Read The GitHub Actions Workflow

Open [.github/workflows/playwright.yml](../../.github/workflows/playwright.yml).

Write down what each step does and why `if: always()` is used for artifact upload.

Hint: A failed test run should still upload reports.

## Exercise 4: Audit CI Artifact Paths

Compare the artifact paths in [.github/workflows/playwright.yml](../../.github/workflows/playwright.yml) with the generated output configured in [playwright.config.ts](../../playwright.config.ts) and ignored in [.gitignore](../../.gitignore).

Write down which report folders are already covered. If you add another artifact path, choose a folder that this module already generates under `reports/` and explain why it belongs in CI output.

Hint: Artifact paths should preserve evidence from the current framework, not placeholders for future reports.

## Exercise 5: Add A Custom Reporter Field

Extend [reporters/console-summary-reporter.ts](../../reporters/console-summary-reporter.ts) to include the project name when a test ends.

Hint: Inspect the `test` object and keep the output concise.
