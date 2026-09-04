import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { OrdersHistoryPage } from './OrdersHistoryPage';
import { OrdersReviewPage } from './OrdersReviewPage';
import { CartPage } from './CartPage';
import { HeaderComponent } from './components/HeaderComponent';

/** 
 * Central access point for all page objects and components. 
 * All objects use the same Playwright Page (browser tab) 
 * provided by the test. 
 */
export class Pages {
  readonly page: Page;
  readonly loginPage: LoginPage;
  readonly dashboardPage: DashboardPage;
  readonly ordersHistoryPage: OrdersHistoryPage;
  readonly ordersReviewPage: OrdersReviewPage;
  readonly cartPage: CartPage;
  readonly headerComponent: HeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.ordersHistoryPage = new OrdersHistoryPage(page);
    this.ordersReviewPage = new OrdersReviewPage(page);
    this.cartPage = new CartPage(page);
    this.headerComponent = new HeaderComponent(page);
  }
}