import { expect, Locator, Page } from '@playwright/test';

export class OrdersReviewPage {
    readonly countryField: Locator;
    readonly countryResultsDropdown: Locator;
    readonly emailIdLabel: Locator;
    readonly submitLink: Locator;
    readonly orderConfirmationText: Locator;
    readonly orderIdLabel: Locator;

    constructor(page: Page) {
        this.countryField = page.getByPlaceholder('Select Country');
        this.countryResultsDropdown = page.locator('.ta-results');
        this.emailIdLabel = page.locator('.user__name label');
        this.submitLink = page.locator('a:has-text("PLACE ORDER")');
        this.orderConfirmationText = page.locator('.hero-primary');
        this.orderIdLabel = page.locator('.em-spacer-1 .ng-star-inserted');
    }

    async searchCountry(countryCode: string): Promise<void> {
        await this.countryField.pressSequentially(countryCode);
        await this.countryResultsDropdown.waitFor();
    }

    async selectCountry(countryName: string): Promise<void> {
        const option = this.countryResultsDropdown.getByText(countryName, { exact: true })
        await option.click();
    }

    async searchCountryAndSelect(countryCode: string, countryName: string): Promise<void> {
        await this.searchCountry(countryCode);
        await this.selectCountry(countryName);
    }

    async verifyEmailIdMatches(expectedEmail: string): Promise<void> {
        await expect(this.emailIdLabel).toHaveText(expectedEmail);
    }

    async submit(): Promise<void> {
        await this.submitLink.click();
    }

    async verifyOrderConfirmation(expectedText = 'Thankyou for the order.'): Promise<void> {
        await expect(this.orderConfirmationText).toHaveText(expectedText);
    }

    async getOrderId(): Promise<string | null> {
        const rawText = await this.orderIdLabel.textContent();
        if (!rawText) {
            return null;
        }
        return rawText.replace(/\|/g, '').trim();
    }
}