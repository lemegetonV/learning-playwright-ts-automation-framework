# Module 01 Exercises

These exercises reinforce the code that exists at the Module 01 checkpoint. They should make you read, run, and extend the current files rather than jump ahead into page objects or fixtures.

## Exercise 1: Explain The First Learning Spec

Open [tests/learning/first-run.spec.ts](../../tests/learning/first-run.spec.ts).

Write a short note explaining:

- what `import { test, expect } from '@playwright/test'` provides
- what `async ({ page }) =>` means
- why `await page.goto('/')` works with the configured `baseURL`
- what the assertion proves

Hint: Use [03-async-await-and-playwright-flow.md](./03-async-await-and-playwright-flow.md) and [05-core-playwright-primitives.md](./05-core-playwright-primitives.md).

## Exercise 2: Strengthen The Successful Login Test

Open [tests/ui/auth/login.spec.ts](../../tests/ui/auth/login.spec.ts).

Add one extra assertion to the successful login test that proves the inventory page is usable, not only loaded.

Examples of valid directions:

- assert the shopping cart link is visible
- assert at least one known product name is visible
- assert the product sort dropdown is visible

Hint: Prefer a user-visible locator such as role or text if it is readable. Use a stable `data-test` selector if the UI text is not enough.

## Exercise 3: Extend The Existing Negative Login Coverage

Do not write the same invalid-password test again.

Instead, add a different negative case, such as:

- blank username with a password
- username with blank password
- unknown username with the standard password

Assert the error message that the user sees.

Hint: First run the test in headed mode or inspect SauceDemo manually to learn the exact message.

## Exercise 4: Identify Missing `await`

Temporarily remove `await` from one action in the login test and run the spec.

Then restore the `await`.

Write down:

- whether the test failed consistently or intermittently
- which line raced ahead
- why fixed sleeps are not the right fix

Hint: This is a learning experiment. Do not commit the broken version.

## Exercise 5: Practice TypeScript Object Shapes

In a scratch file or notes, define this type:

```ts
type LoginCase = {
  title: string;
  username: string;
  password: string;
  expectedError?: string;
};
```

Create two objects:

- one successful login case without `expectedError`
- one failed login case with `expectedError`

Then intentionally misspell `username` as `userName` and observe the TypeScript error.

Hint: This prepares you for Module 02 reusable test data and Module 04 data-driven tests.
