# Module 01: Getting Started with Playwright

## Objective
Set up the Playwright project, understand the generated structure, run the first working tests, and build the JavaScript/TypeScript foundation needed for the rest of the UI automation track.

## Why This Module Matters
The source Playwright curriculum starts quickly and assumes you can absorb JavaScript/TypeScript along the way. That is workable for some learners, but it leaves a gap for anyone who is new to the language. This module closes that gap while also giving you your first real Playwright feedback loop.

Think of Module 01 as doing two jobs at once:
- setting up your workshop
- learning the basic tools and language you need before building the framework

## Topics
| # | Topic | Planned Doc | Key Concepts |
|---|-------|-------------|-------------|
| 1 | JavaScript & TypeScript Basics for QA | `01-javascript-typescript-basics.md` | variables, primitive types, arrays, objects, `let`/`const`, type annotations |
| 2 | Control Flow, Functions, and Modules | `02-control-flow-functions-and-modules.md` | conditionals, loops, functions, arrow functions, imports/exports |
| 3 | Async Playwright Code | `03-async-await-and-playwright-flow.md` | promises, `async`/`await`, why browser actions must be awaited |
| 4 | Playwright Setup and First Tests | `04-project-setup-and-first-tests.md` | Node.js, Playwright install, generated files, first run, VS Code integration |
| 5 | Locators, Actions, and Assertions | `05-core-playwright-primitives.md` | `page`, locators, actions, `expect`, basic test structure |
| 6 | Real Website Practice | `06-first-saucedemo-test.md` | login flow, visible assertions, URL checks, debugging basics |
| 7 | Exercises | `exercises.md` | practice tasks combining language and Playwright basics |

## How to Use This Module
1. Read the language bridge docs first before trying to memorize Playwright syntax
2. Run the generated Playwright examples and inspect how they are structured
3. Practice the inline examples until `async` / `await` and locator usage feel natural
4. Complete the exercises without copying solutions directly
5. Move to Module 02 only when you can explain a basic Playwright spec line-by-line

## Prerequisites
- No prior JavaScript or TypeScript experience required
- Node.js installed
- VS Code or another editor available

## Connection to Later Modules
- **Module 02** uses the TypeScript and config basics introduced here
- **Module 03** turns functions and classes into page objects
- **Module 04** depends heavily on `async` / `await`, assertions, and test structure
- **Module 05** builds on imports, shared utilities, and typed helpers
