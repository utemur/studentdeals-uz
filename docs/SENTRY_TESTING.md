# Sentry Testing Guide

This guide helps you test Sentry integration in both the Web app and API.

## Prerequisites

1. **Sentry Account**: Sign up at [sentry.io](https://sentry.io)
2. **Sentry DSN**: Get your DSN from Sentry dashboard
3. **Environment Variables**: Set up as described in `ENVIRONMENT_VARIABLES.md`

## Testing API (NestJS)

### 1. Start the API

```bash
cd apps/api
npm run build
PORT=3001 node dist/main.js
```

### 2. Test Endpoints

The API includes test endpoints (only available in development):

#### Test Error Capture
```bash
curl http://localhost:3001/test-sentry/error
```
**Expected**: Error thrown and captured in Sentry

#### Test Manual Exception
```bash
curl http://localhost:3001/test-sentry/exception
```
**Expected**: Exception manually captured in Sentry

#### Test Message
```bash
curl http://localhost:3001/test-sentry/message
```
**Expected**: Info message sent to Sentry

#### Test Transaction Tracing
```bash
curl -X POST http://localhost:3001/test-sentry/transaction
```
**Expected**: Custom transaction with child spans in Sentry Performance

#### Test Breadcrumbs
```bash
curl http://localhost:3001/test-sentry/breadcrumb
```
**Expected**: Message with breadcrumb trail in Sentry

#### Test User Context
```bash
curl http://localhost:3001/test-sentry/user-context
```
**Expected**: Message with user information in Sentry

#### Test Custom Tags
```bash
curl http://localhost:3001/test-sentry/tags
```
**Expected**: Message with custom tags in Sentry

#### Check Sentry Health
```bash
curl http://localhost:3001/test-sentry/health
```
**Expected**: Sentry configuration status

### 3. Test Real Endpoints

#### Test Auth Registration (with Prisma tracing)
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
**Expected**: Transaction with Prisma query spans in Sentry Performance

#### Test Auth Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
**Expected**: Transaction with HTTP and Prisma spans

### 4. Verify in Sentry Dashboard

Go to your Sentry project and check:

1. **Issues** tab:
   - Should see test errors
   - Should see manual exceptions
   - Should see messages

2. **Performance** tab:
   - Should see transactions
   - Should see HTTP spans
   - Should see Prisma query spans
   - Check P50, P95, P99 response times

3. **Event Details**:
   - User context (if set)
   - Custom tags
   - Breadcrumbs
   - Stack traces

## Testing Web App (Next.js)

### 1. Start the Web App

```bash
cd apps/web
pnpm dev
```

### 2. Create Test Page

Create `apps/web/src/app/[locale]/test-sentry/page.tsx`:

```typescript
'use client';

import * as Sentry from '@sentry/nextjs';

export default function TestSentryPage() {
  const testError = () => {
    throw new Error('Test Sentry error from Web!');
  };

  const testException = () => {
    Sentry.captureException(new Error('Test exception from Web'));
    alert('Exception sent to Sentry');
  };

  const testMessage = () => {
    Sentry.captureMessage('Test message from Web', 'info');
    alert('Message sent to Sentry');
  };

  const testTransaction = async () => {
    await Sentry.startSpan(
      {
        op: 'test.transaction',
        name: 'Test Web Transaction',
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        alert('Transaction traced in Sentry');
      }
    );
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Sentry Test Page</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
        <button onClick={testError}>Test Error</button>
        <button onClick={testException}>Test Exception</button>
        <button onClick={testMessage}>Test Message</button>
        <button onClick={testTransaction}>Test Transaction</button>
      </div>
    </div>
  );
}
```

### 3. Test Browser Tracing

1. Open browser DevTools → Network tab
2. Visit `http://localhost:3000/ru`
3. Navigate between pages
4. Submit forms

**Expected in Sentry**:
- Page load transactions
- Navigation transactions
- API call spans
- Core Web Vitals

### 4. Test Session Replay

1. Visit `http://localhost:3000/ru`
2. Click around, fill forms, navigate
3. Trigger an error (visit `/test-sentry`)

**Expected in Sentry**:
- Session replay recording
- User interactions captured
- Network requests captured
- Console logs captured

### 5. Test Error Boundary

Create an error in a component:

```typescript
// In any component
throw new Error('Test error boundary');
```

**Expected**:
- Error caught by Sentry
- Component stack trace
- Session replay attached

### 6. Verify in Sentry Dashboard

Go to your Sentry project and check:

1. **Issues** tab:
   - Should see browser errors
   - Should see React component errors

2. **Performance** tab:
   - Should see page load transactions
   - Should see navigation transactions
   - Should see API call spans
   - Check Core Web Vitals (LCP, FID, CLS)

3. **Session Replay** tab:
   - Should see recorded sessions
   - Can replay user interactions
   - Can see network requests
   - Can see console logs

## Automated Testing

### API Tests with k6

Test API performance and Sentry tracing:

```bash
cd ops/k6
k6 run smoke.js
```

**Expected**:
- Transactions for each request
- HTTP spans
- Prisma spans (if DB is connected)

### E2E Tests with Playwright

Test web app and Sentry tracing:

```bash
cd apps/web
pnpm test:e2e
```

**Expected**:
- Transactions for page loads
- Transactions for form submissions
- Error capture if tests fail

## Troubleshooting

### No data in Sentry

**Problem**: Tests run but no data appears in Sentry

**Solutions**:
1. Check `SENTRY_DSN` is set correctly
2. Check network connectivity to `sentry.io`
3. Check browser console for Sentry errors
4. Verify sample rate is not 0
5. Wait a few seconds for data to appear

### Too much data

**Problem**: Sentry quota exceeded quickly

**Solutions**:
1. Reduce `tracesSampleRate` to 0.05 (5%)
2. Add more filters in `beforeSendTransaction`
3. Disable session replay in development
4. Filter out test endpoints

### Transactions not showing spans

**Problem**: Transactions appear but no child spans

**Solutions**:
1. Verify integrations are configured correctly
2. Check HTTP integration is enabled
3. Check Prisma integration is enabled
4. Ensure operations are inside a transaction

### Session replay not working

**Problem**: Sessions not recorded

**Solutions**:
1. Check `replaysSessionSampleRate` > 0
2. Verify `replayIntegration` is configured
3. Check browser compatibility (Chrome, Firefox, Safari)
4. Clear browser cache and reload

## Sample Rate Testing

### Test 10% Sampling

To verify 10% sampling works in production:

1. Set `NODE_ENV=production`
2. Make 100 requests
3. Check Sentry dashboard
4. Should see ~10 transactions (±2 due to randomness)

```bash
# Test API sampling
for i in {1..100}; do
  curl -s http://localhost:3001/health > /dev/null
done

# Check Sentry dashboard
# Should see ~10 transactions
```

### Test 100% Sampling

To verify 100% sampling works in development:

1. Set `NODE_ENV=development`
2. Make 10 requests
3. Check Sentry dashboard
4. Should see 10 transactions

```bash
# Test API sampling
for i in {1..10}; do
  curl -s http://localhost:3001/health > /dev/null
done

# Check Sentry dashboard
# Should see 10 transactions
```

## Performance Benchmarks

### Expected Performance Impact

**API (NestJS)**:
- Without Sentry: ~5-10ms per request
- With Sentry (100% sampling): ~6-12ms per request
- With Sentry (10% sampling): ~5-11ms per request
- **Impact**: ~1-2ms overhead

**Web (Next.js)**:
- Without Sentry: ~50-100ms page load
- With Sentry (100% sampling): ~52-105ms page load
- With Sentry (10% sampling): ~50-102ms page load
- **Impact**: ~2-5ms overhead

### Benchmark Commands

```bash
# API benchmark (without Sentry)
ab -n 1000 -c 10 http://localhost:3001/health

# API benchmark (with Sentry)
SENTRY_DSN=your-dsn ab -n 1000 -c 10 http://localhost:3001/health

# Compare results
```

## Best Practices for Testing

1. ✅ **Test in development first**: Use 100% sampling
2. ✅ **Test all error types**: Thrown errors, manual captures, unhandled rejections
3. ✅ **Test transactions**: Verify spans are created correctly
4. ✅ **Test context**: User, tags, breadcrumbs
5. ✅ **Test filters**: Verify sensitive data is removed
6. ✅ **Test sampling**: Verify 10% works in production
7. ✅ **Monitor quota**: Check Sentry usage regularly

## Cleanup

After testing, remove test endpoints and pages:

```bash
# Remove API test controller (already disabled in production)
# Remove web test page
rm apps/web/src/app/[locale]/test-sentry/page.tsx
```

## Support

For issues with Sentry testing:
1. Check Sentry dashboard for errors
2. Check browser/server console logs
3. Review Sentry documentation
4. Contact team lead or DevOps

