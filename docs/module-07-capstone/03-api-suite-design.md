# API-Style Suite Design

## Why API-Style Tests Are Included

The source capstone includes 15 API tests because a production SDET should understand more than browser automation.

This repo keeps that learning goal while being honest about SauceDemo: it is a public UI practice app, not a documented backend API training platform.

Module 07 therefore adds API-style tests that validate:

- authentication contract behavior
- product data contract behavior
- cart calculation behavior
- user data behavior

## API Test Count

| Area | Logical Tests |
|---|---:|
| Authentication API-style tests | 2 |
| Product API tests | 5 |
| Cart API tests | 5 |
| User API tests | 3 |
| Total | 15 |

## Where Tests Live

```text
tests/api/capstone/capstone-api.spec.ts
```

The tests run in the existing `api` Playwright project because `playwright.config.ts` already routes `tests/api/**/*.spec.ts` there.

## What These Tests Teach

They teach API testing concepts:

- response-like object shape
- contract validation
- filtering
- derived totals
- negative authentication result
- data consistency checks

The data source is local and typed:

```text
src/utils/capstone-data.ts
```

This keeps the tests deterministic. The point is API test design, not dependence on an unstable public API.

## Future Extension

If the portfolio later points to a real backend, these tests can evolve into real HTTP API tests using Playwright's `request` fixture.

The structure is already compatible with that move:

- keep API tests under `tests/api`
- define response contracts as types
- keep expected data centralized
- assert status, shape, and business meaning
