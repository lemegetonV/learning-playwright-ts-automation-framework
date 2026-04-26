# Module 04 Exercises

These exercises extend the Module 04 code. They do not ask you to add the first smoke tag or recreate existing data-driven tests.

## Exercise 1: Add One Invalid Login Case

Open `tests/ui/auth/login-data-driven.spec.ts`.

Add a new case for a username that does not exist.

Hint: Keep the generated test title specific enough to identify the case.

## Exercise 2: Add One Product Data Row

Open `test-data/saucedemo-products.json`.

Add another SauceDemo product and expected price, then run `tests/ui/products/products-data.spec.ts`.

Hint: Use the product names defined in `src/types/products.ts`.

## Exercise 3: Inspect Smoke Selection

Run:

```bash
npm run test:smoke
```

Write down which tests were selected and explain why those tests are good smoke candidates.

Hint: Smoke tests should cover critical paths without trying to be exhaustive.

## Exercise 4: Add A `test.step`

Choose one test in `tests/ui/cart/cart.spec.ts` and wrap its arrange, act, and assert phases in `test.step`.

Hint: Step names should explain behavior, not just implementation clicks.

## Exercise 5: Add One API Assertion

Open `tests/api/jsonplaceholder.spec.ts`.

Add an assertion that every post returned by `GET /posts?userId=1` has a non-empty title.

Hint: Keep the existing `for...of` loop and add one more expectation inside it.
