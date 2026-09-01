import { test, expect } from '@playwright/test';
import { Pages } from '../../pages/Pages';
import { orderTestData } from '../../test-data/order-data';
import { countrySearchData } from '../../test-data/country-search-data';

test.describe('Journey: Order History Lookup', { tag: '@serial' }, () => {
    let pages: Pages;
    // Authentication is handled by globalSetup before the test suite starts.
    // globalSetup logs in via the API, injects the JWT into localStorage,
    // navigates to the dashboard, and saves the authenticated state to storageState.json.
    // This test therefore starts already authenticated and does not perform UI login.
    test.beforeEach(async ({ page }) => {
        pages = new Pages(page);
        await page.goto('https://rahulshettyacademy.com/client/#/dashboard/dash');
    });

    test('finds a completed order in order history', async () => {
        const { productName } = orderTestData;
        const { countryCode, countryName } = countrySearchData;

        await pages.dashboardPage.addProductToCart(productName);
        await pages.headerComponent.navigateToCart();
        await pages.cartPage.checkout();
        await pages.ordersReviewPage.searchCountry(countryCode);
        await pages.ordersReviewPage.selectCountry(countryName);
        await pages.ordersReviewPage.submit();
        await pages.ordersReviewPage.verifyOrderConfirmation();

        const orderId = await pages.ordersReviewPage.getOrderId();
        if (!orderId) {
            throw new Error('Expected an order ID after checkout, but got null.');
        }

        await pages.headerComponent.navigateToOrders();
        await pages.ordersHistoryPage.selectOrder(orderId);

        const historyOrderId = await pages.ordersHistoryPage.getOrderId();
        expect(historyOrderId).toBe(orderId);
    });
});