import { test, expect } from '../fixtures/test.fixture';

/**
 * Login Feature Tests
 * Tests for authentication and login functionality
 */
test.describe('Login Feature', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should display login form on load', async ({ loginPage, page }) => {
    // Check if login form elements are visible
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ loginPage, page }) => {
    // Login with admin credentials
    await loginPage.login('admin', 'admin123');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/(dashboard|payment)/);
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    // Try to login with invalid credentials
    await loginPage.login('invaliduser', 'invalidpass');

    // Check for error message
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Invalid credentials');
  });

  test('should login successfully with admin demo button', async ({ loginPage, page }) => {
    // Click admin demo button and login
    await loginPage.loginAsAdmin();

    // Should be redirected to dashboard
    await expect(page).toHaveURL(/\/(dashboard|payment)/);
  });

  test('should login successfully with user demo button', async ({ loginPage, page }) => {
    // Click user demo button and login
    await loginPage.loginAsUser();

    // Should be redirected to dashboard
    await expect(page).toHaveURL(/\/(dashboard|payment)/);
  });

  test('should login successfully with viewer demo button', async ({ loginPage, page }) => {
    // Click viewer demo button and login
    await loginPage.loginAsViewer();

    // Should be redirected to dashboard
    await expect(page).toHaveURL(/\/(dashboard|payment)/);
  });

  test('should require username field', async ({ loginPage }) => {
    // Clear username and try to login
    await loginPage.passwordInput.fill('password123');
    
    // Login button should be disabled
    const isDisabled = await loginPage.isLoginButtonDisabled();
    expect(isDisabled).toBeTruthy();
  });

  test('should require password field', async ({ loginPage }) => {
    // Clear password and try to login
    await loginPage.usernameInput.fill('admin');
    
    // Login button should be disabled
    const isDisabled = await loginPage.isLoginButtonDisabled();
    expect(isDisabled).toBeTruthy();
  });

  test('should toggle password visibility', async ({ loginPage }) => {
    // Get initial password input type
    let passwordType = await loginPage.passwordInput.getAttribute('type');
    expect(passwordType).toBe('password');

    // Toggle visibility
    await loginPage.togglePasswordVisibility();

    // Check if type changed to text
    passwordType = await loginPage.passwordInput.getAttribute('type');
    expect(passwordType).toBe('text');

    // Toggle back
    await loginPage.togglePasswordVisibility();
    passwordType = await loginPage.passwordInput.getAttribute('type');
    expect(passwordType).toBe('password');
  });

  test('should display demo credentials buttons', async ({ loginPage }) => {
    await expect(loginPage.adminDemoButton).toBeVisible();
    await expect(loginPage.userDemoButton).toBeVisible();
    await expect(loginPage.viewerDemoButton).toBeVisible();
  });
});
