import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { HeaderComponent } from '../../pages/Components/HeaderComponent';
import {
  validLoginData,
  invalidLoginData
} from '../../test-data/login-data';

// Authentication is handled by globalSetup before the test suite starts.
// globalSetup logs in via the API, injects the JWT into localStorage,
// navigates to the dashboard, and saves the authenticated state to storageState.json.
//
// This test suite overrides that authenticated state because it specifically
// tests the real UI login flow from a logged-out state.
test.use({
  storageState: {
    cookies: [],
    origins: []
  }
});

test.describe('Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client/');
  });

  test('logs in successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(
      validLoginData.username,
      validLoginData.password
    );

    const headerComponent = new HeaderComponent(page);
    await headerComponent.verifyLoggedIn();
  });

  test('shows an error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(
      invalidLoginData.username,
      invalidLoginData.password
    );

    await expect(
      page.getByRole('alert', {
        name: 'Incorrect email or password.'
      })
    ).toBeVisible();
  });
});
