# E2E Testing with Playwright - Angular 17

This project uses **Playwright** for end-to-end testing. Playwright is a modern testing framework that works with all browsers (Chromium, Firefox, WebKit) and provides excellent tooling.

## 📁 Project Structure

```
e2e/
├── fixtures/
│   └── test.fixture.ts          # Custom test fixtures with page objects
├── pages/
│   ├── login.page.ts            # Login page object model
│   ├── dashboard.page.ts        # Dashboard page object model
│   └── header.page.ts           # Header/Navigation page object model
├── tests/
│   ├── login.spec.ts            # Login tests (9 test cases)
│   ├── auth.spec.ts             # Authentication & Authorization tests (8 test cases)
│   ├── navigation.spec.ts       # Header & Navigation tests (11 test cases)
│   └── dashboard.spec.ts        # Dashboard tests (8 test cases)
├── utils/
│   └── test-utils.ts            # Helper utility functions
├── global-setup.ts              # Global setup before all tests
├── global-teardown.ts           # Global teardown after all tests
└── .gitignore                   # Ignore test artifacts
```

## 📋 File Overview

### Configuration
- **playwright.config.ts** - Main Playwright configuration
  - Configures browsers (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)
  - Sets up reporters (HTML, JUnit, List)
  - Configures web server auto-start
  - Sets screenshot and video collection on failure

### Page Objects (Best Practice)
- **login.page.ts** - Encapsulates all login-related selectors and actions
- **dashboard.page.ts** - Encapsulates dashboard/table functionality
- **header.page.ts** - Encapsulates header/navigation functionality

### Test Suites (36+ Test Cases)
1. **login.spec.ts** - Tests authentication flows
2. **auth.spec.ts** - Tests protected routes and role-based access
3. **navigation.spec.ts** - Tests header navigation and user profile
4. **dashboard.spec.ts** - Tests dashboard features and search

### Utilities
- **test.fixture.ts** - Custom test fixture providing page objects
- **test-utils.ts** - Helper functions for common test operations
- **global-setup.ts** - Runs before all tests (optional initialization)
- **global-teardown.ts** - Runs after all tests (cleanup)

## 🚀 Getting Started

### Installation
```bash
# Already installed during project setup
npm install -D @playwright/test
```

### Run All Tests
```bash
npm run e2e
```

### Run Tests in UI Mode (Recommended for Development)
```bash
npm run e2e:ui
```
This opens an interactive test runner where you can:
- Watch tests run in real-time
- Step through each action
- See visual diffs for failures
- Time-travel through the test execution

### Run Tests in Debug Mode
```bash
npm run e2e:debug
```
Opens the Playwright Inspector for step-by-step debugging

### Run Tests for Specific Browser
```bash
npm run e2e:chromium    # Chrome only
npm run e2e:firefox     # Firefox only
npm run e2e:webkit      # Safari only
```

### View Test Report
```bash
npm run e2e:report
```
Opens the HTML test report in your browser

## 📊 Test Statistics

| Test Suite | Test Cases | Scenarios |
|-----------|-----------|-----------|
| Login | 9 | Form validation, demo buttons, credentials |
| Authentication | 8 | Route protection, sessions, roles |
| Navigation | 11 | Header links, profile menu, logout |
| Dashboard | 8 | Search, sort, display, role-based access |
| **Total** | **36+** | - |

## ✅ Test Coverage

### Authentication Tests
- ✅ Login with valid/invalid credentials
- ✅ Demo button login (Admin/User/Viewer)
- ✅ Form validation
- ✅ Password toggle visibility
- ✅ Error message display

### Authorization Tests
- ✅ Protected route access control
- ✅ Session persistence
- ✅ Role-based route access
- ✅ Session clearance on logout
- ✅ Role badge display

### Navigation Tests
- ✅ Header link navigation
- ✅ Active link indicator
- ✅ Profile menu functionality
- ✅ User information display
- ✅ Logout functionality

### Dashboard Tests
- ✅ User table display
- ✅ Search functionality
- ✅ Sort by column
- ✅ User data retrieval
- ✅ Error handling
- ✅ Non-admin access restriction

## 🏗️ Page Object Pattern

The project uses the **Page Object Model** pattern - a best practice for E2E testing:

```typescript
// Usage in tests
test('should login successfully', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('admin', 'admin123');
});
```

**Benefits:**
- Separates test logic from selectors
- Easy to maintain when UI changes
- Reusable methods across tests
- Better test readability

## 🛠️ Creating New Tests

### 1. Create Page Object (if needed)
```typescript
// e2e/pages/payment.page.ts
export class PaymentPage {
  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.locator('button[type="submit"]');
  }

  async submitPayment() {
    await this.submitButton.click();
  }
}
```

### 2. Add to Fixture
```typescript
// e2e/fixtures/test.fixture.ts
export const test = base.extend<TestFixtures>({
  paymentPage: async ({ page }, use) => {
    const paymentPage = new PaymentPage(page);
    await use(paymentPage);
  },
});
```

### 3. Create Test Suite
```typescript
// e2e/tests/payment.spec.ts
test.describe('Payment Feature', () => {
  test('should submit payment', async ({ paymentPage }) => {
    await paymentPage.goto();
    await paymentPage.submitPayment();
    // Add assertions
  });
});
```

## 🔍 Selectors Best Practice

Use stable selectors in this order:
1. `test-id` attribute (best) - `page.locator('[data-testid="login-button"]')`
2. `id` attribute - `page.locator('#username')`
3. `name` attribute - `page.locator('input[name="email"]')`
4. CSS class - `page.locator('button.submit')`
5. XPath (last resort) - `page.locator('//button[text()="Login"]')`

## 📈 CI/CD Integration

Add to your GitHub Actions or CI/CD pipeline:

```yaml
- name: Run E2E Tests
  run: npm run e2e

- name: Upload Report
  uses: actions/upload-artifact@v2
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## 🐛 Debugging Tips

1. **Use Debug Mode**
   ```bash
   npm run e2e:debug
   ```

2. **Use UI Mode for Visual Debugging**
   ```bash
   npm run e2e:ui
   ```

3. **Take Screenshots**
   ```typescript
   await page.screenshot({ path: 'screenshot.png' });
   ```

4. **Pause Test Execution**
   ```typescript
   await page.pause();
   ```

5. **Check Trace Files**
   - Automatically saved on failure
   - Open with: `npx playwright show-trace test-results/trace.zip`

## 📝 Common Assertions

```typescript
// Navigation
await expect(page).toHaveURL(/\/dashboard/);

// Visibility
await expect(element).toBeVisible();
await expect(element).toBeHidden();

// Text content
await expect(element).toContainText('Login');

// Element state
await expect(element).toBeDisabled();
await expect(element).toBeEnabled();

// Count
await expect(elements).toHaveCount(5);
```

## ⚙️ Configuration Details

### Browsers
- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: Pixel 5, iPhone 12
- Can be customized in `playwright.config.ts`

### Timeouts
- Global timeout: 30 seconds per test
- Assertion timeout: 5 seconds
- Navigation timeout: 120 seconds

### Reporting
- **HTML Report**: Full test results with screenshots
- **JUnit**: For CI/CD integration
- **List**: Console output
- **Videos**: On failure in `test-results/videos/`

## 🎯 Next Steps

1. ✅ Run tests: `npm run e2e`
2. ✅ Try UI mode: `npm run e2e:ui`
3. ✅ Add more page objects as features grow
4. ✅ Create fixtures for common test setups
5. ✅ Integrate into CI/CD pipeline

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

## 🤝 Contributing

When adding new features:
1. Create corresponding page object methods
2. Write tests covering happy path and edge cases
3. Keep tests independent (no dependencies between tests)
4. Use descriptive test names
5. Maintain the Page Object Model pattern

---

Happy Testing! 🎭🚀
