# Playwright TypeScript Automation Framework

A TypeScript-based UI test automation framework built with **Playwright**, demonstrating Page Object Model (POM), API-based authentication, parallel execution, controlled serial execution, reusable test data, cross-browser testing, and CI/CD integration.

The framework provides automated coverage for the **[Rahul Shetty Academy E-Commerce Client application](https://rahulshettyacademy.com/client)**, covering authentication, product selection, cart management, order history, and session-boundary scenarios.

---

## Overview

### Application Under Test

**Rahul Shetty Academy E-Commerce Client**

https://rahulshettyacademy.com/client

This project is **not intended to provide exhaustive application coverage**. Instead, it demonstrates key automation practices and framework capabilities through representative end-to-end user journeys.

The framework demonstrates automation of:

* Login
* Product selection
* Shopping cart validation
* Cart item removal
* Order history
* Sign-out and session-boundary validation
* Negative login scenarios
* Cross-browser execution
* API-based authentication and test setup

The framework is designed to demonstrate practices suitable for a modern **SDET / Test Automation Engineer** project.

---

# Tech Stack

| Technology / Approach | Purpose                                |
| --------------------- | -------------------------------------- |
| TypeScript            | Programming language                   |
| Playwright Test       | Test runner and browser automation     |
| Node.js               | Runtime                                |
| npm                   | Package management and project scripts |
| Page Object Model     | UI abstraction and maintainability     |
| Git / GitHub          | Source control                         |
| GitHub Actions        | CI/CD                                  |
| GitHub Codespaces     | Cloud development environment          |

### Authentication

| Technology / Approach     | Purpose                                               |
| ------------------------- | ----------------------------------------------------- |
| JWT                       | API-based authentication and authenticated test setup |
| Playwright `storageState` | Reuse authenticated browser state                     |

---

# Project Structure

```text
playwright-ts-automation/
│
├── .github/
│   └── workflows/
│       └── playwright.yaml
│
├── pages/
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── OrdersHistoryPage.ts
│   ├── OrdersReviewPage.ts
│   ├── CartPage.ts
│   │
│   ├── Components/
│   │   └── HeaderComponent.ts
│   │
│   └── Pages.ts
│
├── test-data/
│   ├── login-data.ts
│   ├── order-data.ts
│   └── country-search-data.ts
│
├── tests/
│   ├── example.spec.ts
│   │
│   └── rahulshetty/
│       ├── login.spec.ts
│       ├── cart-contents-removal.spec.ts
│       ├── sign-out-session-boundary.spec.ts
│       ├── order-history-lookup.spec.ts
│       ├── login-practice-controls.ts
│       ├── login-practice-child-window.spec.ts
│       └── angular-practice.spec.ts
│
├── global-setup.ts
├── .env.example
├── .gitignore
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

# Framework Architecture

The framework uses the **Page Object Model (POM)** together with a central **Page Object Manager**.

```text
                         Playwright Test
                                │
                                ▼
                         Pages (Manager)
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
        LoginPage        DashboardPage         CartPage
             │                  │                  │
             └──────────────────┼──────────────────┘
                                │
                                ▼
                       HeaderComponent
```

## Page Objects

Page Objects encapsulate the locators and behaviour associated with a particular application page.

Examples:

* `LoginPage`
* `DashboardPage`
* `CartPage`
* `OrdersHistoryPage`
* `OrdersReviewPage`

For example:

```ts
await pages.dashboardPage.addProductToCart(
    orderTestData.productName
);
```

The test does not need to know which CSS selectors or DOM elements are used to locate the product.

---

## Component Objects

Reusable areas of the application are represented as **Component Objects**.

For example:

```text
pages/Components/HeaderComponent.ts
```

`HeaderComponent` contains functionality such as:

* Home navigation
* Cart navigation
* Orders navigation
* Sign out

This allows common application functionality to be reused across multiple tests without duplicating locators and interaction logic.

---

## Page Object Manager

`Pages.ts` acts as a central access point for the Page Objects and reusable components.

```ts
const pages = new Pages(page);
```

The same Playwright `Page` instance is passed to each Page Object.

This means that all Page Objects operate on the same browser tab during a test.

For example:

```ts
const pages = new Pages(page);

await pages.dashboardPage.addProductToCart('iPhone 13');

await pages.headerComponent.navigateToCart();

await pages.cartPage.verifyProductIsDisplayed('iPhone 13');
```

`Pages` is therefore a **Page Object Manager**, rather than a Page Object itself.

---

# Setup

The project can be run either:

1. Locally on a developer machine
2. In GitHub Codespaces

The application setup and test commands are the same once the project dependencies have been installed.

---

# GitHub Codespaces

GitHub Codespaces provides a cloud-based development environment for working with the repository without requiring the project to be installed directly on a local machine.

## Open the Repository in Codespaces

For the normal Codespaces workflow, open the GitHub repository and select:

**Code → Codespaces → Create codespace on main**

The repository is automatically available in the Codespace, so **no `git clone` is required**.

Once the Codespace starts, verify that Node.js and npm are available:

```bash
node --version
npm --version
```

Then install the project dependencies:

```bash
npm install
```

Install the Playwright browsers and required Linux system dependencies:

```bash
npx playwright install --with-deps
```

---

## Why Use `--with-deps`?

A Codespace normally runs on Linux.

The command:

```bash
npx playwright install
```

downloads the Playwright browser binaries but does not necessarily install the Linux system libraries required by those browsers.

For Codespaces, containers and CI environments, use:

```bash
npx playwright install --with-deps
```

This installs the Playwright browsers together with the required operating-system dependencies.

If you see an error similar to:

```text
error while loading shared libraries:
libatk-1.0.so.0: cannot open shared object file
```

run:

```bash
npx playwright install --with-deps
```

---

# Local Development Setup

## Prerequisites

The project requires:

* Node.js 24.x LTS
* npm
* Git

Check your installed versions:

```bash
node --version
npm --version
git --version
```

Node.js can be downloaded from:

https://nodejs.org

Alternatively, use `nvm`:

```bash
nvm install 24
nvm use 24
```

---

## Clone the Repository

To run the project locally, clone the repository:

```bash
git clone https://github.com/JFSoftwareServices/playwright-ts-automation.git
cd playwright-ts-automation
```

---

## Install Dependencies

Install the project dependencies:

```bash
npm install
```

Install Playwright browsers and required dependencies:

```bash
npx playwright install --with-deps
```

---

# Environment Configuration

The login tests and `global-setup.ts` require a valid test account for the Rahul Shetty Academy application.

Create the local environment file:

```bash
cp .env.example .env
```

Add the required credentials:

```text
TEST_USER_EMAIL=your-test-account@example.com
TEST_USER_PASSWORD=your-password
```

The `.env` file is ignored by Git and **must not be committed**.

Only `.env.example` should be committed to the repository.

---

# Authentication Strategy

The framework uses two authentication approaches depending on the type of test being executed.

## UI Authentication

Login tests deliberately start without an authenticated Playwright storage state so that the actual login UI is tested.

For example:

```ts
test.use({
    storageState: {
        cookies: [],
        origins: []
    }
});
```

This allows the test to exercise the complete login journey:

```text
Login Page
    │
    ├── Enter email
    ├── Enter password
    └── Click Login
            │
            ▼
     Authenticated Session
```

---

## API-Based Authentication

Authenticated tests do not need to repeatedly perform the login UI journey.

`global-setup.ts` performs authentication and creates the authenticated Playwright storage state.

The authenticated state can then be reused by the tests.

This provides two important benefits:

1. The login UI is tested independently.
2. Other tests do not waste execution time repeatedly logging in through the UI.

This follows a hybrid approach where **API calls are used for efficient test setup**, while **UI automation is used to validate user-facing behaviour**.

---

# Why Login Tests Can Run in Parallel

The login tests can run in parallel because Playwright provides an isolated browser context for each test, while authentication is handled using JWT-based session state.

Conceptually:

```text
                       Test Runner
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
          Test 1         Test 2         Test 3
             │              │              │
             ▼              ▼              ▼
        Context 1       Context 2       Context 3
             │              │              │
             ▼              ▼              ▼
        Session A       Session B       Session C
```

Each Playwright test receives its own browser context.

Browser state such as:

* Cookies
* Local storage
* Session state
* Pages

is therefore isolated between tests.

A login performed by one test does not log another test in or out of its browser context.

This makes independent login scenarios suitable for parallel execution.

For example:

* Successful login
* Invalid password
* Invalid email
* Empty credentials

can execute concurrently.

---

## Important: Browser Isolation vs Backend Isolation

Browser-context isolation does **not** mean that server-side application data is isolated.

For example, if two tests use the same backend account:

```text
                    User Account
                         │
              ┌──────────┼──────────┐
              │          │          │
             Cart      Orders     Profile
```

two separate browser contexts may still interact with the same server-side data.

This is particularly important for tests that modify:

* Shopping carts
* Orders
* User profiles
* Account settings
* Other persistent application state

For state-changing tests, the preferred approaches are:

1. Use separate test accounts where practical.
2. Use API-based setup and cleanup.
3. Use serial execution only where genuinely necessary.

The framework therefore uses a combination of browser isolation, API setup/cleanup and controlled serial execution.

---

# Parallel and Serial Test Execution

The framework is designed around a **parallel-first execution strategy**.

Most tests should run in parallel because this provides faster feedback.

Only tests that genuinely require serial execution are marked with:

```ts
@serial
```

---

# The `@serial` Tag

A test or test group can be tagged:

```ts
test.describe(
    'Some journey',
    { tag: '@serial' },
    () => {
        // tests
    }
);
```

The tag identifies the test as belonging to the serial execution group.

### Important

The `@serial` tag **does not itself make Playwright run the test serially**.

It is a classification/tag.

The npm script controls the actual execution behaviour:

```bash
npx playwright test --workers=1 --grep @serial
```

This:

1. Selects tests tagged `@serial`
2. Runs them using one Playwright worker

---

# Why Use Serial Tests?

Serial execution should be used sparingly.

It is appropriate when tests genuinely depend on shared state or when running multiple tests concurrently could cause interference.

For example:

```text
Test A
  │
  ▼
Changes shared application state
  │
  ▼
Test B
  │
  ▼
Depends on that state
```

These tests may need controlled execution.

However, making the entire test suite serial is generally undesirable because it:

* Slows execution
* Reduces parallelism
* Can hide test-isolation problems

The preferred approach is to keep tests independent and parallel wherever possible.

---

# npm Scripts

The project defines the following scripts in `package.json`:

```json
{
    "scripts": {
        "test": "npm run test:parallel && npm run test:serial",
        "test:parallel": "playwright test --grep-invert @serial",
        "test:serial": "playwright test --workers=1 --grep @serial",
        "report": "playwright show-report"
    }
}
```

These scripts divide the suite into two execution phases.

---

## Run the Complete Suite

The recommended command is:

```bash
npm test
```

This executes:

```text
npm run test:parallel
        │
        ▼
All tests except @serial
        │
        ▼
npm run test:serial
        │
        ▼
@serial tests using one worker
```

Therefore:

```bash
npm test
```

is the project's standard command for executing the complete suite.

---

# Run Parallel Tests Only

```bash
npm run test:parallel
```

This runs:

```bash
npx playwright test --grep-invert @serial
```

All tests tagged `@serial` are excluded.

Playwright can therefore use the configured number of workers.

---

# Run Serial Tests Only

```bash
npm run test:serial
```

This runs:

```bash
npx playwright test --workers=1 --grep @serial
```

Only tests tagged `@serial` are selected, and Playwright is restricted to one worker.

---

# npm vs npx

Both `npm` and `npx` are useful, but they serve different purposes.

## Use npm for Project Commands

Use npm when running commands that have been defined by the project:

```bash
npm test
npm run test:parallel
npm run test:serial
npm run report
```

These commands represent the framework's standard execution strategy.

---

## Use npx for Direct Playwright Commands

Use `npx` when you want to invoke Playwright directly and supply custom options:

```bash
npx playwright test
```

For example:

```bash
npx playwright test tests/rahulshetty/login.spec.ts
```

or:

```bash
npx playwright test --project=chromium
```

### Simple rule

```text
npm
 │
 └── Run predefined project commands

npx
 │
 └── Run Playwright directly with custom options
```

---

# Running Tests

## Run the Complete Suite

Recommended:

```bash
npm test
```

This uses the framework's parallel-first strategy and then runs serial tests.

You can also run Playwright directly:

```bash
npx playwright test
```

However, `npm test` is preferred when you want the framework's explicit parallel/serial execution strategy.

---

# Run a Single Test File

Example:

```bash
npx playwright test tests/rahulshetty/login.spec.ts
```

Cart tests:

```bash
npx playwright test tests/rahulshetty/cart-contents-removal.spec.ts
```

Sign-out tests:

```bash
npx playwright test tests/rahulshetty/sign-out-session-boundary.spec.ts
```

Order history tests:

```bash
npx playwright test tests/rahulshetty/order-history-lookup.spec.ts
```

---

# Run a Single Test by Name

Use `-g` or `--grep`:

```bash
npx playwright test -g "logs in successfully"
```

For example:

```bash
npx playwright test -g "removes item from cart"
```

Playwright will run tests whose titles match the supplied expression.

---

# Run Tests by Tag

Run serial tests:

```bash
npx playwright test --grep @serial
```

Run all non-serial tests:

```bash
npx playwright test --grep-invert @serial
```

Run serial tests with one worker:

```bash
npx playwright test --workers=1 --grep @serial
```

---

# Run on a Specific Browser

## Chromium

```bash
npx playwright test --project=chromium
```

## Firefox

```bash
npx playwright test --project=firefox
```

## WebKit

```bash
npx playwright test --project=webkit
```

---

# Run a Test File on a Specific Browser

Chromium:

```bash
npx playwright test tests/rahulshetty/login.spec.ts --project=chromium
```

Firefox:

```bash
npx playwright test tests/rahulshetty/login.spec.ts --project=firefox
```

WebKit:

```bash
npx playwright test tests/rahulshetty/login.spec.ts --project=webkit
```

---

# Run in Headed Mode

To see the browser while the tests are executing:

```bash
npx playwright test --headed
```

For a specific test:

```bash
npx playwright test tests/rahulshetty/login.spec.ts --headed
```

On a normal local desktop with a display, `--headed` works directly.

---

## Headed Mode in Codespaces and CI

Codespaces and many CI environments do not provide a graphical display server.

Running:

```bash
npx playwright test --headed
```

may result in:

```text
Missing X server or $DISPLAY
```

On Linux environments where Xvfb is available, headed execution can be run using:

```bash
xvfb-run npx playwright test --headed
```

For normal Codespaces and CI execution, headless mode is recommended.

---

# Debug Mode

Use the Playwright Inspector:

```bash
npx playwright test --debug
```

This is useful when investigating:

* Locator problems
* Timing issues
* Navigation problems
* Unexpected application state
* Failed assertions

You can also debug an individual test:

```bash
npx playwright test tests/rahulshetty/login.spec.ts --debug
```

---

# List Tests Without Running Them

To see which tests Playwright discovers:

```bash
npx playwright test --list
```

To list only serial tests:

```bash
npx playwright test --list --grep @serial
```

To list non-serial tests:

```bash
npx playwright test --list --grep-invert @serial
```

---

# Run with One Worker

For debugging concurrency or test-isolation issues:

```bash
npx playwright test --workers=1
```

This is useful for investigating whether tests behave differently when executed sequentially.

---

# HTML Test Report

After running the tests, open the Playwright HTML report:

```bash
npm run report
```

This executes:

```bash
npx playwright show-report
```

The report can contain:

* Passed tests
* Failed tests
* Test duration
* Error messages
* Screenshots
* Trace information
* Videos where configured

You can also run it directly:

```bash
npx playwright show-report
```

---

# Test Isolation Strategy

The framework aims to keep tests independent wherever possible.

## Browser-Level Isolation

Playwright creates an isolated browser context for each test.

This provides isolation for browser state such as:

* Cookies
* Local storage
* Session state
* Pages

---

## Backend-Level State

Browser isolation does not isolate server-side application data.

For example:

```text
Test A
  │
  └── Adds product to Cart

Test B
  │
  └── Expects Cart to be empty
```

If both tests use the same backend account, the tests may still interact with the same server-side cart.

For this reason, state-changing tests should use API setup and cleanup where practical.

---

# Hybrid API/UI Testing Strategy

The framework follows a hybrid testing approach.

```text
                         Test
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
             API                      UI
              │                       │
       ┌──────┼──────┐        ┌───────┼────────┐
       │      │      │        │       │        │
       ▼      ▼      ▼        ▼       ▼        ▼
     Auth   Setup  Cleanup   Journey Behaviour Assertions
```

### API is preferred for:

* Authentication
* Test data setup
* Test data cleanup
* Preparing backend state

### UI is preferred for:

* User journeys
* UI behaviour
* Navigation
* User-visible validation

This keeps UI tests focused on what the user actually experiences while avoiding unnecessary UI-based setup.

---

# Test Design Principles

The framework follows several Playwright best practices.

## Page Object Model

Locators and page-specific behaviour are encapsulated inside Page Objects.

Tests should describe business behaviour rather than implementation details.

Preferred:

```ts
await pages.dashboardPage.addProductToCart(
    orderTestData.productName
);

await pages.headerComponent.navigateToCart();

await pages.cartPage.removeFromCart(
    orderTestData.productName
);
```

Instead of exposing DOM implementation details directly in the test:

```ts
await page.locator('.card-body')
    .nth(2)
    .getByRole('button', {
        name: 'Add To Cart'
    })
    .click();
```

---

# Web-First Assertions

The framework prefers Playwright's auto-waiting assertions.

Examples:

```ts
await expect(locator).toBeVisible();

await expect(locator).toHaveCount(1);

await expect(page).toHaveURL(/dashboard/);
```

These assertions automatically wait for the expected condition.

Arbitrary sleeps such as:

```ts
await page.waitForTimeout(2000);
```

should generally be avoided.

Web-first assertions provide better synchronization and reduce unnecessary waiting.

---

# CI/CD

The project includes a GitHub Actions workflow:

```text
.github/workflows/playwright.yaml
```

The workflow allows the Playwright test suite to run automatically in a clean CI environment.

The workflow can be used to:

* Install Node.js dependencies
* Install Playwright browsers
* Execute automated tests
* Detect regressions
* Publish test results and reports as GitHub Actions artifacts where configured

This ensures that the tests are not dependent solely on a developer's local environment.

---

# Troubleshooting

## Playwright Browser Fails to Start

If you see an error similar to:

```text
error while loading shared libraries:
libatk-1.0.so.0
```

run:

```bash
npx playwright install --with-deps
```

This is particularly relevant to Linux-based Codespaces, containers and CI runners.

---

## Tests Are Affecting Each Other

First check whether the tests are modifying shared backend state.

For example:

```text
Test A → Adds product to cart

Test B → Expects empty cart
```

Although Test A and Test B have isolated browser contexts, they may still use the same backend account.

Consider:

* API cleanup
* Separate test accounts
* Independent test data
* Serial execution where genuinely required

Do not automatically make the entire suite serial.

---

# Quick Command Reference

| Requirement                  | Command                                     |
| ---------------------------- | ------------------------------------------- |
| Install dependencies         | `npm install`                               |
| Install Playwright browsers  | `npx playwright install --with-deps`        |
| Run complete framework suite | `npm test`                                  |
| Run parallel tests           | `npm run test:parallel`                     |
| Run serial tests             | `npm run test:serial`                       |
| Run Playwright directly      | `npx playwright test`                       |
| Run one test file            | `npx playwright test path/to/test.spec.ts`  |
| Run test by name             | `npx playwright test -g "test name"`        |
| Run serial-tagged tests      | `npx playwright test --grep @serial`        |
| Exclude serial tests         | `npx playwright test --grep-invert @serial` |
| Run with one worker          | `npx playwright test --workers=1`           |
| Chromium                     | `npx playwright test --project=chromium`    |
| Firefox                      | `npx playwright test --project=firefox`     |
| WebKit                       | `npx playwright test --project=webkit`      |
| Headed mode                  | `npx playwright test --headed`              |
| Debug mode                   | `npx playwright test --debug`               |
| List tests                   | `npx playwright test --list`                |
| HTML report                  | `npm run report`                            |
| HTML report directly         | `npx playwright show-report`                |

---

# Execution Model Summary

The framework uses a **parallel-first execution model**.

```text
                         npm test

                            │

                            ▼

                 ┌─────────────────────┐
                 │   Parallel Phase    │
                 │                     │
                 │ --grep-invert       │
                 │      @serial        │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │    Serial Phase     │
                 │                     │
                 │ --grep @serial      │
                 │ --workers=1         │
                 └─────────────────────┘
```

The objective is to maximise test execution speed while allowing genuinely state-dependent tests to execute safely.

The `@serial` tag therefore represents an **explicit exception to the normal parallel execution model**, rather than making serial execution the default for the entire test suite.

---

# Repository

GitHub repository:

https://github.com/JFSoftwareServices/playwright-ts-automation.git

# Playwright Documentation

https://playwright.dev
