# 🎭 E2E Tests with Playwright

End-to-end тесты для StudentDeals.uz frontend с использованием Playwright и MSW.

## 🎯 Overview

**Технологии:**
- 🎭 **Playwright** - E2E testing framework
- 🔧 **MSW (Mock Service Worker)** - API mocking
- 🧪 **Test Coverage:**
  - Homepage navigation
  - Language switching (ru ↔ uz)
  - Authentication flows
  - Form validation
  - Translations

---

## 🚀 Quick Start

### Run Tests Locally

```bash
# Run all tests (headless)
pnpm --filter web run test:e2e

# Run with UI mode (interactive)
pnpm --filter web run test:e2e:ui

# Run in headed mode (see browser)
pnpm --filter web run test:e2e:headed

# Debug mode (step through tests)
pnpm --filter web run test:e2e:debug
```

### Run Specific Test File

```bash
# Run only homepage tests
pnpm --filter web exec playwright test homepage.spec.ts

# Run only auth tests
pnpm --filter web exec playwright test auth.spec.ts
```

### Watch Mode

```bash
# Run tests in watch mode
pnpm --filter web exec playwright test --watch
```

---

## 📁 Structure

```
apps/web/e2e/
├── mocks/
│   ├── handlers.ts       # MSW API handlers
│   └── browser.ts        # MSW browser setup
├── global-setup.ts       # Playwright global setup
├── homepage.spec.ts      # Homepage tests
├── auth.spec.ts          # Authentication tests
├── navigation.spec.ts    # Navigation tests
└── README.md            # This file

apps/web/
├── playwright.config.ts  # Playwright configuration
└── package.json         # Test scripts
```

---

## 🧪 Test Suites

### 1. Homepage Tests (`homepage.spec.ts`)

**Coverage:**
- ✅ Load Russian homepage
- ✅ Load Uzbek homepage
- ✅ Switch language (ru → uz)
- ✅ Switch language (uz → ru)
- ✅ Navigate to sign in
- ✅ Navigate to sign up

**Example:**
```typescript
test('should load Russian homepage', async ({ page }) => {
  await page.goto('/ru');
  await expect(page).toHaveTitle(/Student Deals/i);
  await expect(page.getByText('Скидки для студентов')).toBeVisible();
});
```

### 2. Authentication Tests (`auth.spec.ts`)

**Coverage:**
- ✅ Display sign in form
- ✅ Validate invalid email
- ✅ Handle wrong credentials
- ✅ Successful login
- ✅ Display sign up form
- ✅ Validate short password
- ✅ Handle existing email
- ✅ Successful registration
- ✅ Check Russian translations
- ✅ Check Uzbek translations

**Example:**
```typescript
test('should successfully login with valid credentials', async ({ page }) => {
  await page.goto('/ru/signin');
  await page.getByLabel(/email/i).fill('test@example.com');
  await page.getByLabel(/пароль/i).fill('password123');
  await page.getByRole('button', { name: /войти/i }).click();
  await expect(page).not.toHaveURL(/\/signin/);
});
```

### 3. Navigation Tests (`navigation.spec.ts`)

**Coverage:**
- ✅ Navigate between pages (Russian locale)
- ✅ Navigate between pages (Uzbek locale)
- ✅ Maintain locale when navigating
- ✅ Redirect root to default locale
- ✅ Handle 404 pages

**Example:**
```typescript
test('should maintain locale when navigating', async ({ page }) => {
  await page.goto('/ru');
  const firstLink = page.getByRole('link').first();
  await firstLink.click();
  await expect(page).toHaveURL(/\/ru\//);
});
```

---

## 🔧 MSW API Mocks

### Mocked Endpoints

**File:** `e2e/mocks/handlers.ts`

| Endpoint | Method | Mock Behavior |
|----------|--------|---------------|
| `/health` | GET | Returns `{ ok: true }` |
| `/health/db` | GET | Returns `{ ok: true, db: 'connected' }` |
| `/auth/register` | POST | Validates email/password, returns user or error |
| `/auth/login` | POST | Validates credentials, returns JWT or 401 |
| `/auth/me` | GET | Requires Bearer token, returns user data |
| `/auth/verify` | GET | Validates token, returns success or error |

### Mock Data

**Valid Credentials:**
```typescript
Email: test@example.com
Password: password123
```

**Error Cases:**
```typescript
existing@example.com → "Email already registered"
invalid-email → "Invalid email format"
short-password (< 8 chars) → "Password must be at least 8 characters"
wrong credentials → "Invalid credentials"
```

### Customizing Mocks

Edit `e2e/mocks/handlers.ts`:

```typescript
export const handlers = [
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json();
    
    // Add custom logic
    if (body.email === 'custom@example.com') {
      return HttpResponse.json({ customField: 'value' });
    }
    
    // Default behavior
    return HttpResponse.json({ accessToken: 'token' });
  }),
];
```

---

## ⚙️ Configuration

### Playwright Config (`playwright.config.ts`)

**Key Settings:**
```typescript
{
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
}
```

### Environment Variables

**Local:**
```bash
PLAYWRIGHT_BASE_URL=http://localhost:3000
```

**CI:**
```bash
PLAYWRIGHT_BASE_URL=<Vercel Preview URL>
CI=true
```

---

## 🤖 CI/CD Integration

### GitHub Actions

**File:** `.github/workflows/e2e.yml`

**Two Jobs:**

#### 1. `e2e` - Tests on Built App

Runs on every PR and push:
- ✅ Builds Next.js app
- ✅ Starts production server
- ✅ Runs Playwright tests
- ✅ Uploads test report
- ✅ Uploads screenshots/videos on failure

#### 2. `e2e-preview` - Tests on Vercel Preview

Runs only on PRs:
- ✅ Waits for Vercel preview deployment
- ✅ Gets preview URL from deployment
- ✅ Runs tests against live preview
- ✅ Comments results on PR
- ✅ Uploads artifacts

**Triggers:**
```yaml
on:
  pull_request:
    branches: [main, staging]
    paths:
      - 'apps/web/**'
      - 'packages/**'
  push:
    branches: [main, staging]
```

---

## 📊 Test Reports

### HTML Report (Local)

After running tests:
```bash
pnpm --filter web exec playwright show-report
```

Opens interactive HTML report with:
- ✅ Test results
- ✅ Screenshots
- ✅ Videos
- ✅ Traces
- ✅ Network logs

### CI Reports

**Artifacts uploaded:**
- `playwright-report` - HTML report (7 days retention)
- `playwright-artifacts` - Screenshots, videos, traces (7 days, only on failure)

**View in GitHub:**
1. Go to Actions → E2E Tests workflow
2. Click on run
3. Download artifacts
4. Extract and open `index.html`

---

## 🐛 Debugging

### Debug Mode

```bash
# Run with debugger
pnpm --filter web run test:e2e:debug

# Or specific test
pnpm --filter web exec playwright test auth.spec.ts --debug
```

**Features:**
- ✅ Step through tests
- ✅ Inspect elements
- ✅ View console logs
- ✅ Time travel debugging

### UI Mode

```bash
# Interactive test runner
pnpm --filter web run test:e2e:ui
```

**Features:**
- ✅ Watch tests run
- ✅ Pick & choose tests
- ✅ Time travel
- ✅ Inspector
- ✅ Network tab

### Headed Mode

```bash
# See browser while tests run
pnpm --filter web run test:e2e:headed
```

### Trace Viewer

```bash
# View trace for failed test
pnpm --filter web exec playwright show-trace apps/web/test-results/<test-name>/trace.zip
```

---

## 📝 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Navigate
    await page.goto('/ru/some-page');
    
    // Interact
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Assert
    await expect(page).toHaveURL('/success');
    await expect(page.getByText('Success message')).toBeVisible();
  });
});
```

### Locators

**Recommended Priority:**
1. `getByRole()` - Accessibility-first
2. `getByLabel()` - Form inputs
3. `getByText()` - Visible text
4. `getByTestId()` - Test IDs (last resort)

**Examples:**
```typescript
// By role
await page.getByRole('button', { name: /submit/i }).click();

// By label
await page.getByLabel(/email/i).fill('test@example.com');

// By text
await expect(page.getByText('Success!')).toBeVisible();

// By test ID
await page.getByTestId('custom-element').click();
```

### Assertions

```typescript
// URL
await expect(page).toHaveURL('/expected-path');

// Title
await expect(page).toHaveTitle(/Expected Title/);

// Visibility
await expect(page.getByText('Text')).toBeVisible();
await expect(page.getByText('Text')).toBeHidden();

// Count
await expect(page.getByRole('listitem')).toHaveCount(5);

// Text content
await expect(page.locator('h1')).toHaveText('Expected');
```

---

## 🎯 Best Practices

### 1. Use Semantic Locators

```typescript
// ✅ Good
await page.getByRole('button', { name: /submit/i });
await page.getByLabel('Email');

// ❌ Bad
await page.locator('#submit-btn');
await page.locator('input[name="email"]');
```

### 2. Wait for Actions

```typescript
// ✅ Good
await page.getByText('Loading...').waitFor({ state: 'hidden' });
await expect(page.getByText('Content')).toBeVisible();

// ❌ Bad
await page.waitForTimeout(5000); // Flaky!
```

### 3. Test User Flows, Not Implementation

```typescript
// ✅ Good
test('user can complete registration', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/success');
});

// ❌ Bad
test('registration button calls API', async ({ page }) => {
  // Testing implementation details
});
```

### 4. Keep Tests Independent

```typescript
// ✅ Good
test('test 1', async ({ page }) => {
  await page.goto('/');
  // Test logic
});

test('test 2', async ({ page }) => {
  await page.goto('/'); // Fresh start
  // Test logic
});

// ❌ Bad
test('test 1', async ({ page }) => {
  // State persists
});

test('test 2', async ({ page }) => {
  // Depends on test 1 state
});
```

---

## 📊 Coverage

### Current Test Coverage

| Feature | Tests | Status |
|---------|-------|--------|
| Homepage | 6 tests | ✅ |
| Authentication | 8 tests | ✅ |
| Navigation | 5 tests | ✅ |
| **Smoke Tests** | **20 tests** | ✅ |
| **Total** | **39 tests** | ✅ |

### Smoke Tests

Comprehensive E2E smoke tests validate critical user flows:

- ✅ **Health Checks** (2 tests)
- ✅ **User Signup Flow** (3 tests)
- ✅ **User Signin Flow** (3 tests)
- ✅ **Authentication API** (3 tests)
- ✅ **Email Verification** (2 tests)
- ✅ **CORS Configuration** (2 tests)
- ✅ **Admin Features** (2 tests)
- ✅ **Performance** (2 tests)

**Run Smoke Tests:**
```bash
pnpm --filter web exec playwright test e2e/smoke.spec.ts
```

**Documentation:** See [E2E Smoke Tests Guide](/docs/E2E_SMOKE_TESTS.md)

### Adding More Tests

**Recommended areas:**
- [ ] Password reset flow
- [ ] Email verification flow
- [ ] User profile page
- [ ] Offers/deals listing
- [ ] Search functionality
- [ ] Mobile responsive tests
- [ ] Accessibility tests

---

## 🔍 Troubleshooting

### Tests Failing Locally

**Problem:** Tests fail on your machine

**Solutions:**
1. Ensure dev server is running: `pnpm --filter web dev`
2. Check baseURL matches dev server port
3. Clear Playwright cache: `pnpm --filter web exec playwright cache clear`
4. Reinstall browsers: `pnpm --filter web exec playwright install`

### Tests Pass Locally but Fail in CI

**Problem:** Tests work locally but fail in GitHub Actions

**Solutions:**
1. Check CI logs for error messages
2. Download test artifacts from GitHub Actions
3. Review screenshots/videos
4. Check for race conditions (add explicit waits)
5. Ensure consistent viewport sizes

### Flaky Tests

**Problem:** Tests sometimes pass, sometimes fail

**Solutions:**
1. Add explicit waits instead of `waitForTimeout()`
2. Use `waitFor({ state: 'visible' })`
3. Increase timeout for specific actions
4. Check for race conditions
5. Ensure independent test state

### MSW Not Working

**Problem:** API calls not being mocked

**Solutions:**
1. Check handler URL matches actual API URL
2. Verify MSW worker is initialized
3. Check console for MSW errors
4. Ensure MSW version compatibility

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [MSW Documentation](https://mswjs.io)
- [Testing Best Practices](https://playwright.dev/docs/test-best-practices)

---

## 🎯 Next Steps

- [ ] Add more test coverage
- [ ] Add visual regression tests
- [ ] Add accessibility tests (axe-core)
- [ ] Add performance tests
- [ ] Set up test data factories
- [ ] Add mobile device tests
- [ ] Add cross-browser tests (Firefox, WebKit)

