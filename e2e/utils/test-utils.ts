import { Page } from '@playwright/test';

/**
 * Utility functions for E2E tests
 */

/**
 * Wait for URL to change
 */
export async function waitForUrlChange(page: Page, initialUrl: string, timeout = 10000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (page.url() !== initialUrl) {
      return true;
    }
    await page.waitForTimeout(100);
  }
  return false;
}

/**
 * Login as specific role (helper function)
 */
export async function loginAsRole(page: Page, role: 'admin' | 'user' | 'viewer') {
  await page.goto('/login');
  
  const credentials: Record<string, { username: string; password: string }> = {
    admin: { username: 'admin', password: 'admin123' },
    user: { username: 'user', password: 'user123' },
    viewer: { username: 'viewer', password: 'viewer123' },
  };

  const { username, password } = credentials[role];
  
  await page.locator('input#username').fill(username);
  await page.locator('input#password').fill(password);
  await page.locator('button[type="submit"]').click();
  
  await page.waitForLoadState('networkidle');
}

/**
 * Logout user
 */
export async function logout(page: Page) {
  await page.locator('button.profile-button').click();
  await page.locator('button.logout-button').click();
  await page.waitForLoadState('networkidle');
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(page: Page, selector: string) {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }, selector);
}

/**
 * Scroll element into view
 */
export async function scrollIntoView(page: Page, selector: string) {
  await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (element) {
      element.scrollIntoView();
    }
  }, selector);
}

/**
 * Get all visible text content
 */
export async function getPageText(page: Page) {
  return await page.evaluate(() => document.body.innerText);
}

/**
 * Take screenshot for debugging
 */
export async function takeDebugScreenshot(page: Page, testName: string) {
  await page.screenshot({
    path: `test-results/screenshots/${testName}-${Date.now()}.png`,
  });
}
