import { test, expect } from '@playwright/test';
import { Pages } from '../../pages/Pages';
import { validLoginData } from '../../test-data/login-data';
import { orderTestData } from '../../test-data/order-data';
import { countrySearchData } from '../../test-data/country-search-data';

// This journey performs real UI login as part of the flow, so it must start
// logged out rather than inheriting the pre-authenticated storageState used
// by other test files.
//test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Journey: Browse → Purchase', () => {
    let pages: Pages;

    test.beforeEach(async ({ page }) => {
        pages = new Pages(page);
        await page.goto('https://rahulshettyacademy.com/client/');
    });

    test('adds a product to cart, and completes checkout', async () => {
        const { username, password } = validLoginData;
        const { productName } = orderTestData;
        const { countryCode, countryName } = countrySearchData;

        // Login
        await pages.loginPage.login(username, password);
        await pages.headerComponent.verifyLoggedIn();

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