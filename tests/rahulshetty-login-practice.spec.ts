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

/**
 * Verifies child window (new tab) handling: clicking the document request
 * link opens a new browser context page containing an email address in red
 * text; extracts the domain from that email and fills it into the username
 * field on the original page.
 */
test('@Child window handling - extract domain from popup and fill username field', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

  const userName = page.locator('#username');
  const documentLink = page.locator("[href*='documents-request']");

  // Wait for the new tab/child window to open when the document link is clicked
  const [newPage] = await Promise.all([
    context.waitForEvent('page'), // listens for a new page/tab being created
    documentLink.click(),
  ]);

  const text = await newPage.locator('.red').textContent();

  if (!text) {
    throw new Error('Expected ".red" element to contain email text, but got null/empty.');
  }

  const domain = text.split('@')[1].split(' ')[0];

  await userName.fill(domain);
  await expect(userName).toHaveValue(domain);
});