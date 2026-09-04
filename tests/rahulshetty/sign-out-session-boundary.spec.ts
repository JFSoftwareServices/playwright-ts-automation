import { test, expect } from '../../fixtures/test';

test.describe('Journey: Sign Out and Session Boundary', () => {
  test('signs out and prevents access to authenticated pages', async ({ page, pages }) => {

    // Since authentication is handled by globalSetup, 
    // LoginPage.goTo() redirects authenticated users to the dashboard.
    await pages.loginPage.goTo();

    // Sign out and verify the session has ended.
    await pages.headerComponent.signOut();

    await expect(page).toHaveURL(/login/);
    await expect(
      page.getByRole('heading', { name: 'Log in' })
    ).toBeVisible();

    // Verify authenticated pages cannot be accessed after sign out.
    await pages.loginPage.goTo();

    await expect(page).toHaveURL(/login/);
    await expect(
      page.getByRole('heading', { name: 'Log in' })
    ).toBeVisible();
  });
});
