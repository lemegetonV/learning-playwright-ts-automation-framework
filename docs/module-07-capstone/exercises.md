# Module 07 Exercises

These exercises help you make the capstone your own instead of treating it as generated code.

## Exercise 1: Review The Test Inventory

Open each capstone spec and count the logical tests by domain.

Confirm:

- auth has 14
- products has 24
- cart has 23
- checkout has 27
- API-style suite has 15

Hint: Count logical `test(...)` definitions, not browser-multiplied executions.

## Exercise 2: Add A Reviewer Note

Choose one capstone test and add a short comment explaining why the assertion matters.

Hint: Comments should explain risk or intent, not restate the code.

## Exercise 3: Add One Product Data Check

Add one more assertion to a product information test using `CapstoneProducts`.

Hint: Keep the expected data in [src/utils/capstone-data.ts](../../src/utils/capstone-data.ts).

## Exercise 4: Improve One Test Title

Find a capstone test title that could be more specific and improve it.

Hint: A good failure title tells you which behavior failed before you open the code.

## Exercise 5: Explain One End-To-End Flow

Pick one checkout end-to-end test and explain:

- arrange state
- action
- assertions
- page objects involved

Hint: Use the AAA pattern from Module 04.
