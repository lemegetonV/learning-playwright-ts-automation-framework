# Environment Variables And Typed Test Data

## The Problem

Module 01 hardcoded credentials inside specs:

```ts
await page.getByPlaceholder('Username').fill('standard_user');
await page.getByPlaceholder('Password').fill('secret_sauce');
```

That is acceptable for the first test, but it does not scale. If credentials appear in many specs, a change requires many edits. If secrets are real, committing them is a security issue.

Module 02 centralizes credentials through:

- [.env.example](../../.env.example)
- `dotenv`
- `process.env`
- [src/types/test-users.ts](../../src/types/test-users.ts)
- [src/utils/test-users.ts](../../src/utils/test-users.ts)

## [.env.example](../../.env.example)

[.env.example](../../.env.example) documents supported variables:

```bash
BASE_URL=https://www.saucedemo.com
SAUCEDEMO_STANDARD_USER=standard_user
SAUCEDEMO_PASSWORD=secret_sauce
```

This file is safe to commit because SauceDemo uses public demo credentials. In a real project, [.env.example](../../.env.example) would contain variable names and fake/sample values, while `.env` would stay local and ignored.

## `.env`

`.env` is intentionally ignored by Git.

A developer can create:

```bash
BASE_URL=https://www.saucedemo.com
SAUCEDEMO_STANDARD_USER=standard_user
SAUCEDEMO_PASSWORD=secret_sauce
```

Then `dotenv` loads those values into `process.env`.

## `dotenv/config`

[src/utils/test-users.ts](../../src/utils/test-users.ts) imports:

```ts
import 'dotenv/config';
```

That import loads environment variables before the helper reads `process.env`.

The config file also imports `dotenv/config` so `BASE_URL` can affect [playwright.config.ts](../../playwright.config.ts).

## Types For Users

[src/types/test-users.ts](../../src/types/test-users.ts) defines the shape:

```ts
export type SauceDemoUserRole =
  | 'standard'
  | 'locked'
  | 'problem'
  | 'performance'
  | 'error'
  | 'visual';

export interface TestUser {
  readonly username: string;
  readonly password: string;
  readonly role: SauceDemoUserRole;
}
```

The type protects the framework from accidental misspellings and partial user objects.

`readonly` communicates that test user definitions are data fixtures. Tests should read them, not mutate them.

## Building Users From Environment Variables

[src/utils/test-users.ts](../../src/utils/test-users.ts) uses one helper:

```ts
function buildSauceDemoUser(
  role: SauceDemoUserRole,
  envKey: string,
  fallbackUsername: string,
): TestUser {
  return {
    role,
    username: process.env[envKey] ?? fallbackUsername,
    password: sauceDemoPassword,
  };
}
```

This gives each user:

- a role
- a username from the environment if present
- a safe SauceDemo fallback if not present
- the shared SauceDemo password

The nullish coalescing operator `??` means "use the value on the right only when the left side is `null` or `undefined`."

## Why Fallbacks Are Used Here

For a learning repo, the project should run immediately after install. SauceDemo public credentials make fallbacks reasonable.

In a real company project, you would usually require environment variables and fail fast when secrets are missing.

The distinction matters:

- learning/demo target: fallbacks improve onboarding
- real private app: missing secrets should fail loudly

## How Specs Use The Helper

Module 02 specs import:

```ts
import { SauceDemoUsers } from '../../../src/utils/test-users';
```

Then use:

```ts
await page.getByPlaceholder('Username').fill(SauceDemoUsers.standard.username);
await page.getByPlaceholder('Password').fill(SauceDemoUsers.standard.password);
```

This is still raw Playwright. Only the data source changed.

## Key Takeaways

- Do not scatter important test data across many specs.
- [.env.example](../../.env.example) documents configuration safely.
- `.env` is local and ignored.
- TypeScript interfaces make shared data safer.
- Module 02 centralizes data without introducing page objects too early.
