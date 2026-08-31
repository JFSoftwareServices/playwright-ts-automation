import { Locator, Page } from '@playwright/test';

export class OrdersHistoryPage {
  readonly page: Page;
  readonly ordersTable: Locator;
  readonly rows: Locator;
  readonly orderIdDetails: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ordersTable = page.locator('tbody');
    this.rows = page.locator('tbody tr');
    this.orderIdDetails = page.locator('.col-text');
  }

  async findOrderRow(orderId: string): Promise<Locator> {
    await this.ordersTable.waitFor();

    const matchingRow = this.rows.filter({
      has: this.page.locator('th', { hasText: orderId }),
    });

    const count = await matchingRow.count();
    if (count === 0) {
      throw new Error(`Order "${orderId}" not found in order history.`);
    }

    return matchingRow;
  }

  async selectOrder(orderId: string): Promise<void> {
    const row = await this.findOrderRow(orderId);
    await row.locator('button').first().click();
  }

  async getOrderId(): Promise<string | null> {
    return this.orderIdDetails.textContent();
  }
}