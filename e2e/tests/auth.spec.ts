import { test, expect } from '../fixtures/test.fixture';

/**
 * Authentication & Protected Routes Tests
 * Tests for auth guards, role-based access, and session management
 */
test.describe('Authentication & Authorization', () => {
  test('should redirect to login when accessing protected route without authentication', async ({ page }) => {
    // Try to access dashboard without logging in
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should allow access to dashboard after login', async ({ loginPage, dashboardPage, page }) => {
    // Login first
    await loginPage.goto();
    await loginPage.loginAsAdmin();

    // Should be able to access dashboard
    await dashboardPage.goto();
    await expect(page).toHaveURL(/\/(dashboard|payment)/);
  });

  test('should restrict users from accessing admin-only routes', async ({ loginPage, page }) => {
    // Login as viewer (non-admin)
    await loginPage.goto();
    await loginPage.loginAsViewer();

    // Try to access users page (admin-only)
    await page.goto('/users');

    // Should redirect to unauthorized or stay on current page
    const url = page.url();
    // Depending on your implementation, adjust this assertion
    const isRestricted = url.includes('login') || url.includes('unauthorized');
    expect(isRestricted).toBeTruthy();
  });

  test('should allow admin to access all routes', async ({ loginPage, dashboardPage, headerPage, page }) => {
    // Login as admin
    await loginPage.goto();
    await loginPage.loginAsAdmin();

    // Should be able to navigate to users page
    await headerPage.navigateToUsers();
    await expect(page).toHaveURL(/\/users/);
  });

  test('should maintain session on page refresh', async ({ loginPage, page }) => {
    // Login
    await loginPage.goto();
    await loginPage.loginAsAdmin();

    // Refresh page
    await page.reload();

    // Should still be logged in and redirected to dashboard
    await page.waitForLoadState('networkidle');
    expect(page.url()).not.toContain('/login');
  });

  test('should clear session on logout', async ({ loginPage, headerPage, page }) => {
    // Login
    await loginPage.goto();
    await loginPage.loginAsAdmin();

    // Open profile menu and logout
    await headerPage.clickProfileButton();
    await headerPage.logout();

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);

    // Try to access protected route
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('admin user should see profile with admin role', async ({ loginPage, headerPage }) => {
    // Login as admin
    await loginPage.goto();
    await loginPage.loginAsAdmin();

    // Open profile menu
    await headerPage.clickProfileButton();

    // Check role badge
    const role = await headerPage.getDisplayedRole();
    expect(role).toContain('Admin');
  });

  test('user should see profile with user role', async ({ loginPage, headerPage }) => {
    // Login as user
    await loginPage.goto();
    await loginPage.loginAsUser();

    // Open profile menu
    await headerPage.clickProfileButton();

    // Check role badge
    const role = await headerPage.getDisplayedRole();
    expect(role).toContain('User');
  });
});
