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

Hint: The reporting test lives in `tests/reporting/artifact-capture.spec.ts`.

## Exercise 2: Generate Allure Locally

Run:

```bash
npm run test:allure
npm run allure:generate
```

Then inspect the generated files under `reports/allure-report`.

Hint: Generated report folders are intentionally ignored by Git.

## Exercise 3: Read The GitHub Actions Workflow

Open `.github/workflows/playwright.yml`.

Write down what each step does and why `if: always()` is used for artifact upload.

Hint: A failed test run should still upload reports.

## Exercise 4: Add A CI Artifact Path

Add one more artifact path to the workflow for a report folder you think might be useful later.

Hint: Keep it under `reports/` so `.gitignore` already handles local generated output.

## Exercise 5: Add A Custom Reporter Field

Extend `reporters/console-summary-reporter.ts` to include the project name when a test ends.

Hint: Inspect the `test` object and keep the output concise.
