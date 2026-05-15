# API And Visual Testing Concepts

## API Testing With Playwright

Playwright includes an API request fixture:

```ts
test('GET /posts returns a list of posts', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts');
  expect(response.status()).toBe(200);
});
```

`request` is not a browser page. It sends HTTP requests directly.

## Why API Tests Are Useful

API tests are usually faster than UI tests because they skip browser rendering and user interaction.

They are good for:

- response status checks
- response body shape checks
- filtering and query behavior
- contract expectations

They are not a replacement for UI tests. API tests cannot prove that a user can click through the app successfully.

## Module 04 API Project

[playwright.config.ts](../../playwright.config.ts) adds:

```ts
{
  name: 'api',
  testMatch: /tests\/api\/.*\.spec\.ts/,
}
```

Browser projects ignore API specs so UI and API execution stay intentional.

Run API tests:

```bash
npm run test:api
```

## Response Shape

[tests/api/jsonplaceholder.spec.ts](../../tests/api/jsonplaceholder.spec.ts) defines:

```ts
interface JsonPlaceholderPost {
  readonly userId: number;
  readonly id: number;
  readonly title: string;
  readonly body: string;
}
```

This helps explain what the test expects from the response.

## Visual Testing Concept

The source material introduces visual regression concepts. This repo does not add screenshot baseline tests in Module 04 because visual baselines create artifact and review workflows that fit better with reporting in Module 06.

For now, understand the idea:

- UI assertions check specific text, URL, count, or state
- visual assertions compare rendered screenshots

Visual testing is powerful, but it needs stable baselines and careful review. It is intentionally deferred.

## Code References

Read:

- [tests/api/jsonplaceholder.spec.ts](../../tests/api/jsonplaceholder.spec.ts)
- [playwright.config.ts](../../playwright.config.ts)
- [package.json](../../package.json)
