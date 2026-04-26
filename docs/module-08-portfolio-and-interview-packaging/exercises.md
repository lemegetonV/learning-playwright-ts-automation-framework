# Module 08 Exercises

These exercises reinforce packaging and review. They do not ask you to create standalone portfolio or interview materials.

## Exercise 1: README Traceability Audit

Pick five claims from `README.md`.

For each claim, identify the file that proves it.

Examples:

- a test command should map to `package.json`
- a report path should map to `playwright.config.ts`
- a page object claim should map to `src/page-objects/`
- a CI claim should map to `.github/workflows/playwright.yml`

Hint: If you cannot trace a claim to a file, the claim may be too vague.

## Exercise 2: Clean Report Run

Generate a fresh report from a clean state.

```bash
rm -rf reports/allure-results reports/allure-report reports/playwright-html reports/test-results reports/test-artifacts
npm run test:reporting:allure
npm run allure:generate
npm run allure:open
```

Then answer:

- which folder contains raw Allure result files?
- which folder contains the generated Allure HTML report?
- why should neither folder be committed?

Hint: Compare the generated folders with `.gitignore`.

## Exercise 3: Capstone Command Review

Run the capstone API suite:

```bash
npm run test:capstone:api
```

Then open `tests/api/capstone/capstone-api.spec.ts` and identify:

- which tests represent authentication behavior
- which tests represent product behavior
- which tests represent cart behavior
- which tests represent user data behavior

Hint: The API-style tests are deterministic learning examples. They do not call a real SauceDemo API.

## Exercise 4: GitHub Metadata Draft

Draft a repository description and ten GitHub topics for this project.

Use `docs/module-08-portfolio-and-interview-packaging/02-github-and-report-packaging.md` as your guide.

Constraint: The description must be truthful to this repository. Do not claim production usage, real business impact, or features that are not implemented.

## Exercise 5: Final Branch Check

Before Module 08 is marked complete, inspect the module chain:

```bash
git log --oneline --decorate --graph --all -12
git tag --list 'module-*' --sort=version:refname
```

Answer:

- where does `main` point?
- which module tag is the latest?
- which branch contains the current Module 08 work?

Hint: Until Module 08 is complete, `main` should still point to `module-07-complete`.
