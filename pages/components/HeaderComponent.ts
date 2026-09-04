import { expect, Locator, Page } from '@playwright/test';

export class HeaderComponent {

    readonly page: Page
    readonly homeLink: Locator;
    readonly ordersButton: Locator;
    readonly cartButton: Locator;
    readonly signOutButton: Locator;

    constructor(page: Page) {

        this.page = page;

        this.homeLink = page.locator(
            'button[routerlink="/dashboard"]'
        );

        this.ordersButton = page.locator(
            'button[routerlink="/dashboard/myorders"]'
        );

        this.cartButton = page.locator(
            'button[routerlink="/dashboard/cart"]'
        );

        this.signOutButton = page.getByRole(
            'button',
            { name: 'Sign Out' }
        );
    }

    async goHome(): Promise<void> {

        await this.homeLink.click();

        await expect(this.page).toHaveURL(
            /#\/dashboard\/dash$/
        );

        await expect(
            this.page.getByRole('heading', {
                name: 'Filters'
            })
        ).toBeVisible();
    }

    async navigateToOrders(): Promise<void> {

        await this.ordersButton.click();

        await expect(this.page).toHaveURL(
            /#\/dashboard\/myorders$/
        );

        await expect(
            this.page.getByRole('heading', {
                name: 'Your Orders'
            })
        ).toBeVisible();
    }

    async navigateToCart(): Promise<void> {

        await this.cartButton.click();

        await expect(this.page).toHaveURL(
            /#\/dashboard\/cart$/
        );

        await expect(
            this.page.getByRole('heading', {
                name: 'My Cart'
            })
        ).toBeVisible();
    }

    async signOut(): Promise<void> {

        await this.signOutButton.click();

    }

    async verifyLoggedIn(): Promise<void> {

        await expect(
            this.signOutButton
        ).toBeVisible();

    }
}
