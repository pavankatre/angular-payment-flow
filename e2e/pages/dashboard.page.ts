import { Page, Locator } from '@playwright/test';

/**
 * Dashboard Page Object
 * Contains all selectors and methods related to dashboard functionality
 */
export class DashboardPage {
  readonly page: Page;

  // Selectors
  readonly dashboardContainer: Locator;
  readonly userTable: Locator;
  readonly searchInput: Locator;
  readonly userRows: Locator;
  readonly loadingSpinner: Locator;
  readonly errorAlert: Locator;
  readonly retryButton: Locator;
  readonly sortHeaders: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize selectors
    this.dashboardContainer = page.locator('app-users-dashboard');
    this.userTable = page.locator('table');
    this.searchInput = page.locator('input[placeholder*="search"]');
    this.userRows = page.locator('tbody tr');
    this.loadingSpinner = page.locator('.loading-spinner');
    this.errorAlert = page.locator('.error-alert');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.sortHeaders = page.locator('th button');
  }

  /**
   * Navigate to dashboard
   */
  async goto() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to users page
   */
  async gotoUsers() {
    await this.page.goto('/users');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get number of users displayed
   */
  async getUserCount() {
    return await this.userRows.count();
  }

  /**
   * Search for user by term
   */
  async searchUser(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    await this.page.waitForTimeout(400); // Wait for debounce
  }

  /**
   * Check if loading is visible
   */
  async isLoading() {
    return await this.loadingSpinner.isVisible();
  }

  /**
   * Check if error is visible
   */
  async isErrorVisible() {
    return await this.errorAlert.isVisible();
  }

  /**
   * Get error message
   */
  async getErrorMessage() {
    return await this.errorAlert.textContent();
  }

  /**
   * Click retry button
   */
  async clickRetry() {
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Sort by column
   */
  async sortByColumn(columnIndex: number) {
    await this.sortHeaders.nth(columnIndex).click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Get user data from table
   */
  async getUserData(rowIndex: number) {
    const row = this.userRows.nth(rowIndex);
    const cells = row.locator('td');

    return {
      name: await cells.nth(0).textContent(),
      email: await cells.nth(1).textContent(),
      phone: await cells.nth(2).textContent(),
    };
  }

  /**
   * Wait for dashboard to load
   */
  async waitForLoad() {
    await this.dashboardContainer.waitFor({ state: 'visible' });
    await this.page.waitForLoadState('networkidle');
  }
}
