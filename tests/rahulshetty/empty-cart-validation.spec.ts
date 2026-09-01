import { test } from '@playwright/test';
import { Pages } from '../../pages/Pages';

test.describe('Journey: Empty Cart Validation', { tag: '@serial' }, () => {
    let pages: Pages;
    // Authentication is handled by globalSetup before the test suite starts.
    // globalSetup logs in via the API, injects the JWT into localStorage,
    // navigates to the dashboard, and saves the authenticated state to storageState.json.
    // This test therefore starts already authenticated and does not perform UI login.
    test.beforeEach(async ({ page }) => {
        pages = new Pages(page);
        await page.goto('https://rahulshettyacademy.com/client/#/dashboard/dash');
        await pages.headerComponent.navigateToCart();
        await pages.cartPage.clearCart();
    });

    test('shows appropriate state when cart is empty', async () => {
        await pages.cartPage.verifyCartEmpty();
    });
});