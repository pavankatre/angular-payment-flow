import { test, expect } from '../fixtures/test.fixture';

/**
 * Navigation & Header Tests
 * Tests for header functionality, navigation, and user profile
 */
test.describe('Header & Navigation', () => {
  test.beforeEach(async ({ loginPage }) => {
    // Login before each test
    await loginPage.goto();
    await loginPage.loginAsAdmin();
  });

  test('should display header with navigation links', async ({ headerPage }) => {
    await expect(headerPage.header).toBeVisible();
    await expect(headerPage.paymentLink).toBeVisible();
    await expect(headerPage.summaryLink).toBeVisible();
    await expect(headerPage.usersLink).toBeVisible();
  });

  test('should navigate to payment page', async ({ headerPage, page }) => {
    await headerPage.navigateToPayment();
    await expect(page).toHaveURL(/\/payment/);
  });

  test('should navigate to summary page', async ({ headerPage, page }) => {
    await headerPage.navigateToSummary();
    await expect(page).toHaveURL(/\/summary/);
  });

  test('should navigate to users page', async ({ headerPage, page }) => {
    await headerPage.navigateToUsers();
    await expect(page).toHaveURL(/\/users/);
  });

  test('should show active class on current page link', async ({ headerPage, page }) => {
    // Navigate to payment
    await headerPage.navigateToPayment();

    // Check if payment link is active
    const isActive = await headerPage.isPaymentLinkActive();
    expect(isActive).toBeTruthy();
  });

  test('should display profile button', async ({ headerPage }) => {
    await expect(headerPage.profileButton).toBeVisible();
  });

  test('should open profile menu on button click', async ({ headerPage }) => {
    await headerPage.clickProfileButton();
    const isVisible = await headerPage.isProfileMenuVisible();
    expect(isVisible).toBeTruthy();
  });

  test('should display user information in profile menu', async ({ headerPage }) => {
    await headerPage.clickProfileButton();

    // Check if user details are displayed
    const username = await headerPage.getDisplayedUsername();
    const email = await headerPage.getDisplayedEmail();
    const role = await headerPage.getDisplayedRole();

    expect(username).toBeTruthy();
    expect(email).toBeTruthy();
    expect(role).toBeTruthy();
  });

  test('should logout from profile menu', async ({ headerPage, page }) => {
    // Open profile menu
    await headerPage.clickProfileButton();

    // Click logout
    await headerPage.logout();

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display profile avatar with user initial', async ({ headerPage }) => {
    const profileButton = headerPage.profileButton;
    const avatar = profileButton.locator('.profile-avatar');

    await expect(avatar).toBeVisible();
    const initial = await avatar.textContent();
    expect(initial).toBeTruthy();
    expect(initial?.length).toBe(1); // Should be a single character
  });

  test('should close profile menu when clicking outside', async ({ headerPage, page }) => {
    // Open profile menu
    await headerPage.clickProfileButton();
    expect(await headerPage.isProfileMenuVisible()).toBeTruthy();

    // Click elsewhere on the page
    await page.click('body');

    // Menu should close
    expect(await headerPage.isProfileMenuVisible()).toBeFalsy();
  });
});
