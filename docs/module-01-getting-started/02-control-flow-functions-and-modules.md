# Control Flow, Functions, And Modules

## Why This Matters

Once tests move beyond one or two lines, you need structure. Control flow lets code make decisions. Functions package repeated behavior. Modules let one file use code from another file.

In UI automation, these concepts appear everywhere:

- decide which assertion to run based on user type
- loop over products or test data rows
- create a helper that logs in
- import Playwright's `test` and `expect`
- later, import page object classes and typed test users

Module 01 keeps the implementation direct, but this file explains the language patterns you will see immediately.

## Conditionals

A conditional runs code only when a condition is true.

```ts
const username = 'locked_out_user';

if (username === 'locked_out_user') {
  console.log('Expect the locked-out error');
} else {
  console.log('Expect successful login');
}
```

Use strict equality, `===`, rather than loose equality, `==`.

```ts
1 === '1'; // false
1 == '1'; // true, because JavaScript converts types
```

In tests, silent conversion is usually a bad tradeoff. Automation should be explicit.

## Comparisons And Logical Operators

Common comparison operators:

```ts
const productCount = 6;

productCount === 6; // equal
productCount !== 0; // not equal
productCount > 0; // greater than
productCount <= 10; // less than or equal
```

Logical operators combine conditions:

```ts
const isLoggedIn = true;
const hasProducts = true;

if (isLoggedIn && hasProducts) {
  console.log('Inventory page is usable');
}
```

- `&&` means both conditions must be true
- `||` means at least one condition must be true
- `!` negates a condition

```ts
const hasError = false;

if (!hasError) {
  console.log('No login error shown');
}
```

## Loops

Loops repeat work.

```ts
const products = ['Backpack', 'Bike Light', 'Bolt T-Shirt'];

for (const product of products) {
  console.log(product);
}
```

The `for...of` loop is usually the clearest loop for arrays in tests.

Avoid hiding too much behavior inside loops too early. In a beginner test, three clear assertions may teach more than a clever loop. In data-driven tests later, loops and `test.describe` patterns become more useful.

## Functions

A function packages reusable behavior.

```ts
function buildLoginError(username: string): string {
  return `Expected login to fail for ${username}`;
}
```

Function parts:

- `buildLoginError` is the name
- `username: string` is a parameter and type
- `: string` after the parentheses is the return type
- `return` sends a value back to the caller

Call the function like this:

```ts
const message = buildLoginError('locked_out_user');
```

## Arrow Functions

Arrow functions are a compact function syntax.

```ts
const buildLoginError = (username: string): string => {
  return `Expected login to fail for ${username}`;
};
```

Playwright tests use arrow functions constantly:

```ts
test('opens the SauceDemo login page', async ({ page }) => {
  await page.goto('/');
});
```

That test callback is an arrow function. Playwright calls it and gives it fixtures such as `page`.

## Destructuring

This syntax:

```ts
async ({ page }) => {
  await page.goto('/');
}
```

means "take the `page` property out of the object Playwright passes in."

Without destructuring, it would look like this:

```ts
async (fixtures) => {
  await fixtures.page.goto('/');
}
```

Both ideas are the same. Destructuring is just cleaner.

## Imports And Exports

Modules let files share code.

This imports `test` and `expect` from Playwright:

```ts
import { test, expect } from '@playwright/test';
```

The names inside `{ }` are named exports from the package.

Your own files can export values too:

```ts
export const standardUser = {
  username: 'standard_user',
  password: 'secret_sauce',
};
```

Another file can import it:

```ts
import { standardUser } from '../../src/utils/test-users';
```

Module 01 does not create shared data helpers yet. Module 02 introduces them after you understand why imports matter.

## Relative Paths

When importing your own files, `./` and `../` describe location.

```ts
import { standardUser } from '../../src/utils/test-users';
```

Read that path from the current file:

- `..` means go up one folder
- another `..` means go up another folder
- then enter `src/utils/test-users`

Wrong relative paths are common beginner mistakes. TypeScript and the editor usually show an import error before the test runs.

## Functions vs Test Steps

A beginner temptation is to turn every action into a helper immediately:

```ts
async function clickLogin(page) {
  await page.getByRole('button', { name: 'Login' }).click();
}
```

Helpers are useful, but early helpers can hide learning. Module 01 keeps the login test explicit. Module 03 introduces page objects when repetition becomes a real problem.

## Key Takeaways

- Conditionals let tests choose behavior based on state or data.
- `for...of` is the clearest loop for most beginner array cases.
- Functions should make repeated behavior clearer, not hide important learning.
- Playwright test callbacks are arrow functions.
- Imports are the mechanism that allows the framework to grow across files.
