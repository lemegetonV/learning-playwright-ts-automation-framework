# Locator Strategy

## What A Locator Is

A locator is Playwright's description of how to find an element.

```ts
const loginButton = page.getByRole('button', { name: 'Login' });
```

The locator does not immediately fetch the element. It waits until an action or assertion needs it.

```ts
await loginButton.click();
await expect(loginButton).toBeVisible();
```

## Locator Priority

Use this priority order unless the app gives you a strong reason to do otherwise:

1. role-based locators: `getByRole`
2. label/placeholder/text locators: `getByLabel`, `getByPlaceholder`, `getByText`
3. test IDs or stable data attributes
4. focused CSS selectors
5. XPath only for legacy or hard-to-address structures

## Role Locators

```ts
page.getByRole('button', { name: 'Login' });
```

Role locators are strong because they align with accessibility and user meaning. If a button stops being a button, the test failure may reveal a real accessibility or UI regression.

## Placeholder And Text Locators

SauceDemo login fields are easy to read:

```ts
page.getByPlaceholder('Username');
page.getByPlaceholder('Password');
```

Product page title:

```ts
page.getByText('Products');
```

These are readable for beginners and describe what the user sees.

## Stable Data Attributes

SauceDemo exposes `data-test` attributes:

```ts
page.locator('[data-test="error"]');
page.locator('[data-test="checkout"]');
page.locator('[data-test="firstName"]');
```

These are good when the visible text is not the best locator or when the element has a test-specific stable hook.

## CSS Selectors

CSS selectors are useful but can become brittle if they depend on visual classes.

Good focused CSS:

```ts
page.locator('[data-test="shopping-cart-link"]');
```

Riskier CSS:

```ts
page.locator('.btn.btn_primary.btn_small');
```

Class-heavy selectors often reflect styling. Styling changes should not usually break behavior tests.

## Filtering Within A Component

`ProductsPage` uses a product-card locator:

```ts
private productCard(productName: SauceDemoProductName): Locator {
  return this.inventoryItems.filter({ hasText: productName });
}
```

Then actions are scoped:

```ts
await this.productCard(productName).getByRole('button', { name: 'Add to cart' }).click();
```

This avoids clicking the wrong "Add to cart" button when many product cards have similar controls.

## XPath

XPath is a locator language that can describe elements by XML/HTML structure.

Example:

```ts
page.locator('//button[text()="Login"]');
```

XPath is covered conceptually in Module 03 because many automation courses and legacy Selenium projects use it. This repo does not default to XPath because Playwright provides more readable and resilient user-facing locators.

XPath can be useful when:

- a legacy page has no accessible roles, labels, or stable attributes
- you need to traverse unusual document relationships
- you are migrating older Selenium selector knowledge

XPath is risky when:

- it depends on deep DOM position
- it is hard for beginners to read
- a small markup change breaks the path

Avoid this style:

```ts
page.locator('/html/body/div/div/div[2]/form/input[1]');
```

That locator describes document position, not user intent.

## Page Object Selector Rule

Selectors should usually live in page objects, not specs.

Specs should say:

```ts
await productsPage.addProductToCart('Sauce Labs Backpack');
```

Page objects can know:

```ts
this.inventoryItems = page.locator('.inventory_item');
```

The selector has one owner. If SauceDemo changes markup, the page object changes, not every spec.

## Key Takeaways

- Prefer locators that match user meaning.
- Use stable `data-test` selectors when user-facing locators are not enough.
- Scope repeated controls through parent/card locators.
- XPath is worth understanding, but it is not the default for this Playwright framework.
