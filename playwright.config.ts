import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.
// Never commit a real .env file.
dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

export default defineConfig({
  // ============================================================
  // TEST DISCOVERY
  // ============================================================

  testDir: './tests',

  // ============================================================
  // TIMEOUTS
  // ============================================================

  // Maximum duration of an individual test.
  timeout: 30_000,

  // Maximum time Playwright retries an assertion.
  expect: {
    timeout: 5_000,
  },

  // ============================================================
  // AUTHENTICATION
  // ============================================================

  // Logs in via API, injects the JWT into localStorage,
  // navigates to the dashboard and saves the authenticated
  // state to storageState.json.
  globalSetup: require.resolve('./global-setup.ts'),

  // ============================================================
  // EXECUTION
  // ============================================================

  // Allow tests to run in parallel.
  fullyParallel: true,

  // Prevent accidental test.only usage in CI.
  forbidOnly: !!process.env.CI,

  // Retry failed tests only in CI.
  retries: process.env.CI ? 2 : 0,

  // ============================================================
  // REPORTING
  // ============================================================

  reporter: 'html',

  // ============================================================
  // SHARED TEST SETTINGS
  // ============================================================

  use: {
    // Reuse the authenticated state created by globalSetup.
    storageState: 'storageState.json',

    // Maximum duration of an individual Playwright action.
    actionTimeout: 10_000,

    // Maximum duration of a navigation operation.
    navigationTimeout: 30_000,

    // Capture trace when a test is retried.
    trace: 'on-first-retry',

    // Capture screenshots only when a test fails.
    screenshot: 'only-on-failure',

    // Retain video when a test fails.
    video: 'retain-on-failure',
  },

  // ============================================================
  // BROWSER PROJECTS
  // ============================================================

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
});
