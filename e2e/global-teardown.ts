import { FullConfig } from '@playwright/test';

/**
 * Global teardown for Playwright tests
 * Runs once after all tests
 */
async function globalTeardown(config: FullConfig) {
  // Clean up resources after all tests
  console.log('🧹 Running global teardown...');
  
  // You can do any cleanup here
  // For example: clearing database, stopping services, etc.
  
  console.log('✅ Global teardown completed');
}

export default globalTeardown;
