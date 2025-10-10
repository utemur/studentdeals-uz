# Sentry Configuration Guide

This document describes the Sentry performance monitoring and error tracking configuration for StudentDeals.uz.

## Overview

Sentry is configured for both the Next.js web app and NestJS API with:
- **Browser tracing** with Next.js App Router instrumentation
- **Server-side tracing** with HTTP and Prisma instrumentation
- **Performance monitoring** with 10% sample rate in production
- **Error tracking** with full context
- **Session replay** for debugging user issues

## Environment Variables

### Web App (Next.js)

Add these to your `.env.local` (development) and Vercel environment variables (production):

```bash
# Required: Sentry DSN (get from Sentry dashboard)
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Optional: Environment name (defaults to NODE_ENV)
NEXT_PUBLIC_ENVIRONMENT=production

# Optional: Traces sample rate (defaults to 0.1 in prod, 1.0 in dev)
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1

# Optional: Enable debug mode (only in development)
NEXT_PUBLIC_SENTRY_DEBUG=false
```

### API (NestJS)

Add these to your `.env` (development) and Render/deployment environment variables (production):

```bash
# Required: Sentry DSN (get from Sentry dashboard)
SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Optional: Traces sample rate (defaults to 0.1 in prod, 1.0 in dev)
SENTRY_TRACES_SAMPLE_RATE=0.1

# Optional: Profiles sample rate (defaults to 0.1 in prod, 1.0 in dev)
SENTRY_PROFILES_SAMPLE_RATE=0.1

# Optional: Enable debug mode (only in development)
SENTRY_DEBUG=false

# Optional: Release version (set via CI/CD)
SENTRY_RELEASE=1.0.0
```

## Sample Rates Explained

### Traces Sample Rate
- **Production**: `0.1` (10%) - Only 10% of transactions are sent to Sentry
- **Development**: `1.0` (100%) - All transactions are sent for debugging
- **Why 10%?**: Reduces Sentry quota usage while still providing meaningful performance data

### Profiles Sample Rate
- **Production**: `0.1` (10%) - Only 10% of traced transactions include profiling data
- **Development**: `1.0` (100%) - All traced transactions include profiling
- **Note**: This is relative to `tracesSampleRate`, so actual profiling rate = traces × profiles

### Session Replay Sample Rate (Web only)
- **Production**: `0.1` (10%) - 10% of sessions are recorded
- **On Error**: `1.0` (100%) - All sessions with errors are recorded
- **Development**: `0.5` (50%) - Half of sessions are recorded for testing

## What is Traced?

### Web App (Browser)
- ✅ Page navigation and route changes
- ✅ User interactions (clicks, form submissions)
- ✅ API calls to backend
- ✅ Long tasks that block the main thread
- ✅ Interaction to Next Paint (INP) metrics
- ✅ Core Web Vitals (LCP, FID, CLS)

### Web App (Server)
- ✅ Server-side rendering (SSR)
- ✅ API route handlers
- ✅ Outgoing HTTP requests
- ✅ Next.js middleware execution

### API (NestJS)
- ✅ HTTP requests (incoming/outgoing)
- ✅ Prisma database queries
- ✅ Controller methods
- ✅ Service methods
- ✅ Middleware execution
- ✅ Error handling

## Filtered Transactions

To reduce noise and quota usage, these transactions are **not** sent to Sentry:

### Web App
- Static assets (`/_next/static/*`)
- Health check endpoints (`/health`)
- Development warnings

### API
- Health check endpoints (`/health`, `/health/db`)
- OPTIONS requests (CORS preflight)
- Development warnings

## Ignored Errors

Common errors that are **not** sent to Sentry:

### Web App
- Browser extension errors (`top.GLOBALS`)
- ResizeObserver loop errors
- Network errors (`Failed to fetch`)
- Non-Error promise rejections

### API
- Connection errors (`ECONNREFUSED`, `ENOTFOUND`, `ETIMEDOUT`)
- Prisma unique constraint violations (`P2002`)

## Security & Privacy

### Sensitive Data Filtering

All Sentry configurations include filters to remove sensitive data:

**Web App:**
- Masks all text in session replays (production only)
- Blocks all media in session replays (production only)
- Captures network requests to API only

**API:**
- Removes `Authorization` headers
- Removes `Cookie` headers
- Filters out sensitive request data

## Performance Impact

### Web App
- **Browser tracing**: Minimal impact (~1-2ms per transaction)
- **Session replay**: ~50KB per minute of recording
- **Network overhead**: Only 10% of sessions in production

### API
- **HTTP tracing**: Minimal impact (~0.5-1ms per request)
- **Prisma tracing**: ~0.5ms per query
- **Profiling**: ~2-5% CPU overhead (only 10% of transactions)

## Monitoring & Alerts

### Recommended Sentry Alerts

1. **Error Rate Alert**
   - Trigger: Error rate > 5% for 5 minutes
   - Action: Notify team via Slack/email

2. **Performance Degradation**
   - Trigger: P95 response time > 1000ms for 10 minutes
   - Action: Notify team via Slack/email

3. **Database Query Performance**
   - Trigger: P95 Prisma query time > 500ms for 5 minutes
   - Action: Notify team via Slack/email

### Key Metrics to Monitor

**Web App:**
- Page load time (P50, P95)
- API call duration
- Core Web Vitals
- Error rate by page

**API:**
- Request duration (P50, P95, P99)
- Database query duration
- Error rate by endpoint
- Throughput (requests per minute)

## Testing Sentry Integration

### Web App

```bash
# Development
cd apps/web
pnpm dev

# Trigger a test error
# Visit: http://localhost:3000/test-sentry-error

# Check Sentry dashboard for:
# - Error captured
# - Transaction recorded
# - Session replay (if enabled)
```

### API

```bash
# Development
cd apps/api
npm run start:dev

# Trigger a test error
curl -X POST http://localhost:3001/test-sentry-error

# Check Sentry dashboard for:
# - Error captured
# - HTTP transaction recorded
# - Prisma query spans
```

## Troubleshooting

### No data in Sentry

1. **Check DSN**: Ensure `SENTRY_DSN` is set correctly
2. **Check sample rate**: In production, only 10% of transactions are sent
3. **Check network**: Ensure app can reach `sentry.io`
4. **Check environment**: Verify `NODE_ENV` is set correctly

### Too much data / quota exceeded

1. **Reduce sample rate**: Lower `SENTRY_TRACES_SAMPLE_RATE` to 0.05 (5%)
2. **Add more filters**: Update `beforeSendTransaction` to filter more routes
3. **Disable session replay**: Set `replaysSessionSampleRate: 0`
4. **Upgrade Sentry plan**: Consider higher quota plan

### Performance issues

1. **Reduce profiling**: Lower `SENTRY_PROFILES_SAMPLE_RATE` to 0.05
2. **Disable session replay**: Set `replaysSessionSampleRate: 0`
3. **Increase sample rate threshold**: Only trace slow requests

## Best Practices

1. ✅ **Use environment-specific DSNs**: Separate projects for dev/staging/prod
2. ✅ **Set meaningful release names**: Use git commit SHA or version number
3. ✅ **Add custom context**: Include user ID, tenant ID, etc.
4. ✅ **Filter sensitive data**: Remove PII from error reports
5. ✅ **Monitor quota usage**: Set up alerts for quota thresholds
6. ✅ **Review ignored errors**: Periodically check if filters are too aggressive
7. ✅ **Use source maps**: Enable for better error stack traces

## Additional Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry NestJS Documentation](https://docs.sentry.io/platforms/javascript/guides/nestjs/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Sentry Session Replay](https://docs.sentry.io/product/session-replay/)

## Support

For issues or questions about Sentry configuration:
1. Check this documentation
2. Review Sentry dashboard for errors
3. Check application logs
4. Contact team lead or DevOps

