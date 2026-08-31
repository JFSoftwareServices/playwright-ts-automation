import { test, expect } from '@playwright/test';
import { Pages } from '../../pages/Pages';
import { validLoginData } from '../../test-data/login-data';
import { orderTestData } from '../../test-data/order-data';
import { countrySearchData } from '../../test-data/country-search-data';

// Authentication is handled by globalSetup before the test suite starts.
// globalSetup logs in via the API, injects the JWT into localStorage,
// navigates to the dashboard, and saves the authenticated state to storageState.json.
// This test therefore starts already authenticated and does not perform UI login.

test.describe('Journey: Browse → Purchase', () => {
    let pages: Pages;

    test.beforeEach(async ({ page }) => {
        pages = new Pages(page);
        await page.goto('https://rahulshettyacademy.com/client/');
    });

    test('adds a product to cart, and completes checkout', async () => {
        const { username } = validLoginData;
        const { productName } = orderTestData;
        const { countryCode, countryName } = countrySearchData;

        // Browse
        await pages.dashboardPage.addProductToCart(productName);
        await pages.headerComponent.navigateToCart();
        await pages.cartPage.verifyProductIsDisplayed(productName);

        // Purchase
        await pages.cartPage.checkout();
        await pages.ordersReviewPage.searchCountry(countryCode);
        await pages.ordersReviewPage.selectCountry(countryName);
        await pages.ordersReviewPage.verifyEmailIdMatches(username);
        await pages.ordersReviewPage.submit();
        await pages.ordersReviewPage.verifyOrderConfirmation();

        const orderId = await pages.ordersReviewPage.getOrderId();
        expect(orderId).toBeTruthy();
    });
});
