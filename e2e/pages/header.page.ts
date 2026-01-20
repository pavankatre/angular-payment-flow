import { Page, Locator } from '@playwright/test';

/**
 * Header Page Object
 * Contains all selectors and methods related to header/navigation functionality
 */
export class HeaderPage {
  readonly page: Page;

  // Selectors
  readonly header: Locator;
  readonly logo: Locator;
  readonly paymentLink: Locator;
  readonly summaryLink: Locator;
  readonly usersLink: Locator;
  readonly profileButton: Locator;
  readonly profileMenu: Locator;
  readonly logoutButton: Locator;
  readonly userNameDisplay: Locator;
  readonly userEmailDisplay: Locator;
  readonly userRoleBadge: Locator;
  readonly mobileMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize selectors
    this.header = page.locator('app-header');
    this.logo = page.locator('app-header .logo h1');
    this.paymentLink = page.locator('a[routerLink="/payment"]');
    this.summaryLink = page.locator('a[routerLink="/summary"]');
    this.usersLink = page.locator('a[routerLink="/users"]');
    this.profileButton = page.locator('button.profile-button');
    this.profileMenu = page.locator('.profile-menu');
    this.logoutButton = page.locator('button.logout-button');
    this.userNameDisplay = page.locator('.profile-name');
    this.userEmailDisplay = page.locator('.profile-email');
    this.userRoleBadge = page.locator('.profile-role');
    this.mobileMenuButton = page.locator('button.mobile-menu-btn');
  }

  /**
   * Click profile button to open menu
   */
  async clickProfileButton() {
    await this.profileButton.click();
  }

  /**
   * Check if profile menu is visible
   */
  async isProfileMenuVisible() {
    return await this.profileMenu.isVisible();
  }

  /**
   * Get username displayed in profile menu
   */
  async getDisplayedUsername() {
    return await this.userNameDisplay.textContent();
  }

  /**
   * Get email displayed in profile menu
   */
  async getDisplayedEmail() {
    return await this.userEmailDisplay.textContent();
  }

  /**
   * Get role displayed in profile menu
   */
  async getDisplayedRole() {
    return await this.userRoleBadge.textContent();
  }

  /**
   * Click logout button
   */
  async logout() {
    await this.logoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to payment page
   */
  async navigateToPayment() {
    await this.paymentLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to summary page
   */
  async navigateToSummary() {
    await this.summaryLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to users page
   */
  async navigateToUsers() {
    await this.usersLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if payment link has active class
   */
  async isPaymentLinkActive() {
    return await this.paymentLink.evaluate((el) =>
      el.classList.contains('active')
    );
  }

  /**
   * Toggle mobile menu
   */
  async toggleMobileMenu() {
    await this.mobileMenuButton.click();
  }

  /**
   * Check if mobile menu button is visible
   */
  async isMobileMenuButtonVisible() {
    return await this.mobileMenuButton.isVisible();
  }
}
