# Test Structure, Hooks, And Assertions

## AAA Pattern

AAA means:

- Arrange: prepare state
- Act: perform the behavior
- Assert: verify the outcome

In a Playwright test:

```ts
test('standard user can log in and reach the inventory page @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);

  await test.step('Arrange: open the login page', async () => {
    await loginPage.goto();
  });

  await test.step('Act: log in as the standard user', async () => {
    await loginPage.login(SauceDemoUsers.standard);
  });

  await test.step('Assert: inventory page is shown', async () => {
    await expect(page).toHaveURL(/inventory.html/);
    await expect(productsPage.title).toHaveText('Products');
  });
});
```

`test.step` does not change the browser. It changes reporting and readability. When the test fails, the report shows which conceptual step failed.

## Hooks

Hooks reduce repeated setup.

```ts
test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.goto();
});
```

Use hooks for setup that every test in the `describe` block needs.

Avoid putting unique test behavior in hooks. If only one test needs an action, keep it inside that test so the test remains readable.

## Assertions

Assertions should prove user-visible outcomes or meaningful state.

Good:

```ts
await expect(productsPage.title).toHaveText('Products');
await expect(productsPage.shoppingCartBadge).toHaveText('1');
```

Weak:

```ts
expect(true).toBeTruthy();
```

The second assertion proves nothing about the application.

## Web-First Assertions

Playwright web-first assertions retry until timeout:

```ts
await expect(productsPage.title).toHaveText('Products');
```

This is better than:

```ts
await page.waitForTimeout(3000);
expect(await productsPage.title.textContent()).toBe('Products');
```

The first waits for the actual condition. The second waits blindly.

## Tags

Tags are text labels inside test titles:

```ts
test('standard user can log in and reach the inventory page @smoke', async ({ page }) => {
  // ...
});
```

Run smoke tests:

```bash
npm run test:smoke
```

Use tags sparingly. A tag should mean something operational, such as "this is a small critical subset."

## Code References

Module 04 examples are implemented in:

- `tests/ui/auth/login.spec.ts`
- `tests/ui/products/products.spec.ts`

Read those files beside this doc. The goal is not just to see that tests pass, but to notice how setup, action, and assertion are separated.
