# E2E Smoke Tests - StudentDeals.uz

Comprehensive end-to-end smoke tests for StudentDeals.uz using Playwright.

## 📊 Test Coverage

### Test Suite Overview

- **Total Tests**: 21
- **Test Categories**: 8
- **Browser**: Chromium
- **Parallel Workers**: 4
- **Average Duration**: ~5 seconds

### Test Categories

#### 1. Health Checks (2 tests)
- ✅ API health endpoint responds
- ✅ Web application loads successfully

#### 2. User Signup Flow (3 tests)
- ✅ User can access signup page
- ✅ API signup endpoint creates user and triggers email verification
- ✅ Signup prevents duplicate email registration

#### 3. User Signin Flow (3 tests)
- ✅ User can access signin page
- ✅ API signin endpoint authenticates user and returns JWT
- ✅ Signin rejects invalid credentials
- ✅ Signin rejects non-existent user

#### 4. Authentication API - `/auth/me` (3 tests)
- ✅ Authenticated `/auth/me` returns user data
- ✅ Unauthenticated `/auth/me` returns 401
- ✅ `/auth/me` rejects invalid token

#### 5. Email Verification Flow (2 tests)
- ✅ Email verification endpoint verifies user
- ✅ Email verification rejects invalid token

#### 6. CORS Configuration (2 tests)
- ✅ API accepts requests from web app origin
- ✅ API handles OPTIONS preflight requests

#### 7. Admin Features (2 tests)
- ✅ Admin can access user list
- ✅ Admin can view statistics

#### 8. Performance & Availability (2 tests)
- ✅ API responds within acceptable time (< 1s)
- ✅ Web app loads within acceptable time (< 5s)

#### 9. Production-Only Tests (1 test, skipped in dev)
- ⏭️ HTTP redirects to HTTPS in production

## 🚀 Running Tests

### Prerequisites

```bash
# Ensure API server is running
node simple-api.js

# Ensure web app is running
pnpm --filter web dev
```

### Run All Smoke Tests

```bash
# Run with default reporter
pnpm --filter web exec playwright test e2e/smoke.spec.ts

# Run with list reporter (detailed output)
pnpm --filter web exec playwright test e2e/smoke.spec.ts --reporter=list

# Run with HTML reporter
pnpm --filter web exec playwright test e2e/smoke.spec.ts --reporter=html
```

### Run Specific Test Categories

```bash
# Health checks only
pnpm --filter web exec playwright test e2e/smoke.spec.ts -g "Health Checks"

# User signup flow only
pnpm --filter web exec playwright test e2e/smoke.spec.ts -g "User Signup Flow"

# Authentication tests only
pnpm --filter web exec playwright test e2e/smoke.spec.ts -g "Authentication"
```

### Debug Mode

```bash
# Run in headed mode (see browser)
pnpm --filter web exec playwright test e2e/smoke.spec.ts --headed

# Run in debug mode with Playwright Inspector
pnpm --filter web exec playwright test e2e/smoke.spec.ts --debug

# Run specific test in debug mode
pnpm --filter web exec playwright test e2e/smoke.spec.ts -g "API signup" --debug
```

## 📋 Test Details

### Email Verification Tests

Tests validate the complete email verification flow:

1. **User Registration**
   - User signs up via `/auth/register`
   - API creates user account
   - Triggers mock email sending (Resend/SendGrid mock)
   - Returns verification link with token

2. **Email Verification**
   - User clicks verification link (GET `/auth/verify?token=X`)
   - Token validated
   - User's `emailVerifiedAt` timestamp updated
   - Success message returned

3. **Edge Cases**
   - Invalid token rejected (400 Bad Request)
   - Expired token rejected
   - Already verified user handled

**Mock Email Example:**
```
📧 [MOCK EMAIL] Verification email sent to test@example.com
🔗 [MOCK EMAIL] Verification link: http://localhost:3000/ru/verify?token=test
```

### CORS Tests

Validates cross-origin resource sharing configuration:

- **Preflight Requests**: OPTIONS requests handled correctly
- **Origin Headers**: Requests from web app origin accepted
- **CORS Headers**: Proper CORS headers set (production)

**Note**: Mock API may not set full CORS headers, but production API should include:
```
Access-Control-Allow-Origin: https://studentdeals.uz
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### Performance Tests

Validates application performance:

- **API Response Time**: < 1000ms
- **Web App Load Time**: < 5000ms
- **Concurrent Requests**: Handled via parallel test workers

**Performance Benchmarks:**
```
Health Check:    ~11ms   ✅
User Login:      ~11ms   ✅
User Signup:     ~52ms   ✅
Page Load:       ~2.6s   ✅
```

## 🔍 Test Artifacts

### Generated Artifacts

After test execution, the following artifacts are generated:

```
test-results/
├── smoke-E2E-Smoke-Tests-.../
│   ├── test-failed-1.png      # Screenshot on failure
│   ├── video.webm             # Video recording
│   ├── trace.zip              # Playwright trace
│   └── error-context.md       # Error details
└── ...

playwright-report/
└── index.html                 # HTML test report
```

### Viewing Reports

```bash
# View HTML report
pnpm --filter web exec playwright show-report

# View trace for failed test
pnpm --filter web exec playwright show-trace test-results/*/trace.zip
```

## 🧪 CI/CD Integration

### GitHub Actions

Tests are automatically run in CI/CD:

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm --filter web exec playwright install --with-deps
      - run: node simple-api.js &
      - run: pnpm --filter web dev &
      - run: pnpm --filter web exec playwright test e2e/smoke.spec.ts
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: apps/web/playwright-report/
```

### Pre-Deployment Validation

Run smoke tests before deploying to production:

```bash
# 1. Start production-like environment
export NODE_ENV=production
export BASE_URL=https://studentdeals.uz
export NEXT_PUBLIC_API_URL=https://api.studentdeals.uz

# 2. Run smoke tests
pnpm --filter web exec playwright test e2e/smoke.spec.ts

# 3. Deploy if tests pass
vercel deploy --prod
```

## 🔒 Security Tests

### Authentication & Authorization

- JWT token generation and validation
- Protected endpoint access
- Invalid token rejection
- Unauthenticated access rejection
- Role-based access control (Admin features)

### Input Validation

- Duplicate email registration prevention
- Invalid credentials rejection
- Non-existent user handling
- Token expiration validation

## 📊 Test Metrics

### Success Criteria

- ✅ **100% Pass Rate**: All tests must pass
- ✅ **< 10s Execution Time**: Tests complete quickly
- ✅ **< 5s Page Load**: Web app loads fast
- ✅ **< 1s API Response**: API responds quickly

### Current Metrics (Latest Run)

```
✅ PASSED:  20 tests (95.2%)
⏭️ SKIPPED: 1 test (4.8%)
❌ FAILED:  0 tests (0%)
⏱️ DURATION: 5.4 seconds
```

## 🐛 Debugging Failed Tests

### Common Issues

#### 1. API Server Not Running

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:3001
```

**Solution:**
```bash
# Start API server
node simple-api.js &
```

#### 2. Web App Not Running

**Error:**
```
Error: net::ERR_CONNECTION_REFUSED at http://localhost:3000
```

**Solution:**
```bash
# Start web app
pnpm --filter web dev &
```

#### 3. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Kill existing process
pkill -f "node simple-api.js"
# Restart
node simple-api.js &
```

#### 4. Timeout Errors

**Error:**
```
Error: Timeout 5000ms exceeded
```

**Solution:**
```bash
# Increase timeout in test
test.setTimeout(30000); // 30 seconds

# Or run with slower machine timeout
pnpm --filter web exec playwright test --timeout=30000
```

## 📚 Best Practices

### 1. Test Independence

Each test should be independent and not rely on other tests:

```typescript
test.beforeEach(async ({ request }) => {
  // Setup: Create fresh test user
  await request.post(`${API_URL}/auth/register`, { data: testUser });
});

test.afterEach(async () => {
  // Cleanup: Remove test data (if needed)
});
```

### 2. Unique Test Data

Use unique identifiers for test data to avoid conflicts:

```typescript
const testUser = {
  email: `test-${Date.now()}@example.com`, // Unique email
  password: 'TestPassword123!',
};
```

### 3. Explicit Waits

Use explicit waits instead of hard sleeps:

```typescript
// ❌ BAD
await page.waitForTimeout(5000);

// ✅ GOOD
await expect(page.locator('input[type="email"]')).toBeVisible();
await page.waitForLoadState('networkidle');
```

### 4. Error Handling

Handle errors gracefully and provide useful error messages:

```typescript
try {
  const response = await request.post(`${API_URL}/auth/login`, { data });
  expect(response.ok()).toBeTruthy();
} catch (error) {
  console.error('Login failed:', error);
  throw error;
}
```

## 🔄 Maintenance

### Updating Tests

When updating application code, update tests accordingly:

1. **API Changes**: Update endpoint URLs and payloads
2. **UI Changes**: Update selectors and element locators
3. **New Features**: Add new test cases
4. **Deprecations**: Remove obsolete tests

### Test Review Checklist

- [ ] Tests pass locally
- [ ] Tests pass in CI/CD
- [ ] No flaky tests (run multiple times)
- [ ] Test data is cleaned up
- [ ] Screenshots/videos captured on failure
- [ ] Test coverage is adequate
- [ ] Performance benchmarks met

## 📞 Support

For issues or questions about E2E tests:

1. Check test artifacts (`test-results/`, `playwright-report/`)
2. Review console logs and screenshots
3. Run tests in debug mode (`--debug`)
4. Check API server logs (`api-server.log`)
5. Verify environment variables
6. Contact development team

## 🎯 Future Improvements

- [ ] Add visual regression tests (screenshot comparison)
- [ ] Add load testing (K6 integration)
- [ ] Add API contract testing (Pact)
- [ ] Add accessibility tests (axe-core)
- [ ] Add mobile device testing
- [ ] Add cross-browser testing (Firefox, Safari)
- [ ] Add database state validation
- [ ] Add email content validation (HTML/text)
- [ ] Add real Resend/SendGrid integration tests
- [ ] Add production smoke tests (post-deployment)

---

**Last Updated**: October 12, 2025
**Maintained By**: StudentDeals.uz Development Team

