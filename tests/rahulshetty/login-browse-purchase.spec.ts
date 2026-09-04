import { test, expect } from '../../fixtures/test';
import { orderTestData } from '../../test-data/order-data';
import { countrySearchData } from '../../test-data/country-search-data';

// This journey performs real UI login, so it must start logged out.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Journey: Login → Browse → Purchase', { tag: '@serial' }, () => {
    // LoginPage.goTo() redirects non-authenticated users to the login page.
    test.beforeEach(async ({ pages }) => {
        await pages.loginPage.goTo();
    });

    test('logs in, adds a product to cart, and completes checkout', async ({ pages }) => {
        const username = process.env.TEST_USER_EMAIL;
        const password = process.env.TEST_USER_PASSWORD;

        if (!username || !password) {
            throw new Error(
                'TEST_USER_EMAIL and TEST_USER_PASSWORD must be configured'
            );
        }

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
