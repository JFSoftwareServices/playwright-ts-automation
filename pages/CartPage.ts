import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly removeProductButtons: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.removeProductButtons = page.locator('button.btn.btn-danger');
    this.emptyCartMessage = page.getByRole('heading', {
      name: 'No Products in Your Cart !',
    });
  }

  getProductLocator(productName: string): Locator {
    return this.page.getByRole('heading', { name: productName });
  }

  async verifyProductIsDisplayed(productName: string): Promise<void> {
    await expect(this.getProductLocator(productName)).toBeVisible();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async clearCart(): Promise<void> {
    while (await this.removeProductButtons.count() > 0) {
      await this.removeProductButtons.first().click();
    }
  }

  async verifyCartEmpty(): Promise<void> {
    await expect(this.emptyCartMessage).toBeVisible();
  }
}
