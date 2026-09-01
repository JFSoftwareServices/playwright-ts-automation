import { test, expect } from '@playwright/test';
import { Pages } from '../../pages/Pages';
import { validLoginData } from '../../test-data/login-data';
import { orderTestData } from '../../test-data/order-data';
import { countrySearchData } from '../../test-data/country-search-data';

// This journey performs real UI login, so it must start logged out.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Journey: Login → Browse → Purchase', { tag: '@serial' }, () => {
    let pages: Pages;

    test.beforeEach(async ({ page }) => {
        pages = new Pages(page);
        await page.goto('https://rahulshettyacademy.com/client/');
    });

    test('logs in, adds a product to cart, and completes checkout', async () => {
        const { username, password } = validLoginData;
        const { productName } = orderTestData;
        const { countryCode, countryName } = countrySearchData;

        await pages.loginPage.login(username, password);
        await pages.headerComponent.verifyLoggedIn();

        await pages.dashboardPage.addProductToCart(productName);
        await pages.headerComponent.navigateToCart();
        await pages.cartPage.verifyProductIsDisplayed(productName);

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
