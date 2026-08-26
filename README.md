# Playwright TS Automation

A TypeScript-based end-to-end test automation framework built with [Playwright](https://playwright.dev), combining native Playwright Test with Cucumber (BDD) support. This project is intended as a demonstration of automation engineering practices — page object structure, CI/CD integration, and reporting — across a range of public practice sites.

## Overview

This framework covers automated UI test coverage for:
- [the-internet.herokuapp.com](https://the-internet.herokuapp.com) — classic UI test scenarios (forms, alerts, dynamic content, etc.)
- [demoqa.com](https://demoqa.com) — widget and component-heavy interactions
- [rahulshettyacademy.com](https://rahulshettyacademy.com) — practice site and ShopClient end-to-end purchase flow

## Tech Stack

- **Language:** TypeScript
- **Test Runner:** Playwright Test
- **BDD:** Cucumber (`@cucumber/cucumber`)
- **CI/CD:** GitHub Actions, Jenkins
- **Hosting/Execution:** AWS (parallel test execution)

## Project Structure

```
playwright-ts-automation/
├── tests/                  # Native Playwright Test specs
├── features/               # Cucumber feature files (Gherkin)
├── step-definitions/       # Cucumber step implementations
├── pages/                  # Page Object Model classes
├── utils/                  # Shared helpers/utilities
├── playwright.config.ts    # Playwright configuration
├── cucumber.js             # Cucumber configuration
├── package.json
└── README.md
```

> Adjust this tree to match your actual folder layout as the project evolves.

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

## Running Tests

### Native Playwright tests

Run the full suite (headless by default):
```bash
npx playwright test
```

Run a single test file:
```bash
npx playwright test tests/example.spec.ts
```

Run a single test by name (matches the test title):
```bash
npx playwright test -g "has title"
```

Run on a specific browser/project:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

Combine flags — e.g. a single test, on one browser, headless (explicit):
```bash
npx playwright test tests/example.spec.ts --project=chromium --headed=false
```

Run in headed mode (requires a display — see note below):
```bash
npx playwright test --headed
```
> `--headed` requires an actual display server. It will fail in headless environments like Codespaces or CI
> runners with a "Missing X server or $DISPLAY" error unless run via `xvfb-run npx playwright test --headed`.
> For local machines with a screen, `--headed` works directly and is useful for visual debugging.

Run in debug mode (step through with Playwright Inspector):
```bash
npx playwright test --debug
```

### Cucumber (BDD) tests

```bash
npm run test:cucumber
```

> Add this script to `package.json` once Cucumber is wired up, e.g.:
> ```json
> "scripts": {
>   "test:cucumber": "cucumber-js"
> }
> ```

### View the HTML report

```bash
npx playwright show-report
```

## Continuous Integration

This project runs automated tests via:
- **GitHub Actions** — on push/PR, executing the full suite across browsers
- **Jenkins** — pipeline job supporting scheduled and on-demand runs
- **AWS** — parallel execution across multiple runners to reduce total suite time

Workflow/pipeline configuration files:
- `.github/workflows/playwright.yml`
- `Jenkinsfile`

## Author

Built and maintained by **Jide** ([JFSoftwareServices](https://github.com/JFSoftwareServices)) — SDET with a background spanning financial services test automation (Deutsche Bank, Goldman Sachs, HSBC, American Express, BBVA, Yoox Net-A-Porter).

This project is intended as a portfolio piece demonstrating framework design, BDD integration, and CI/CD pipeline setup for automated testing.
