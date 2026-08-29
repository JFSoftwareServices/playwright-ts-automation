import { test, expect } from '@playwright/test';

test.describe('Login Practice Page - Form Controls', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  });

  test('selects dropdown option', async ({ page }) => {
    const dropdown = page.locator('select.form-control');
    await dropdown.selectOption('consult');
    await expect(dropdown).toHaveValue('consult');
  });

  test('confirms radio selection via popup dialog', async ({ page }) => {
    const userRadio = page.locator('.radiotextsty').last();
    await userRadio.click();
    await page.locator('#okayBtn').click();
    await expect(userRadio).toBeChecked();
  });

  test('checks and unchecks terms checkbox', async ({ page }) => {
    const terms = page.locator('#terms');
    await terms.click();
    await expect(terms).toBeChecked();
    await terms.uncheck();
    await expect(terms).not.toBeChecked();
  });

  test('verifies blinking text class on document request link', async ({ page }) => {
    // Substring match used since the full href/locale prefix may vary across environments.
    const documentLink = page.locator("[href*='documents-request']");
    await expect(documentLink).toHaveAttribute('class', 'blinkingText');
  });

});