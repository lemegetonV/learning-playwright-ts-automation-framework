# Data-Driven Tests

## What Data-Driven Testing Solves

When the same behavior must be checked with multiple inputs, copying whole tests creates noise.

Data-driven testing separates:

- the behavior template
- the input data
- the expected result

## Inline Data

`tests/ui/auth/login-data-driven.spec.ts` uses inline cases:

```ts
const invalidLoginCases = [
  {
    title: 'missing username',
    username: '',
    password: SauceDemoUsers.standard.password,
    expectedError: 'Epic sadface: Username is required',
  },
];
```

Each case generates a test:

```ts
for (const loginCase of invalidLoginCases) {
  test(`shows an error for ${loginCase.title}`, async ({ page }) => {
    // ...
  });
}
```

This keeps each input visible while avoiding repeated test bodies.

## JSON Data

`test-data/saucedemo-products.json` stores product expectations:

```json
[
  {
    "name": "Sauce Labs Backpack",
    "price": "$29.99",
    "expectedInCart": true
  }
]
```

`tests/ui/products/products-data.spec.ts` imports the JSON and validates product prices/add-to-cart behavior.

Use JSON when data is:

- larger than a few cases
- useful across multiple specs
- easier to review as a data table than TypeScript code

Use inline data when the data is small and tightly coupled to one spec.

## Type Safety With JSON

JSON imports are runtime data. TypeScript can be helped with an explicit type:

```ts
type ProductCase = {
  readonly name: SauceDemoProductName;
  readonly price: string;
  readonly expectedInCart: boolean;
};

const productCases = products as ProductCase[];
```

This makes the spec clearer, but remember that TypeScript does not deeply validate external JSON at runtime. Real production frameworks may add schema validation later.

## Good Data-Driven Test Titles

Good:

```ts
test(`shows an error for ${loginCase.title}`, async ({ page }) => {
  // ...
});
```

Weak:

```ts
test('invalid login', async ({ page }) => {
  // ...
});
```

When generated tests fail, the title should identify the data case.

## Code References

Read:

- `tests/ui/auth/login-data-driven.spec.ts`
- `tests/ui/products/products-data.spec.ts`
- `test-data/saucedemo-products.json`
