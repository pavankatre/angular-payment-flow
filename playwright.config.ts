import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Angular 17 E2E Testing
 * 
 * This configuration sets up Playwright for running end-to-end tests
 * against the Angular application.
 */
export default defineConfig({
  // Test timeout in milliseconds
  timeout: 30000,
  
  // Expect timeout for assertions
  expect: {
    timeout: 5000,
  },

  // Number of parallel workers
  workers: process.env['CI'] ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html'],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  // Use a single web server for all tests
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Test against mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Global test settings
  use: {
    // Base URL for navigation
    baseURL: 'http://localhost:4200',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  // Global setup/teardown
  globalSetup: require.resolve('./e2e/global-setup.ts'),
  globalTeardown: require.resolve('./e2e/global-teardown.ts'),
});
