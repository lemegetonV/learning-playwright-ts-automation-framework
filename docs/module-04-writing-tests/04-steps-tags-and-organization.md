# Steps, Tags, And Test Organization

## Why Organization Matters

As the suite grows, a passing/failing list is not enough. Tests need to be searchable, grouped, and understandable from reports.

Module 04 uses three lightweight organization tools:

- `test.describe`
- `test.step`
- title tags such as `@smoke` and `@api`

## `test.describe`

Use `describe` for related behavior:

```ts
test.describe('SauceDemo products', () => {
  // product tests
});
```

The name appears in output and reports, so it should describe the feature or behavior area.

## `test.step`

Use steps when a test has meaningful phases:

```ts
await test.step('Act: add product to cart', async () => {
  await productsPage.addProductToCart('Sauce Labs Backpack');
});
```

Good step names explain intent. Avoid steps like "click button" unless the button click itself is the behavior under test.

## Tags

Tags are filtered with grep:

```bash
playwright test --grep @smoke
```

Module 04 adds:

```json
"test:smoke": "playwright test --grep @smoke"
```

Only tests with `@smoke` in the title are selected.

## Folder Organization

The current layout is:

```text
tests/
  api/
  learning/
  ui/
    auth/
    cart/
    checkout/
    products/
```

This keeps tests grouped by layer and feature area.

## Code Reference Expectations

When a doc mentions code, it should point to code that exists in the same module checkpoint.

Module 04 references:

- `tests/ui/auth/login.spec.ts`
- `tests/ui/auth/login-data-driven.spec.ts`
- `tests/ui/products/products.spec.ts`
- `tests/ui/products/products-data.spec.ts`
- `tests/api/jsonplaceholder.spec.ts`
- `test-data/saucedemo-products.json`

Future-module files are not referenced as if they already exist.
