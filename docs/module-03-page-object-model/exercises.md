# Module 03 Exercises

These exercises extend the implemented page objects. They do not ask you to recreate work that already exists at the Module 03 checkpoint.

## Exercise 1: Add Another Product Assertion

Extend [tests/ui/products/products.spec.ts](../../tests/ui/products/products.spec.ts) to assert the price for a different product.

Hint: Use `productsPage.getProductPrice(productName)` and choose a product from `SauceDemoProductName`.

## Exercise 2: Add Z-A Sort Coverage

Add a test that sorts products by `ProductSortOption.NameZToA` and verifies the first product name.

Hint: Use `productsPage.sortBy(...)` and `productsPage.getProductNames()`.

## Exercise 3: Assert Cart Item Details

Extend the cart spec to read `cartPage.getItemDetails(productName)` and assert the quantity is `1`.

Hint: This uses an existing Module 03 helper and makes the cart page object more visible.

## Exercise 4: Add A Missing Checkout Validation Case

Add a checkout validation test for a missing last name or missing postal code.

Hint: Reuse `checkoutPage.fillCustomerInformation(...)`, but pass a deliberately incomplete value for the field you are testing.

## Exercise 5: Compare Locator Choices

Pick one locator from a page object and write two alternatives:

- a user-facing locator
- a CSS or XPath locator

Then explain which one you would keep and why.

Hint: This is a reasoning exercise. Do not change the code unless the alternative is clearly better.
