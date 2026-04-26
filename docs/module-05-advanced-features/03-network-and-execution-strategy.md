# Network Interception And Execution Strategy

## Network Interception

Playwright can observe, block, or mock network traffic.

Module 05 uses `page.route`:

```ts
await page.route('https://example.test/api/products', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Mock Backpack' }]),
  });
});
```

The route handler runs before the browser completes the request.

## Why Mock Responses

Mocking is useful when:

- the backend is unstable or unavailable
- you need a rare response that is hard to create naturally
- the UI behavior is the focus, not the backend

Mocking is risky when:

- the mock no longer matches the real API
- too many UI tests stop exercising real integrations

Use mocks intentionally, not by default.

## Blocking Requests

The module blocks image requests:

```ts
await page.route('**/*.png', async (route) => {
  await route.abort();
});
```

This pattern can be useful for performance or for testing how a page behaves when assets fail.

## Observing Requests

The module also listens to requests:

```ts
page.on('request', (request) => {
  observedRequests.push(request.url());
});
```

Observation is less invasive than mocking. It records behavior without changing the response.

## Execution Strategy

Module 05 adds scripts:

```json
{
  "test:advanced": "playwright test --project=advanced-chromium",
  "test:authenticated": "playwright test --project=authenticated-chromium",
  "test:serial": "playwright test --workers=1",
  "test:parallel": "playwright test --workers=4",
  "test:shard:1": "playwright test --shard=1/2",
  "test:shard:2": "playwright test --shard=2/2"
}
```

These scripts teach how execution can be shaped without changing test code.

## Projects For Advanced Tests

`advanced-chromium` runs only `tests/advanced`.

Browser projects ignore advanced/auth/setup tests so the normal suite stays focused on application workflows.

This separation matters because advanced feature demos use local HTML and mocked routes. They are learning examples, not cross-browser SauceDemo regression tests.

## Sharding

Sharding splits the suite into pieces:

```bash
npm run test:shard:1
npm run test:shard:2
```

In CI, shards can run on separate machines to reduce total time. Locally, sharding mainly teaches the concept.

## Code References

Read:

- `tests/advanced/network-interception.spec.ts`
- `playwright.config.ts`
- `package.json`
