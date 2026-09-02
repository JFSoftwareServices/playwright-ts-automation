import { test, expect } from '../../fixtures/test';

test.describe('Journey: Sign Out and Session Boundary', () => {
  test('signs out and prevents access to authenticated pages', async ({ page, pages }) => {

    // Authentication is handled by globalSetup.
    await page.goto(
      'https://rahulshettyacademy.com/client/#/dashboard/dash'
    );

    // Sign out and verify the session has ended.
    await pages.headerComponent.signOut();

    await expect(page).toHaveURL(/login/);
    await expect(
      page.getByRole('heading', { name: 'Log in' })
    ).toBeVisible();

    // Verify authenticated pages cannot be accessed after sign out.
    await page.goto(
      'https://rahulshettyacademy.com/client/#/dashboard/dash'
    );

    await expect(page).toHaveURL(/login/);
    await expect(
      page.getByRole('heading', { name: 'Log in' })
    ).toBeVisible();
  });
});
