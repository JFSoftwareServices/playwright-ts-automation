import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { HeaderComponent } from '../../pages/Components/HeaderComponent';
import { validLoginData, invalidLoginData } from '../../test-data/login-data';

//test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login - UI Form Submission', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/client/');
  });

  test('logs in successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(validLoginData.username, validLoginData.password);
    const headerComponent = new HeaderComponent(page);
    await headerComponent.verifyLoggedIn();
  });

  test('shows an error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(invalidLoginData.username, invalidLoginData.password);
    await expect(page.getByRole('alert', { name: 'Incorrect email or password.' })).toBeVisible();
  });
});