# npm Scripts, Project Structure, And Git Hygiene

## npm Scripts As Framework Shortcuts

Playwright commands can get long. npm scripts give the team consistent shortcuts.

Module 02 expands [package.json](../../package.json) with:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    "test:chromium": "playwright test --project=chromium",
    "test:firefox": "playwright test --project=firefox",
    "test:webkit": "playwright test --project=webkit",
    "test:mobile": "playwright test --project=\"Mobile Chrome\"",
    "test:login": "playwright test tests/ui/auth/login.spec.ts",
    "typecheck": "tsc --noEmit",
    "report": "playwright show-report reports/playwright-html",
    "codegen": "playwright codegen",
    "codegen:saucedemo": "playwright codegen https://www.saucedemo.com",
    "install:browsers": "playwright install"
  }
}
```

Scripts are part of the framework API. A beginner should not need to memorize every Playwright CLI option immediately.

## When To Use Each Script

| Script | Use When |
|---|---|
| `npm test` | Run the configured test suite |
| `npm run test:headed` | Watch the browser while debugging |
| `npm run test:debug` | Step through with Playwright inspector |
| `npm run test:ui` | Use Playwright's interactive UI mode |
| `npm run test:chromium` | Run one browser quickly |
| `npm run test:login` | Focus only on login specs |
| `npm run typecheck` | Catch TypeScript mistakes before runtime |
| `npm run report` | Open the generated HTML report |

## Project Structure

Module 02 keeps the planned framework folders visible:

```text
src/
  api/
  fixtures/
  page-objects/
  types/
  utils/
tests/
  api/
  learning/
  ui/
    auth/
    cart/
    checkout/
    products/
test-data/
reports/
```

Not every folder is fully used yet. The `.gitkeep` files preserve the intended structure so each module has an obvious destination.

## Why Structure Comes Before Complexity

The structure tells future contributors where code belongs.

Examples:

- user data types go in [src/types/](../../src/types)
- user data builders go in [src/utils/](../../src/utils)
- page object classes will go in [src/page-objects/](../../src/page-objects)
- test specs stay under `tests/`
- generated report output stays under `reports/`

This prevents the common beginner problem where helpers are placed beside whichever spec needed them first.

## [.gitignore](../../.gitignore)

Git should track source code and learning docs. It should not track generated or local-only files.

Important ignored paths:

```gitignore
node_modules/
.env
reports/*
test-results/
playwright-report/
playwright/.auth/*
```

Reasons:

- `node_modules/` is reproducible from [package-lock.json](../../package-lock.json)
- `.env` may contain secrets
- reports and test artifacts are generated
- auth state files can contain session cookies

The [playwright/.auth/.gitkeep](../../playwright/.auth/.gitkeep) exception is added later when saved auth state arrives.

## Git Checkpoint Discipline

Each module branch should show a learning progression:

1. start metadata
2. concept docs
3. code changes
4. exercises
5. completion metadata

That history matters because this repo is a curriculum. A learner should be able to check out `module-02-complete` and see exactly what the framework knew at the end of Module 02.

## Key Takeaways

- npm scripts make framework commands discoverable.
- Folder structure should guide future code placement.
- [.gitignore](../../.gitignore) protects generated files and local secrets.
- Module history is part of the learning experience, not just bookkeeping.
