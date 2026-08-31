import { expect, Locator, Page } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly productCards: Locator;
    readonly productTitles: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productCards = page.locator('.card-body');
        this.productTitles = page.locator('.card-body b');
    }

    async findProduct(productName: string): Promise<Locator> {
        const matchingCard = this.productCards.filter({
            hasText: productName,
        });

        await expect(matchingCard).toHaveCount(1);

        return matchingCard;
    }

    async addProductToCart(productName: string): Promise<void> {
        const product = await this.findProduct(productName);
        await product.getByRole('button', { name: 'Add To Cart' }).click();
    }
}