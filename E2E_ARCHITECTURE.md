# E2E Testing Architecture Overview

## Directory Structure

```
payment-serv/
├── e2e/                          # All E2E tests
│   ├── fixtures/
│   │   └── test.fixture.ts       # Custom test fixture with page objects
│   │
│   ├── pages/                    # Page Object Models
│   │   ├── login.page.ts         # Login page object
│   │   ├── dashboard.page.ts     # Dashboard page object
│   │   └── header.page.ts        # Header page object
│   │
│   ├── tests/                    # Test suites (36+ tests)
│   │   ├── login.spec.ts         # 9 login tests
│   │   ├── auth.spec.ts          # 8 auth tests
│   │   ├── navigation.spec.ts    # 11 navigation tests
│   │   └── dashboard.spec.ts     # 8 dashboard tests
│   │
│   ├── utils/
│   │   └── test-utils.ts         # Helper utilities
│   │
│   ├── global-setup.ts           # Pre-test setup
│   ├── global-teardown.ts        # Post-test cleanup
│   ├── tsconfig.json             # TypeScript config for e2e
│   ├── .gitignore                # Ignore test artifacts
│   └── README.md                 # Complete testing guide
│
├── playwright.config.ts          # Playwright configuration
├── PLAYWRIGHT_SETUP.md           # Setup summary
└── package.json                  # NPM scripts for testing
```

## Test Execution Flow

```
┌─────────────────────────────────────────┐
│   npm run e2e                           │
│   (or e2e:ui, e2e:debug, etc)          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  playwright.config.ts                   │
│  - Start dev server (ng serve)          │
│  - Set up browsers                      │
│  - Configure reporting                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  global-setup.ts                        │
│  - Initialize test environment          │
│  - Check server connectivity            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  test.fixture.ts                        │
│  - Inject page objects                  │
│  - Configure test instance              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  tests/**.spec.ts                       │
│  Test Suites:                           │
│  • login.spec.ts      (9 tests)         │
│  • auth.spec.ts       (8 tests)         │
│  • navigation.spec.ts (11 tests)        │
│  • dashboard.spec.ts  (8 tests)         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Page Object Models                     │
│  • LoginPage.login()                    │
│  • DashboardPage.searchUser()           │
│  • HeaderPage.logout()                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  User Application                       │
│  (Running on http://localhost:4200)    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Collect Results                        │
│  • Screenshots (on failure)             │
│  • Videos (on failure)                  │
│  • Traces (for debugging)               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  global-teardown.ts                     │
│  - Clean up resources                   │
│  - Close servers                        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Report Generation                      │
│  • HTML Report                          │
│  • JUnit XML                            │
│  • Console Output                       │
└─────────────────────────────────────────┘
```

## Test Architecture

```
┌──────────────────────────────────────────────┐
│          Test Suites (tests/*.spec.ts)       │
│  ┌────────────────────────────────────────┐  │
│  │ test('should login successfully', ...) │  │
│  │   ↓                                     │  │
│  │   await loginPage.goto()               │  │
│  │   await loginPage.login(...)           │  │
│  │   await expect(page).toHaveURL(...)    │  │
│  └────────────────────────────────────────┘  │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│   Page Objects (pages/*.page.ts)             │
│  ┌────────────────────────────────────────┐  │
│  │ LoginPage                              │  │
│  │  - usernameInput: Locator              │  │
│  │  - passwordInput: Locator              │  │
│  │  - loginButton: Locator                │  │
│  │                                        │  │
│  │  - async login(username, password)    │  │
│  │  - async loginAsAdmin()                │  │
│  │  - async getErrorMessage()             │  │
│  └────────────────────────────────────────┘  │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│      Fixtures (fixtures/test.fixture.ts)     │
│  ┌────────────────────────────────────────┐  │
│  │ export const test = base.extend({      │  │
│  │   loginPage: async ({ page }, use) {   │  │
│  │     const loginPage = new LoginPage()  │  │
│  │     await use(loginPage)               │  │
│  │   }                                    │  │
│  │ })                                     │  │
│  └────────────────────────────────────────┘  │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│        Playwright (@playwright/test)         │
│     - Browser automation                     │
│     - Assertions                             │
│     - Reporting                              │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│    Application Under Test (Angular App)      │
│      Running on http://localhost:4200        │
└──────────────────────────────────────────────┘
```

## Test Statistics

```
╔════════════════════════════════════════╗
║         E2E Test Coverage              ║
╠════════════════════════════════════════╣
║ Login Tests               │    9 tests ║
║ Authentication Tests      │    8 tests ║
║ Navigation Tests          │   11 tests ║
║ Dashboard Tests           │    8 tests ║
╠════════════════════════════════════════╣
║ TOTAL                     │   36 tests ║
╚════════════════════════════════════════╝

Browsers Tested:
  ✓ Chromium (Desktop Chrome)
  ✓ Firefox  (Desktop Firefox)
  ✓ WebKit   (Desktop Safari)
  ✓ Mobile Chrome
  ✓ Mobile Safari

Features Covered:
  ✓ Authentication & Login
  ✓ Session Management
  ✓ Role-based Access Control
  ✓ Protected Routes
  ✓ User Navigation
  ✓ Profile Management
  ✓ Dashboard Features
  ✓ Data Search & Filtering
```

## Page Object Pattern

```
Traditional Test (Hard to Maintain)
────────────────────────────────────
test('login', async ({ page }) => {
  await page.locator('input#username').fill('admin');
  await page.locator('input#password').fill('admin123');
  await page.locator('button[type="submit"]').click();
})

                    VS

Page Object Test (Easy to Maintain)
────────────────────────────────────
test('login', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('admin', 'admin123');
})

Benefits of Page Object Model:
✓ Selectors encapsulated in one place
✓ Easy to update when UI changes
✓ Readable test code
✓ Reusable methods across tests
✓ Better test organization
```

## Command Reference

```
Development:
├─ npm run e2e          → Run all tests (headless)
├─ npm run e2e:ui       → Interactive test runner
└─ npm run e2e:debug    → Playwright Inspector

Browser-Specific:
├─ npm run e2e:chromium → Chrome only
├─ npm run e2e:firefox  → Firefox only
└─ npm run e2e:webkit   → Safari only

Reporting:
└─ npm run e2e:report   → View HTML report

Output Locations:
├─ playwright-report/   → HTML report
├─ test-results/        → Videos, screenshots, traces
└─ playwright-report/   → Browser reports
```

## File Dependencies

```
playwright.config.ts
│
├─→ e2e/global-setup.ts
│
├─→ e2e/global-teardown.ts
│
└─→ e2e/tests/
    │
    ├─→ login.spec.ts
    │   ├─→ e2e/fixtures/test.fixture.ts
    │   └─→ e2e/pages/login.page.ts
    │
    ├─→ auth.spec.ts
    │   ├─→ e2e/fixtures/test.fixture.ts
    │   └─→ e2e/pages/*.page.ts
    │
    ├─→ navigation.spec.ts
    │   ├─→ e2e/fixtures/test.fixture.ts
    │   └─→ e2e/pages/*.page.ts
    │
    └─→ dashboard.spec.ts
        ├─→ e2e/fixtures/test.fixture.ts
        └─→ e2e/pages/*.page.ts
```

---

For detailed information, see:
- `e2e/README.md` - Complete testing guide
- `PLAYWRIGHT_SETUP.md` - Setup summary
