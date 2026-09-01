import { expect, test } from '@playwright/test';
import { Pages } from '../../pages/Pages';
import { orderTestData } from '../../test-data/order-data';

test.describe('Journey: Cart Contents and Removal', { tag: '@cart' }, () => {
    let pages: Pages;

    // Authentication is handled by globalSetup.
    test.beforeEach(async ({ page }) => {
        pages = new Pages(page);

        await page.goto('https://rahulshettyacademy.com/client/');

        await pages.dashboardPage.addProductToCart(
            orderTestData.productName
        );
    });

    test('displays the correct product and total', async () => {
        await pages.headerComponent.navigateToCart();

        await expect(
            pages.cartPage.productLocators
        ).toHaveCount(1);

        const productNames = await pages.cartPage.getProductNames();

        expect(productNames).toContain(
            orderTestData.productName
        );

        const total = await pages.cartPage.getTotalValue();

        expect(total).toBe(
            orderTestData.productPrice
        );
    });

    test('removes item from cart', async () => {
        await pages.headerComponent.navigateToCart();

        await expect(
            pages.cartPage.productLocators
        ).toHaveCount(1);

        await pages.cartPage.removeFromCart(
            orderTestData.productName
        );

        await pages.cartPage.verifyCartEmpty();
    });

    test.afterEach(async () => {
        // TODO: Clear the cart via API to ensure test isolation if a test fails.
    });
});