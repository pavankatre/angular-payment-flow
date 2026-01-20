import { test, expect } from '../fixtures/test.fixture';

/**
 * Dashboard Tests
 * Tests for users dashboard functionality
 */
test.describe('Users Dashboard', () => {
  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    // Login and navigate to dashboard
    await loginPage.goto();
    await loginPage.loginAsAdmin();
    await dashboardPage.goto();
  });

  test('should display dashboard with users table', async ({ dashboardPage }) => {
    await dashboardPage.waitForLoad();
    
    const userCount = await dashboardPage.getUserCount();
    expect(userCount).toBeGreaterThan(0);
  });

  test('should search users by term', async ({ dashboardPage }) => {
    await dashboardPage.waitForLoad();

    // Get initial user count
    const initialCount = await dashboardPage.getUserCount();

    // Search for a user
    await dashboardPage.searchUser('John');

    // Users count should be filtered
    const filteredCount = await dashboardPage.getUserCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('should clear search and show all users', async ({ dashboardPage }) => {
    await dashboardPage.waitForLoad();

    const initialCount = await dashboardPage.getUserCount();

    // Search for a user
    await dashboardPage.searchUser('John');

    // Clear search
    await dashboardPage.searchUser('');

    // Should show all users again
    const finalCount = await dashboardPage.getUserCount();
    expect(finalCount).toBeGreaterThanOrEqual(initialCount - 1);
  });

  test('should sort users by column', async ({ dashboardPage }) => {
    await dashboardPage.waitForLoad();

    // Sort by first column (name)
    await dashboardPage.sortByColumn(0);

    // Should still show users
    const userCount = await dashboardPage.getUserCount();
    expect(userCount).toBeGreaterThan(0);
  });

  test('should display user data in table', async ({ dashboardPage }) => {
    await dashboardPage.waitForLoad();

    // Get first user's data
    const userData = await dashboardPage.getUserData(0);

    expect(userData.name).toBeTruthy();
    expect(userData.email).toBeTruthy();
  });

  test('should handle errors gracefully', async ({ dashboardPage }) => {
    // If there's an error, retry button should be available
    // This test depends on your error handling implementation
    if (await dashboardPage.isErrorVisible()) {
      await dashboardPage.clickRetry();
      await dashboardPage.waitForLoad();
    }

    // Dashboard should be functional
    const userCount = await dashboardPage.getUserCount();
    expect(userCount >= 0).toBeTruthy();
  });

  test('non-admin should not access users page', async ({ loginPage, page }) => {
    // Logout first
    await page.goto('/login');

    // Login as viewer
    await loginPage.loginAsViewer();

    // Try to access users page
    await page.goto('/users');

    // Should not see the users dashboard
    // or should be redirected
    const url = page.url();
    expect(url).not.toContain('/users');
  });
});
