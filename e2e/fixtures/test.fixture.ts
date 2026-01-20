import { test as base, Page } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { DashboardPage } from './pages/dashboard.page';
import { HeaderPage } from './pages/header.page';

/**
 * Custom test fixture that provides page objects
 * This fixture automatically initializes page objects for use in tests
 */
type TestFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  headerPage: HeaderPage;
};

/**
 * Extend Playwright test with custom fixtures
 */
export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  headerPage: async ({ page }, use) => {
    const headerPage = new HeaderPage(page);
    await use(headerPage);
  },
});

export { expect } from '@playwright/test';
