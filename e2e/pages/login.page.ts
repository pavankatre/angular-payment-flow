import { Page, Locator } from '@playwright/test';

/**
 * Login Page Object
 * Contains all selectors and methods related to login functionality
 */
export class LoginPage {
  readonly page: Page;

  // Selectors
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly adminDemoButton: Locator;
  readonly userDemoButton: Locator;
  readonly viewerDemoButton: Locator;
  readonly passwordToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize selectors
    this.usernameInput = page.locator('input#username');
    this.passwordInput = page.locator('input#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
    this.adminDemoButton = page.locator('button.demo-button.admin');
    this.userDemoButton = page.locator('button.demo-button.user');
    this.viewerDemoButton = page.locator('button.demo-button.viewer');
    this.passwordToggle = page.locator('button.password-toggle');
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Perform login with credentials
   */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Login as admin using demo button
   */
  async loginAsAdmin() {
    await this.adminDemoButton.click();
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Login as user using demo button
   */
  async loginAsUser() {
    await this.userDemoButton.click();
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Login as viewer using demo button
   */
  async loginAsViewer() {
    await this.viewerDemoButton.click();
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get error message text
   */
  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility() {
    await this.passwordToggle.click();
  }

  /**
   * Check if login button is disabled
   */
  async isLoginButtonDisabled() {
    return await this.loginButton.isDisabled();
  }

  /**
   * Clear username field
   */
  async clearUsername() {
    await this.usernameInput.clear();
  }

  /**
   * Clear password field
   */
  async clearPassword() {
    await this.passwordInput.clear();
  }
}
