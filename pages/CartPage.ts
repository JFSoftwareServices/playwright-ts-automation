import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async verifyProductIsDisplayed(productName: string): Promise<void> {
    await expect(this.getProductLocator(productName)).toBeVisible();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  getProductLocator(productName: string): Locator {
    return this.page.getByRole('heading', { name: productName });
  }
}