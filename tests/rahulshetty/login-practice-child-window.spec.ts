import { test, expect } from '@playwright/test';

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