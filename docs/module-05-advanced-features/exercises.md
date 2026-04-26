# Module 05 Exercises

These exercises extend the Module 05 advanced examples.

## Exercise 1: Add A Fixture For A Single Product

Add a fixture that logs in, adds only `Sauce Labs Backpack`, and provides `CartPage`.

Hint: Model it after `cartWithProducts`, but keep the setup smaller.

## Exercise 2: Add An Authenticated Cart Test

Create an authenticated test that uses saved auth state, opens the cart page, and verifies the cart title.

Hint: Put it under `tests/ui/authenticated/` so the `authenticated-chromium` project picks it up.

## Exercise 3: Add A Download Content Check

Extend the download test to read the saved file and assert its text.

Hint: Use Node's filesystem APIs. Keep the file inside `test.info().outputDir`.

## Exercise 4: Dismiss A Confirm Dialog

Add a dialog test for `confirm(...)` where the dialog is dismissed and the page shows a "Cancelled" result.

Hint: Register `page.once('dialog', ...)` before clicking.

## Exercise 5: Mock An Error Response

Add a network test that fulfills a route with HTTP 500 and verifies the page code displays an error state.

Hint: Keep the HTML inline with `page.setContent(...)` so the test remains deterministic.
