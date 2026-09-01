import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly checkoutButton: Locator;
    readonly emptyCartMessage: Locator;
    readonly totalValue: Locator;
    readonly productLocators: Locator;

    constructor(page: Page) {
        this.page = page;

        this.checkoutButton = page.getByRole('button', {
            name: 'Checkout',
        });

        this.emptyCartMessage = page.getByRole('heading', {
            name: 'No Products in Your Cart !',
        });

        this.totalValue = page
            .locator('li.totalRow')
            .filter({
                has: page.getByText('Total', {
                    exact: true,
                }),
            })
            .locator('.value');

        this.productLocators = page.locator(
            'ul.cartWrap > li'
        );
    }

    private getProductLocator(productName: string): Locator {
        return this.page.getByRole('heading', {
            name: productName,
        });
    }

    async getTotalValue(): Promise<number> {
        await expect(this.totalValue).toBeVisible();

        const value = await this.totalValue.textContent();

        return Number(
            value?.replace('$', '').trim() ?? 0
        );
    }

    async getProductCount(): Promise<number> {
        return await this.productLocators.count();
    }

    async getProductNames(): Promise<string[]> {
        return await this.productLocators
            .getByRole('heading')
            .allTextContents();
    }

    async verifyProductIsDisplayed(
        productName: string
    ): Promise<void> {
        await expect(
            this.getProductLocator(productName)
        ).toBeVisible();
    }

    async checkout(): Promise<void> {
        await this.checkoutButton.click();
    }

    /**
     * Removes a product from the cart.
     * Expects exactly one matching product to be present.
     */
    async removeFromCart(productName: string): Promise<void> {
        const product = this.productLocators.filter({
            hasText: productName,
        });

        await expect(product).toHaveCount(1);

        const removeButton = product.locator(
            'button.btn.btn-danger'
        );

        await removeButton.click();

        await expect(product).toHaveCount(0);
    }

    async verifyCartEmpty(): Promise<void> {
        await expect(
            this.emptyCartMessage
        ).toBeVisible();
    }
}
