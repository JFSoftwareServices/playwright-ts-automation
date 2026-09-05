import { test, expect } from '../../fixtures/test';
import { orderTestData } from '../../test-data/order-data';

test.describe('Journey: Cart Contents and Removal', { tag: '@serial' }, () => {

    // Since authentication is handled by globalSetup, 
    // LoginPage.goTo() redirects authenticated users to the dashboard.
    test.beforeEach(async ({ pages }) => {
        await pages.loginPage.goTo();

        await pages.dashboardPage.addProductToCart(
            orderTestData.productName
        );
    });

    test('displays the correct product and total', async ({ pages }) => {
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

    test('removes item from cart', async ({ pages }) => {
        await pages.headerComponent.navigateToCart();

        await expect(
            pages.cartPage.productLocators
        ).toHaveCount(1);

        await pages.cartPage.removeFromCart(
            orderTestData.productName
        );

        await pages.cartPage.verifyCartEmpty();
    });
});