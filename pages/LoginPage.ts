import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly signInButton: Locator;
    readonly usernameField: Locator;
    readonly passwordField: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signInButton = page.getByRole('button', { name: 'Login' });
        this.usernameField = page.getByRole('textbox', { name: 'email@example.com' });
        this.passwordField = page.getByPlaceholder('enter your passsword');
    }

    async goTo(): Promise<void> {
        await this.page.goto('https://rahulshettyacademy.com/client');
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.signInButton.click();
    }
}