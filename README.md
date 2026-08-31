# Playwright TS Automation

A TypeScript-based UI test automation framework built with [Playwright](https://playwright.dev), using the Page Object Model. Covers practice/demo sites as a working demonstration of framework structure, locator strategy, and test design.

## Overview

Current test coverage:
- **rahulshettyacademy.com** — login practice page (form controls, child window handling), Angular practice page (form controls with special locators), and client login flow (UI login — happy and sad path)
- **Locator/timeout technique demos** — special locators and custom `expect` timeout configuration

BDD (Cucumber), full multi-site coverage (the-internet.herokuapp.com, demoqa.com), and CI/CD pipelines are planned — see [Roadmap](#roadmap).

## Tech Stack

- **Language:** TypeScript
- **Test Runner:** Playwright Test

## Project Structure

```
playwright-ts-automation/
├── pages/
│   └── LoginPage.ts
├── test-data/
│   └── login-data.ts
├── tests/
│   ├── example.spec.ts                    # Playwright scaffold smoke test — kept as a quick
│   │                                       # sanity check that install/config work after
│   │                                       # upgrading libraries or tooling
│   ├── timeouts.spec.ts                   # Special locators, custom expect timeout demo
│   └── rahulshetty/
│       ├── login.spec.ts                  # Client app login — UI happy + sad path
│       ├── login-practice-controls.ts     # (!) see note below
│       ├── login-practice-child-window.spec.ts
│       └── angular-practice.spec.ts
├── global-setup.ts
├── .env.example
├── .gitignore
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

> **(!)** `login-practice-controls.ts` is missing the `.spec` suffix required for Playwright's default test
> discovery — it won't currently be picked up by `npx playwright test`. Rename to
> `login-practice-controls.spec.ts` if this is meant to run as a test file.

## Setup

> **Using GitHub Codespaces?** Just open this repo in a Codespace — Node.js is preinstalled, so you can
> skip straight to `npm install` in the Installation section below.

### Prerequisites
- Node.js 24.x (LTS) — [download here](https://nodejs.org) or install via [nvm](https://github.com/nvm-sh/nvm):
  ```bash
  nvm install 24
  nvm use 24
  ```
- npm (bundled with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/JFSoftwareServices/playwright-ts-automation.git
cd playwright-ts-automation

# Install project dependencies
npm install

# Install Playwright browsers + required OS-level dependencies
npx playwright install --with-deps
```

> **Note (containers/Codespaces/CI only):** `npx playwright install` alone only downloads the browser
> binaries — it does **not** install the system libraries (e.g. `libatk`, `libnss3`, `libgbm`) that headless
> Chromium needs to actually launch on Linux. If you're running this in a fresh container, GitHub Codespace,
> or CI runner and see an error like:
>
> ```
> error while loading shared libraries: libatk-1.0.so.0: cannot open shared object file
> ```
>
> run `npx playwright install --with-deps` (or `sudo npx playwright install-deps` if browsers are already
> installed) to pull in the missing OS dependencies. This typically won't happen on a standard desktop OS.

### Environment variables

The login test (`tests/rahulshetty/login.spec.ts`) and `global-setup.ts` require a test account for `rahulshettyacademy.com/client`. Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

```
TEST_USER_EMAIL=your-test-account@example.com
TEST_USER_PASSWORD=your-password
```

`.env` is git-ignored and never committed — see `.env.example` for the required keys only.

## Running Tests

### Run the full suite (headless by default)
```bash
npx playwright test
```

### Run a single test file
```bash
npx playwright test tests/rahulshetty/login.spec.ts
```

### Run a single test by name
```bash
npx playwright test -g "logs in successfully"
```

### Run on a specific browser/project
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run in headed mode (requires a display)
```bash
npx playwright test --headed
```
> `--headed` requires an actual display server. It will fail in headless environments like Codespaces or CI
> runners with a "Missing X server or $DISPLAY" error unless run via `xvfb-run npx playwright test --headed`.
> For local machines with a screen, `--headed` works directly and is useful for visual debugging.

### Run in debug mode (step through with Playwright Inspector)
```bash
npx playwright test --debug
```

### View the HTML report
```bash
npx playwright show-report
```

## Roadmap

Planned additions, not yet implemented:
- Full page object coverage for the ShopClient order flow (dashboard, cart, checkout, order history)
- Test coverage for the-internet.herokuapp.com and demoqa.com
- Cucumber (BDD) integration alongside native Playwright specs
- CI/CD via GitHub Actions and Jenkins
- Parallel test execution on AWS
