import { expect, Locator, Page } from '@playwright/test';

export class HeaderComponent {
    readonly page: Page;
    readonly homeLink: Locator;
    readonly ordersButton: Locator;
    readonly cartLink: Locator;
    readonly signOutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.homeLink = page.getByRole('link', { name: 'Home' });
        this.ordersButton = page.locator("button[routerlink*='myorders']");
        this.cartLink = page.locator("[routerlink*='cart']");
        this.signOutButton = page.getByRole('button', { name: 'Sign Out' });
    }

    async goHome(): Promise<void> {
        await this.homeLink.click();
    }

    async navigateToOrders(): Promise<void> {
        await this.ordersButton.click();
    }

    async navigateToCart(): Promise<void> {
        await this.cartLink.click();
    }

    async signOut(): Promise<void> {
        await this.signOutButton.click();
    }

    async verifyLoggedIn(): Promise<void> {
        await expect(this.signOutButton).toBeVisible();
    }
}