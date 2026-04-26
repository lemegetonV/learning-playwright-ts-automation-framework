# Core Playwright Primitives

## The Small Vocabulary Behind Most Tests

Most beginner Playwright specs are built from a small vocabulary:

- `test` defines a test case
- `expect` defines an assertion
- `page` represents a browser tab
- locators describe elements
- actions interact with elements
- assertions verify outcomes

```ts
import { test, expect } from '@playwright/test';

test('opens the SauceDemo login page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Swag Labs/);
});
```

## `test`

`test` registers a scenario with the Playwright runner.

```ts
test('opens the SauceDemo login page', async ({ page }) => {
  await page.goto('/');
});
```

The first argument is the test title. A good title describes behavior, not implementation.

Better:

```ts
test('shows an error when the password is invalid', async ({ page }) => {
  // ...
});
```

Weaker:

```ts
test('test login button', async ({ page }) => {
  // ...
});
```

## `page`

`page` is Playwright's object for one browser tab.

Common methods:

```ts
await page.goto('/');
await page.getByPlaceholder('Username').fill('standard_user');
await page.getByRole('button', { name: 'Login' }).click();
```

Every test receives a fresh isolated `page` by default. That isolation helps prevent one test from leaking cookies, local storage, or page state into another test.

## Locators

A locator is a way to describe an element. It is not the element itself.

```ts
const usernameInput = page.getByPlaceholder('Username');
```

The locator is evaluated when an action or assertion uses it:

```ts
await usernameInput.fill('standard_user');
await expect(usernameInput).toBeVisible();
```

This lazy behavior is useful because modern pages change over time.

## Locator Strategy

Prefer locators that describe the page the way a user or accessibility tree understands it.

Recommended:

```ts
page.getByRole('button', { name: 'Login' });
page.getByPlaceholder('Username');
page.getByText('Products');
```

Use CSS selectors when the page has stable attributes:

```ts
page.locator('[data-test="error"]');
```

Avoid XPath in this project unless there is a strong reason. XPath can be useful in some legacy applications, but it is often more brittle and less readable than role, label, text, placeholder, or stable test-id selectors.

SauceDemo exposes useful `data-test` attributes, so later modules use them where they make selectors clearer.

## Actions

Actions simulate user behavior.

```ts
await page.getByPlaceholder('Username').fill('standard_user');
await page.getByPlaceholder('Password').fill('secret_sauce');
await page.getByRole('button', { name: 'Login' }).click();
```

Common actions:

- `fill()` for input fields
- `click()` for buttons, links, and controls
- `selectOption()` for dropdowns
- `check()` and `uncheck()` for checkboxes
- `press()` for keyboard input

Actions should normally be awaited.

## Assertions

Assertions define what must be true.

```ts
await expect(page).toHaveURL(/inventory.html/);
await expect(page.getByText('Products')).toBeVisible();
await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
```

Assertions are the reason the test exists. Without assertions, a test may perform actions but not verify behavior.

## Page Assertions vs Locator Assertions

Page-level assertion:

```ts
await expect(page).toHaveURL(/inventory.html/);
```

Locator-level assertion:

```ts
await expect(page.getByText('Products')).toBeVisible();
```

Use both when they verify different things. A URL check proves navigation happened. A visible text check proves the user sees the expected page content.

## Regex In Assertions

This assertion uses a regular expression:

```ts
await expect(page).toHaveURL(/inventory.html/);
```

The slashes create a pattern. The assertion passes if the current URL contains a matching value. This is more flexible than requiring the exact full URL.

Exact string:

```ts
await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
```

Regex:

```ts
await expect(page).toHaveURL(/inventory.html/);
```

Module 01 uses regex for URL checks because it keeps the assertion focused on the important part of the URL.

## How A Login Step Reads

```ts
await page.getByPlaceholder('Username').fill('standard_user');
```

Read it left to right:

1. `page` is the browser tab
2. `getByPlaceholder('Username')` finds the username field by placeholder
3. `fill('standard_user')` types the username
4. `await` waits for the operation to finish

This is the habit to build: read chains as a sequence of small ideas, not as one intimidating line.

## Key Takeaways

- `test` defines a scenario.
- `page` is the browser tab.
- locators describe elements lazily.
- actions change the page.
- assertions verify outcomes and retry until timeout.
- prefer user-facing and stable locators over fragile structure-based selectors.
