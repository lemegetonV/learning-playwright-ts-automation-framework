# Implementing SauceDemo Page Objects

## The Pages We Model

Module 03 models the SauceDemo flow used by the current tests:

```mermaid
flowchart LR
  A["LoginPage"] --> B["ProductsPage"]
  B --> C["CartPage"]
  C --> D["CheckoutPage"]
```

Each class owns one page or page-like area of the app.

## `BasePage`

`src/page-objects/BasePage.ts` stores shared page access and navigation helpers.

```ts
export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }
}
```

The class is abstract because tests should not create a generic `BasePage`. They create a specific page object such as `LoginPage`.

## `LoginPage`

`LoginPage` owns:

- username input
- password input
- login button
- error message
- error close button

Important methods:

```ts
async goto(): Promise<void> {
  await super.goto('/');
}

async login(user: TestUser): Promise<void> {
  await this.loginWithCredentials(user.username, user.password);
}
```

`login(user)` accepts the typed user from Module 02. This shows modules building on each other: Module 03 does not invent a second credential shape.

`clearError()` exists because SauceDemo lets users close login errors. Module 03 includes a test that exercises it so the page object method is visible and verified.

## `ProductsPage`

`ProductsPage` owns:

- product title
- product cards
- shopping cart link
- shopping cart badge
- sort dropdown

Product actions are scoped to a matching card:

```ts
private productCard(productName: SauceDemoProductName): Locator {
  return this.inventoryItems.filter({ hasText: productName });
}
```

This is safer than selecting the first "Add to cart" button on the page.

## Product Types

`src/types/products.ts` defines known product names and sort options.

```ts
export type SauceDemoProductName =
  | 'Sauce Labs Backpack'
  | 'Sauce Labs Bike Light'
  | 'Sauce Labs Bolt T-Shirt'
  | 'Sauce Labs Fleece Jacket'
  | 'Sauce Labs Onesie'
  | 'Test.allTheThings() T-Shirt (Red)';
```

This catches typos such as:

```ts
await productsPage.addProductToCart('Sauce Labs Backpak'); // typo
```

## `CartPage`

`CartPage` owns:

- cart title
- cart items
- checkout button
- continue shopping button

It also exposes item-level helpers:

```ts
async getItemNames(): Promise<string[]> {
  return this.cartItems.locator('.inventory_item_name').allTextContents();
}
```

The cart page object does not decide what products should be in the cart. The spec decides that. The page object only knows how to read cart state.

## `CheckoutPage`

`CheckoutPage` owns:

- customer information inputs
- continue and finish buttons
- validation error
- completion header

The customer data shape lives in `src/types/checkout.ts`:

```ts
export interface CheckoutCustomer {
  readonly firstName: string;
  readonly lastName: string;
  readonly postalCode: string;
}
```

This keeps checkout form data explicit and reusable.

## Spec Correlation

| Spec | Page Objects Used | Behavior |
|---|---|---|
| `tests/ui/auth/login.spec.ts` | `LoginPage`, `ProductsPage` | login success, invalid credentials, locked user, clear error |
| `tests/ui/products/products.spec.ts` | `LoginPage`, `ProductsPage` | product list, add/remove, sort |
| `tests/ui/cart/cart.spec.ts` | `LoginPage`, `ProductsPage`, `CartPage` | cart item persistence and removal |
| `tests/ui/checkout/checkout.spec.ts` | all page objects | checkout validation and successful checkout |

## Key Takeaways

- Each page object has a clear ownership boundary.
- Page objects use types from `src/types/` rather than untyped strings everywhere.
- Specs become shorter because UI mechanics move into classes.
- The Base Page pattern is present but intentionally small.
