# Module 02 Exercises

These exercises extend the Module 02 foundation without jumping into page objects.

## Exercise 1: Trace The Config

Open `playwright.config.ts`.

Write down where each of these values is configured:

- test directory
- base URL
- HTML report folder
- Chromium project
- mobile project
- assertion timeout

Hint: Read `01-playwright-config.md` beside the config file.

## Exercise 2: Add A Browser-Focused Script

Add one script to `package.json` that runs only the login spec in Chromium.

Suggested command shape:

```bash
playwright test tests/ui/auth/login.spec.ts --project=chromium
```

Hint: Keep the script name consistent with the existing naming style.

## Exercise 3: Override The Base URL Locally

Run the login spec with `BASE_URL` set in the terminal instead of changing code.

Example:

```bash
BASE_URL=https://www.saucedemo.com npm run test:login
```

Then explain why this is better than hardcoding the URL inside every spec.

## Exercise 4: Add A Typed User Role

Add a new role to `SauceDemoUserRole` as a learning experiment, then observe what TypeScript asks you to update in `SauceDemoUsers`.

After the experiment, restore the original code unless the new role is real.

Hint: This shows how `satisfies Record<SauceDemoUserRole, TestUser>` keeps the data object complete.

## Exercise 5: Read `.gitignore` Like A Reviewer

Open `.gitignore` and explain why each of these should not be committed:

- `node_modules/`
- `.env`
- `reports/*`
- `test-results/`

Hint: Separate "can be regenerated" from "may contain sensitive local data."
