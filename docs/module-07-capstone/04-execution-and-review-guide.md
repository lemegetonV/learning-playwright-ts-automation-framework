# Execution And Review Guide

## Focused Commands

Run the capstone UI suite:

```bash
npm run test:capstone:ui
```

Run the capstone API-style suite:

```bash
npm run test:capstone:api
```

Run all capstone tests:

```bash
npm run test:capstone
```

Run the full framework gate:

```bash
npm run test:ci
```

## What A Reviewer Should Notice

A reviewer should be able to open the repo and see:

- module-by-module learning docs
- a completed capstone suite
- page object abstractions
- typed data
- reporting and CI
- tests organized by domain
- command scripts that make execution discoverable

## How To Read The Capstone

Read in this order:

1. `docs/module-07-capstone/00-module-overview.md`
2. `src/utils/capstone-data.ts`
3. `tests/ui/capstone/auth/login-capstone.spec.ts`
4. `tests/ui/capstone/products/products-capstone.spec.ts`
5. `tests/ui/capstone/cart/cart-capstone.spec.ts`
6. `tests/ui/capstone/checkout/checkout-capstone.spec.ts`
7. `tests/api/capstone/capstone-api.spec.ts`

This order moves from strategy to data to behavior.

## Debugging A Capstone Failure

Use Module 06 reporting:

```bash
npm run report
```

Inspect:

- project name
- test title
- failing assertion
- screenshot/video/trace if present

Do not weaken an assertion just to make a test pass. First classify the failure:

- app behavior changed
- test data is wrong
- locator is wrong
- environment issue
- real product bug

## Completion Criteria

Module 07 should be considered complete only when:

- all capstone tests are implemented
- docs reference actual files
- TypeScript passes
- capstone focused scripts pass
- full CI script passes
- branch is merged to `main`
- `module-07-complete` tag exists
