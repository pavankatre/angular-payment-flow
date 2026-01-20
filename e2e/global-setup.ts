import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright tests
 * Runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  // You can do any global setup here
  // For example, setting up test data, clearing database, etc.
  
  console.log('🚀 Starting global setup...');
  
  // Optional: Create a browser instance for setup tasks
  const browser = await chromium.launch();
  const context = await browser.createContext();
  const page = await context.newPage();

  // Navigate to check if app is running
  try {
    await page.goto('http://localhost:4200/', { waitUntil: 'networkidle' });
    console.log('✅ Application is running and accessible');
  } catch (error) {
    console.log('⚠️  Application might not be running, but tests will start the server');
  }

  await browser.close();
  console.log('✅ Global setup completed');
}

export default globalSetup;
