# Playwright TypeScript Automation Framework

A TypeScript-based UI test automation framework built with **Playwright Test**, demonstrating Page Object Model (POM), API-based authentication, reusable test data, parallel execution, controlled serial execution, cross-browser testing, environment-based configuration, and CI/CD integration.

The framework provides automated coverage for the **Rahul Shetty Academy E-Commerce Client application**, covering authentication, product selection, shopping cart behaviour, order history, sign-out, and session-boundary scenarios.

The project is designed to demonstrate practical automation engineering principles suitable for a modern **SDET / Test Automation Engineer** portfolio.

---

# Overview

## Application Under Test

**Rahul Shetty Academy E-Commerce Client**

https://rahulshettyacademy.com/client

This project is **not intended to provide exhaustive application coverage**. Instead, it demonstrates key automation practices and framework capabilities through representative end-to-end user journeys.

The framework demonstrates automation of:

* Login
* Negative login scenarios
* Product selection
* Shopping cart validation
* Cart item removal
* Order history
* Sign-out and session-boundary validation
* Cross-browser execution
* API-based authentication
* Authenticated browser state reuse
* Parallel and controlled serial execution
* CI/CD execution using GitHub Actions

---

# Tech Stack

| Technology / Approach     | Purpose                                |
| ------------------------- | -------------------------------------- |
| TypeScript                | Programming language                   |
| Playwright Test           | Test runner and browser automation     |
| Node.js 24                | Runtime                                |
| npm                       | Package management and project scripts |
| Page Object Model         | UI abstraction and maintainability     |
| Page Object Manager       | Central access to Page Objects         |
| Component Objects         | Reusable UI components                 |
| JWT                       | API-based authentication               |
| Playwright `storageState` | Reuse authenticated browser state      |
| Git / GitHub              | Source control                         |
| GitHub Actions            | CI/CD                                  |
| GitHub Codespaces         | Cloud development environment          |

---

# Project Structure

```text
playwright-ts-automation/

│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── api/
│   └── AuthApi.ts
│
├── fixtures/
│   └── test.ts
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
├── utils/
│   └── AuthUtils.ts
│
├── test-data/
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
│       ├── login-practice-child-window.spec.ts
│       └── angular-practice.spec.ts
│
├── global-setup.ts
├── .env.example
├── .gitignore
├── playwright.config.ts
├── package.json
├── package-lock.json
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

Authentication is handled separately from the UI Page Objects:

```text
                       global-setup.ts

                              │
                              ▼

                          AuthApi
                              │
                              ▼
                       API Login Request
                              │
                              ▼
                       JWT + User ID
                              │
                              ▼
                    Browser localStorage
                              │
                              ▼
                     Playwright storageState
                              │
                              ▼
                     Authenticated Tests
```

This separates authentication concerns from page interaction and keeps the UI tests focused on user-facing behaviour.

---

# Page Objects

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

The test does not need to know which DOM selectors are required to locate the product or its **Add To Cart** button.

This keeps tests focused on business behaviour rather than implementation details.

---

# Component Objects

Reusable areas of the application are represented as **Component Objects**.

For example:

```text
pages/Components/HeaderComponent.ts
```

`HeaderComponent` contains common functionality such as:

* Home navigation
* Cart navigation
* Orders navigation
* Sign out
* Authentication verification

This allows common application functionality to be reused across multiple tests without duplicating locators and interaction logic.

---

# Page Object Manager

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

# Authentication Strategy

The framework uses two authentication approaches depending on the type of test being executed.

## UI Authentication

Login tests deliberately start without an authenticated Playwright storage state so that the actual login UI is tested.

```ts
test.use({
    storageState: {
        cookies: [],
        origins: []
    }
});
```

This allows the test to exercise the actual login journey:

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

This ensures that the authentication UI itself is covered by automation.

---

## API-Based Authentication

Authenticated tests do not need to repeatedly perform the login UI journey.

`global-setup.ts` uses `AuthApi` to authenticate through the application's API.

The resulting JWT and user ID are then used to establish the authenticated browser state.

The state is saved using Playwright's `storageState`.

Conceptually:

```text
global-setup.ts
      │
      ▼
    AuthApi
      │
      ▼
  API Login
      │
      ▼
 JWT + userId
      │
      ▼
Browser localStorage
      │
      ▼
storageState.json
      │
      ▼
Authenticated Tests
```

This provides two important benefits:

1. The login UI is tested independently.
2. Other authenticated tests do not repeatedly perform the login UI journey.

This follows a hybrid approach where **API authentication is used for efficient test setup**, while **UI automation is used to validate user-facing behaviour**.

---

# Authentication Classes

Authentication responsibilities are separated into different layers.

## `AuthApi`

`AuthApi` handles API-level authentication.

```text
AuthApi
   │
   └── API login
        │
        └── JWT + userId
```

It is used by `global-setup.ts`.

---

## `AuthUtils`

`AuthUtils` handles browser-side authentication state.

It retrieves authentication information from the browser's `localStorage`, such as:

```text
localStorage
    │
    ├── token
    └── userId
```

This keeps browser authentication-state handling separate from the API authentication performed by `AuthApi`.

---

# Global Setup

The framework uses Playwright's `globalSetup` to establish authenticated browser state before the test suite executes.

The process is:

```text
1. Create API request context
          │
          ▼
2. Authenticate using AuthApi
          │
          ▼
3. Obtain JWT and user ID
          │
          ▼
4. Create browser context
          │
          ▼
5. Inject authentication into localStorage
          │
          ▼
6. Navigate to the application
          │
          ▼
7. Save storageState.json
```

Authenticated tests can then start with an existing authenticated session rather than repeating the login process.

---

# Environment Configuration

The framework uses environment variables to separate configuration and credentials from the source code.

This provides a safer approach to handling environment-specific configuration and prevents credentials from being hard-coded directly into the test framework.

The same source code can therefore run locally and in CI without changing the test implementation.

---

## Local Development

When running the framework locally, environment variables are supplied through a `.env` file.

Example:

```env
BASE_URL=https://rahulshettyacademy.com
TEST_USER_EMAIL=Tester1@example.com
TEST_USER_PASSWORD=Tester1@example.com
```

The `.env` file is **not committed to Git** and is included in `.gitignore`.

A `.env.example` file is provided in the repository to document the environment variables required by the framework without exposing local credentials.

For example:

```env
BASE_URL=https://rahulshettyacademy.com
TEST_USER_EMAIL=
TEST_USER_PASSWORD=
```

The framework loads these values into `process.env`.

For example:

```ts
process.env.BASE_URL
process.env.TEST_USER_EMAIL
process.env.TEST_USER_PASSWORD
```

This allows credentials and environment-specific configuration to remain outside the source code.

---

# CI Environment – GitHub Actions

When the tests run in GitHub Actions, the local `.env` file is **not required**.

Sensitive credentials are stored using **GitHub Actions Repository Secrets**.

## Creating GitHub Actions Secrets

In the GitHub repository, navigate to:

```text
Settings
   │
   ▼
Secrets and variables
   │
   ▼
Actions
   │
   ▼
Repository secrets
```

Create the following repository secrets:

```text
TEST_USER_EMAIL
TEST_USER_PASSWORD
```

The credentials are stored securely by GitHub rather than being committed to the repository.

---

## Supplying Secrets to the Test Process

The GitHub Actions workflow exposes the secrets as environment variables when Playwright runs:

```yaml
env:
  TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
  TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
```

The Playwright framework then accesses them through the same `process.env` interface used locally:

```ts
process.env.TEST_USER_EMAIL
process.env.TEST_USER_PASSWORD
```

The source code therefore does not need to know whether it is running locally or in CI.

The configuration flow is:

```text
Local Development

.env
 │
 ▼
process.env
 │
 ▼
Playwright Tests
```

and:

```text
GitHub Actions

GitHub Repository Secrets
 │
 ▼
Environment Variables
 │
 ▼
process.env
 │
 ▼
Playwright Tests
```

The same test source code can therefore run in both environments without embedding credentials in the repository.

---

# Why Use Environment Variables?

Environment variables are used to separate **configuration and credentials from test source code**.

This provides several benefits:

* Credentials are not hard-coded in test files.
* Sensitive values are not committed to Git.
* Different environments can supply different configuration.
* The same test code can run locally and in CI.
* Local credentials can be managed through `.env`.
* CI credentials can be managed through GitHub Actions Secrets.
* Environment-specific configuration can be changed without modifying test code.

The `.env` file should remain local and must not be committed to the repository.

The repository contains `.env.example` instead, providing a safe template showing which environment variables are required.

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

A login performed by one test does not directly modify the browser context of another test.

---

## Backend-Level State

Browser isolation does **not** isolate server-side application data.

For example:

```text
Test A
  │
  └── Adds product to cart

Test B
  │
  └── Expects cart to be empty
```

If both tests use the same backend account, they may still interact with the same server-side cart.

This is particularly important for tests that modify:

* Shopping carts
* Orders
* User profiles
* Account settings
* Other persistent application state

For state-changing tests where shared backend state could cause interference, the framework uses **controlled serial execution** where appropriate.

In a larger production framework, additional isolation strategies could include:

* Separate test accounts
* API-based test-data setup
* API-based cleanup
* Dedicated test data
* Database-level isolation where appropriate

---

# Parallel and Serial Test Execution

The framework follows a **parallel-first execution strategy**.

Most tests should run in parallel because this provides faster feedback.

Only tests that genuinely require controlled execution are marked with:

```text
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

The `@serial` tag **does not itself make Playwright execute the test serially**.

It is simply a classification/tag.

The npm script controls the execution behaviour:

```bash
npx playwright test --workers=1 --grep @serial
```

This:

1. Selects tests tagged `@serial`.
2. Runs them using one Playwright worker.

---

# Why Use Serial Tests?

Serial execution should be used sparingly.

It is appropriate when tests genuinely interact with shared backend state and concurrent execution could cause interference.

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

Making the entire suite serial is generally undesirable because it:

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

is the project's standard command for executing the complete framework suite.

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

Use npm when running commands defined by the project:

```bash
npm test

npm run test:parallel

npm run test:serial

npm run report
```

These commands represent the framework's standard execution strategy.

---

## Use npx for Direct Playwright Commands

Use `npx` when invoking Playwright directly with custom options:

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

### Simple Rule

```text
npm
 │
 └── Run predefined project commands

npx
 │
 └── Run Playwright directly with custom options
```

---

# Setup

The project can be run:

1. Locally on a developer machine
2. In GitHub Codespaces
3. In GitHub Actions

The application and test commands remain consistent across environments.

---

# Local Development Setup

## Prerequisites

The project requires:

* Node.js 24.x
* npm
* Git

Check the installed versions:

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

# Clone the Repository

To run the project locally:

```bash
git clone https://github.com/JFSoftwareServices/playwright-ts-automation.git

cd playwright-ts-automation
```

---

# Install Dependencies

Install the project dependencies:

```bash
npm install
```

Install Playwright browsers and required Linux system dependencies:

```bash
npx playwright install --with-deps
```

Create a local `.env` file containing the required environment variables.

The required variables are documented in `.env.example`.

---

# GitHub Codespaces

GitHub Codespaces provides a cloud-based development environment for working with the repository without requiring the project to be installed directly on a local machine.

## Open the Repository in Codespaces

Open the GitHub repository and select:

**Code → Codespaces → Create codespace on main**

The repository is automatically available inside the Codespace, so no `git clone` is required.

Once the Codespace starts, verify Node.js and npm:

```bash
node --version

npm --version
```

Then install dependencies:

```bash
npm install
```

Install Playwright browsers and required Linux dependencies:

```bash
npx playwright install --with-deps
```

Create the required `.env` file for local Codespace execution using the values documented in `.env.example`.

---

# Why Use `--with-deps`?

Codespaces normally run on Linux.

The command:

```bash
npx playwright install
```

downloads the Playwright browser binaries but does not necessarily install all operating-system libraries required by those browsers.

For Codespaces, containers and CI environments, use:

```bash
npx playwright install --with-deps
```

This installs the Playwright browsers together with the required Linux system dependencies.

If you encounter an error such as:

```text
error while loading shared libraries:

libatk-1.0.so.0: cannot open shared object file
```

run:

```bash
npx playwright install --with-deps
```

---

# Running Tests

## Run the Complete Suite

Recommended:

```bash
npm test
```

This uses the framework's parallel-first execution strategy and then executes serial tests.

---

# Run a Single Test File

Login tests:

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

Playwright runs tests whose titles match the supplied expression.

---

# Run Tests by Tag

Run serial tests:

```bash
npx playwright test --grep @serial
```

Run non-serial tests:

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

The framework is configured for cross-browser execution using Playwright browser projects.

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

To see the browser while tests are executing:

```bash
npx playwright test --headed
```

For an individual test:

```bash
npx playwright test tests/rahulshetty/login.spec.ts --headed
```

Headed execution normally requires a graphical display.

---

# Headed Mode in Codespaces and CI

Codespaces and many CI environments do not provide a graphical display server.

Running:

```bash
npx playwright test --headed
```

may result in:

```text
Missing X server or $DISPLAY
```

For normal Codespaces and CI execution, headless mode is recommended.

Where Xvfb is available, headed execution can be run using:

```bash
xvfb-run npx playwright test --headed
```

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

List only serial tests:

```bash
npx playwright test --list --grep @serial
```

List non-serial tests:

```bash
npx playwright test --list --grep-invert @serial
```

---

# Run with One Worker

For debugging concurrency and test-isolation issues:

```bash
npx playwright test --workers=1
```

This is useful for investigating whether tests behave differently when executed sequentially.

---

# Retries

The framework is configured to use retries in CI while avoiding automatic retries during normal local development.

For example:

```ts
retries: process.env.CI ? 2 : 0
```

This means:

```text
Local
  └── 0 retries

CI
  └── Up to 2 retries
```

Retries can also be enabled locally when investigating intermittent failures:

```bash
npx playwright test --retries=2
```

For example:

```bash
npx playwright test tests/rahulshetty/login.spec.ts --retries=2
```

Retries should not be used to hide genuine test failures or poor test synchronization.

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

The framework prefers Playwright's web-first assertions.

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

Condition-based synchronization provides more reliable tests and avoids unnecessary delays.

---

# Test Data Management

Test data is separated from test implementation.

For example:

```text
test-data/
├── order-data.ts
└── country-search-data.ts
```

This keeps test data reusable and prevents business data from being duplicated throughout test cases.

Example:

```ts
await pages.dashboardPage.addProductToCart(
    orderTestData.productName
);
```

---

# CI/CD – GitHub Actions

The framework uses **GitHub Actions** to automatically execute the Playwright test suite on:

* Pushes to the `main` branch
* Pull requests targeting `main`

## Pipeline Overview

```text
GitHub Push / Pull Request

          │
          ▼

    Checkout Code

          │
          ▼

    Setup Node.js 24

          │
          ▼

       npm ci

          │
          ▼

Install Playwright Browsers
      and Dependencies

          │
          ▼

 Run Parallel-Safe Tests

          │
          ▼

 Run Account-Mutating Tests
        Serially

          │
          ▼

 Upload Playwright Report
```

---

# CI Test Execution Strategy

The CI pipeline separates tests according to their ability to run safely in parallel.

## Parallel-Safe Tests

```bash
npm run test:parallel
```

Runs tests excluding the `@serial` tag.

These tests can use Playwright's configured worker count.

## Account-Mutating Tests

```bash
npm run test:serial
```

Runs tests tagged `@serial` using a single worker.

This reduces the risk of concurrent tests interfering with shared backend account state.

---

# CI Environment Variables

The CI workflow supplies environment variables to the Playwright test process.

Sensitive credentials are stored as **GitHub Actions Repository Secrets**.

For example:

```yaml
env:
  TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
  TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
```

The test framework accesses these through:

```ts
process.env.TEST_USER_EMAIL
process.env.TEST_USER_PASSWORD
```

The application URL is non-sensitive configuration and can be supplied by the workflow:

```yaml
env:
  BASE_URL: https://rahulshettyacademy.com
```

This allows the same source code to run in CI without requiring a committed `.env` file.

---

# Playwright HTML Report in CI

The Playwright HTML report is uploaded as a GitHub Actions artifact after the test run.

```yaml
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 14
```

`if: always()` ensures that the report is uploaded even when tests fail.

The report is retained for **14 days** and can be accessed from the corresponding GitHub Actions workflow run.

---

# CI Workflow

The workflow is located at:

```text
.github/
└── workflows/
    └── playwright.yml
```

The workflow:

1. Checks out the repository.
2. Configures Node.js 24.
3. Installs dependencies using `npm ci`.
4. Installs Playwright browsers and required system dependencies.
5. Executes parallel-safe tests.
6. Executes account-mutating tests serially.
7. Uploads the Playwright HTML report.

---

# CI Design Principles

The pipeline follows several principles:

* **Reproducible builds** — `npm ci` installs dependencies from `package-lock.json`.
* **Secure configuration** — sensitive credentials are supplied through GitHub Secrets.
* **Environment separation** — local configuration is supplied through `.env`, while CI configuration is supplied by the workflow environment.
* **Parallel execution** — independent tests execute concurrently.
* **Controlled shared state** — account-mutating tests can be isolated through serial execution.
* **Failure diagnostics** — Playwright reports are retained even when tests fail.
* **Automated quality gates** — tests execute automatically on pushes and pull requests.

---

# Troubleshooting

## Playwright Browser Fails to Start

If you see an error similar to:

```text
error while loading shared libraries:

libatk-1.0.so.0: cannot open shared object file
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

Test B → Expects cart to be empty
```

Although Test A and Test B have isolated browser contexts, they may still use the same backend account.

Consider:

* Separate test accounts
* Independent test data
* API-based setup where appropriate
* API-based cleanup where appropriate
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
| Run with retries             | `npx playwright test --retries=2`           |
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

The objective is to maximise execution speed while allowing genuinely state-dependent tests to execute in a controlled manner.

The `@serial` tag therefore represents an **explicit exception to the normal parallel execution model**, rather than making serial execution the default for the entire suite.

---

# Repository

GitHub repository:

https://github.com/JFSoftwareServices/playwright-ts-automation.git

# Playwright Documentation

https://playwright.dev
