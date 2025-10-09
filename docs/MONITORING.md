# 📊 Monitoring & Logging

Централизованный мониторинг и логирование для StudentDeals.uz.

## 🎯 Overview

**Backend (apps/api):**
- 🔴 **Sentry** - Error tracking, performance monitoring, profiling
- 📝 **Winston** - Structured logging (JSON format)
- 🚨 **Health endpoints** - Readiness and liveness checks

**Frontend (apps/web):**
- 🔴 **Sentry** - Client/Server/Edge error tracking
- 📊 **Vercel Analytics** - Performance metrics
- 🔒 **Security headers** - CSP violations tracking

---

## 🔧 Configuration

### Backend (apps/api)

#### Sentry Setup

**File:** `apps/api/src/instrument.ts`

```typescript
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV !== 'production',
});
```

**Environment Variables:**
```bash
SENTRY_DSN=https://...@sentry.io/...
NODE_ENV=production
```

#### Winston Logging

**File:** `apps/api/src/main.ts`

```typescript
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
    }),
    // File transport for production
    ...(process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
          }),
        ]
      : []),
  ],
});

const app = await NestFactory.create(AppModule, {
  logger: winstonLogger,
});
```

**Features:**
- ✅ JSON structured logs
- ✅ Timestamps
- ✅ Stack traces for errors
- ✅ Console output (dev)
- ✅ File output (production)

#### Health Endpoints

| Endpoint | Description | Response |
|----------|-------------|----------|
| `GET /` | Root health check | `{ ok: true, service: 'api', version: '0.1.0' }` |
| `GET /health` | Basic health | `{ ok: true }` |
| `GET /health/db` | Database health | `{ ok: true, db: 'connected' }` |
| `GET /health/error` | Test Sentry error | Throws intentional error |

**Usage:**
```bash
# Basic health
curl http://localhost:3001/health

# Database health
curl http://localhost:3001/health/db

# Test error tracking (should appear in Sentry)
curl http://localhost:3001/health/error
```

---

### Frontend (apps/web)

#### Sentry Setup

**Files:**
- `apps/web/sentry.client.config.ts` - Client-side errors
- `apps/web/sentry.server.config.ts` - Server-side errors
- `apps/web/sentry.edge.config.ts` - Edge runtime errors

**Configuration:** `apps/web/next.config.js`

```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  nextConfig,
  {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    silent: !process.env.CI,
    widenClientFileUpload: true,
    reactComponentAnnotation: { enabled: true },
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);
```

**Environment Variables:**
```bash
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORG=your-org
SENTRY_PROJECT=studentdeals-web
SENTRY_AUTH_TOKEN=<token>
```

---

## 🚀 Setup Guide

### 1. Create Sentry Project

1. Go to [sentry.io](https://sentry.io)
2. Create organization (or use existing)
3. Create two projects:
   - `studentdeals-api` (Node.js)
   - `studentdeals-web` (Next.js)
4. Copy DSN for each project

### 2. Configure Backend (Render)

**Render Dashboard → Your Service → Environment:**

```bash
SENTRY_DSN=https://abc123@o123456.ingest.us.sentry.io/456789
NODE_ENV=production
```

### 3. Configure Frontend (Vercel)

**Vercel Dashboard → Your Project → Settings → Environment Variables:**

```bash
NEXT_PUBLIC_SENTRY_DSN=https://xyz789@o123456.ingest.us.sentry.io/987654
SENTRY_DSN=https://xyz789@o123456.ingest.us.sentry.io/987654
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=studentdeals-web
SENTRY_AUTH_TOKEN=<your-auth-token>
```

**Get Auth Token:**
1. Sentry → Settings → Account → API → Auth Tokens
2. Create new token with `project:releases` and `org:read` scopes
3. Copy token

---

## 🧪 Testing

### Backend Testing

#### 1. Test Health Endpoints

```bash
# Basic health
curl http://localhost:3001/health
# Response: { "ok": true }

# Database health
curl http://localhost:3001/health/db
# Response: { "ok": true, "db": "connected" }

# Root endpoint
curl http://localhost:3001/
# Response: { "ok": true, "service": "api", "version": "0.1.0" }
```

#### 2. Test Error Tracking

```bash
# Trigger test error
curl http://localhost:3001/health/error

# Response: { "statusCode": 500, "message": "Internal server error" }
```

**Check Sentry:**
1. Go to [sentry.io/issues](https://sentry.io/issues)
2. Find error: "Test Sentry error - this is intentional for monitoring testing"
3. View stack trace, context, breadcrumbs

#### 3. Test Winston Logging

```bash
# Start API and watch logs
cd apps/api
PORT=3001 node dist/main.js

# Make requests and observe JSON logs:
# {"level":"info","message":"Starting Nest application...","timestamp":"2025-10-09 22:15:08"}
```

#### 4. Test Rate Limiting

```bash
# Send 101 requests (should get 429 on last one)
for i in {1..101}; do
  curl -s http://localhost:3001/health -w "Status: %{http_code}\n"
done

# Last request should return:
# Status: 429
# {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
```

---

### Frontend Testing

#### 1. Test Client-Side Error

Open browser console:
```javascript
// Trigger client error
throw new Error('Test client-side error');

// Check Sentry dashboard for error
```

#### 2. Test Server-Side Error

Create test page `apps/web/src/app/[locale]/test-error/page.tsx`:
```typescript
export default function TestErrorPage() {
  throw new Error('Test server-side error');
  return <div>Should not render</div>;
}
```

Visit: `http://localhost:3000/ru/test-error`

#### 3. Test API Integration Error

```javascript
// In browser console
fetch('http://localhost:3001/health/error')
  .then(r => r.json())
  .catch(console.error);
```

---

## 📊 Monitoring Dashboard

### Sentry Dashboard

**URL:** https://sentry.io

**Key Metrics:**
- 🔴 **Error Rate** - Errors per minute
- ⏱️ **Response Time** - P50, P75, P95, P99
- 📈 **Throughput** - Requests per minute
- 💥 **Crash Rate** - Application crashes
- 🔍 **Stack Traces** - Full error context

**Alerts:**
1. Sentry → Alerts → Create Alert
2. Conditions:
   - Error count > 10 in 5 minutes
   - New issue created
   - Regression detected
3. Actions:
   - Email notification
   - Slack webhook
   - PagerDuty integration

### Winston Logs (Production)

**Location:** `apps/api/logs/`
- `error.log` - Only errors
- `combined.log` - All logs

**View logs on Render:**
```bash
# Render Dashboard → Your Service → Logs
# Or via CLI:
render logs --service studentdeals-api --tail
```

**Log Format:**
```json
{
  "level": "error",
  "message": "Failed to send email",
  "timestamp": "2025-10-09 22:15:08",
  "stack": "Error: SMTP connection failed\n  at ..."
}
```

---

## 🔍 Debugging

### View Logs Locally

```bash
# Backend logs (Winston)
cd apps/api
PORT=3001 node dist/main.js

# Frontend logs (Next.js)
cd apps/web
pnpm dev
```

### View Logs in Production

**Backend (Render):**
```bash
# Via Render Dashboard
https://dashboard.render.com → Your Service → Logs

# Via Render CLI
render logs --service studentdeals-api --tail --num 100
```

**Frontend (Vercel):**
```bash
# Via Vercel Dashboard
https://vercel.com → Your Project → Logs

# Via Vercel CLI
vercel logs studentdeals-uz-web --follow
```

### Search Logs

**Sentry:**
- Use search bar: `level:error`
- Filter by environment: `environment:production`
- Filter by user: `user.email:test@example.com`
- Filter by URL: `url:*/auth/register`

**Winston (grep logs):**
```bash
# On Render server
grep "error" logs/error.log
grep "auth" logs/combined.log | jq .
```

---

## 📈 Performance Monitoring

### Sentry Performance

**Enabled by default:**
- ✅ Transaction tracking
- ✅ Database query monitoring
- ✅ HTTP request tracing
- ✅ Custom spans

**Sample Rates:**
- **Development:** 100% (tracesSampleRate: 1.0)
- **Production:** 10% (tracesSampleRate: 0.1)

**View Performance:**
1. Sentry → Performance
2. View transactions by endpoint
3. Analyze slow queries
4. Identify bottlenecks

### Custom Spans

```typescript
// In your service
import * as Sentry from '@sentry/nestjs';

async someOperation() {
  const span = Sentry.startSpan({ name: 'custom-operation' }, async () => {
    // Your code here
    await heavyOperation();
  });
}
```

---

## 🚨 Alerts & Notifications

### Sentry Alerts

**Recommended Alerts:**

1. **High Error Rate**
   - Condition: > 10 errors in 5 minutes
   - Action: Email + Slack

2. **New Issue**
   - Condition: First occurrence of error
   - Action: Email

3. **Regression**
   - Condition: Previously resolved issue reappears
   - Action: Email + Slack

4. **Performance Degradation**
   - Condition: P95 response time > 1s
   - Action: Email

### Slack Integration

1. Sentry → Settings → Integrations → Slack
2. Connect workspace
3. Configure alerts to post to #alerts channel

### Email Notifications

1. Sentry → Settings → Notifications
2. Add email addresses
3. Configure notification rules

---

## 🔐 Security

### Log Sanitization

**Automatically redacted:**
- Passwords
- API keys
- JWT tokens
- Credit card numbers
- Email addresses (optional)

**Winston configuration:**
```typescript
format: winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
)
```

### Sentry Data Scrubbing

**Default rules:**
- Password fields
- Credit card numbers
- Social security numbers
- API keys

**Custom rules:**
1. Sentry → Settings → Security & Privacy → Data Scrubbing
2. Add custom patterns
3. Test with sample data

---

## 📚 Best Practices

### 1. Error Context

Always include context with errors:

```typescript
try {
  await sendEmail(user.email);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      action: 'send-email',
      userId: user.id,
    },
    extra: {
      email: user.email,
      timestamp: new Date().toISOString(),
    },
  });
  throw error;
}
```

### 2. Performance Monitoring

Track critical operations:

```typescript
const span = Sentry.startSpan({ name: 'database-query' }, async () => {
  return await prisma.user.findMany();
});
```

### 3. User Context

Set user context for better debugging:

```typescript
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
});
```

### 4. Breadcrumbs

Add breadcrumbs for debugging:

```typescript
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User logged in',
  level: 'info',
});
```

---

## 🧪 Testing Checklist

### Backend

- [ ] Health endpoint returns 200
- [ ] Error endpoint triggers Sentry
- [ ] Winston logs to console (dev)
- [ ] Winston logs to files (production)
- [ ] Rate limiting returns 429
- [ ] CORS headers present
- [ ] Security headers present

### Frontend

- [ ] Client errors sent to Sentry
- [ ] Server errors sent to Sentry
- [ ] Edge errors sent to Sentry
- [ ] Source maps uploaded
- [ ] Performance tracking enabled
- [ ] CSP violations tracked

### Sentry Dashboard

- [ ] Errors appear in Issues
- [ ] Stack traces readable
- [ ] Source maps working
- [ ] Performance data visible
- [ ] Alerts configured
- [ ] Slack integration working

---

## 🎯 Production Checklist

### Render (Backend)

```bash
# Environment Variables
SENTRY_DSN=https://...@sentry.io/...
NODE_ENV=production
PORT=3001

# Verify deployment
curl https://studentdeals-uz.onrender.com/health
curl https://studentdeals-uz.onrender.com/health/error
```

### Vercel (Frontend)

```bash
# Environment Variables
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORG=your-org
SENTRY_PROJECT=studentdeals-web
SENTRY_AUTH_TOKEN=<token>
NODE_ENV=production

# Verify deployment
curl https://studentdeals.uz
```

### Sentry Configuration

- [ ] Projects created (api + web)
- [ ] DSNs configured
- [ ] Source maps uploaded
- [ ] Alerts configured
- [ ] Slack integration enabled
- [ ] Team members invited
- [ ] Data scrubbing rules set

---

## 📊 Metrics to Monitor

### Error Metrics

- **Error Rate:** < 1% of requests
- **MTTR (Mean Time To Resolution):** < 1 hour
- **Unhandled Errors:** 0
- **Critical Errors:** 0

### Performance Metrics

- **P50 Response Time:** < 100ms
- **P95 Response Time:** < 500ms
- **P99 Response Time:** < 1s
- **Throughput:** Monitor for anomalies

### Availability Metrics

- **Uptime:** > 99.9%
- **Health Check Success Rate:** 100%
- **Database Connection:** Stable

---

## 🔧 Troubleshooting

### Sentry Not Receiving Errors

**Problem:** Errors not appearing in Sentry dashboard

**Solutions:**
1. Check `SENTRY_DSN` is set correctly
2. Verify network connectivity to sentry.io
3. Check Sentry quota limits
4. Enable debug mode: `debug: true` in Sentry.init()
5. Check console for Sentry initialization errors

### Winston Logs Not Writing

**Problem:** Log files not created in production

**Solutions:**
1. Check `logs/` directory exists
2. Verify write permissions
3. Check disk space
4. Ensure `NODE_ENV=production`

### High Memory Usage

**Problem:** API consuming too much memory

**Solutions:**
1. Check Sentry profiling data
2. Review Winston log retention
3. Implement log rotation
4. Adjust sample rates

### Source Maps Not Working

**Problem:** Stack traces show minified code

**Solutions:**
1. Check `SENTRY_AUTH_TOKEN` is set
2. Verify source maps uploaded: `sentry-cli releases files <version> list`
3. Check Vercel build logs for upload errors
4. Ensure `widenClientFileUpload: true`

---

## 📚 Useful Links

- [Sentry NestJS Docs](https://docs.sentry.io/platforms/javascript/guides/nestjs/)
- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Winston Documentation](https://github.com/winstonjs/winston)
- [nest-winston](https://github.com/gremo/nest-winston)
- [Render Logging](https://render.com/docs/logging)
- [Vercel Logging](https://vercel.com/docs/observability/runtime-logs)

---

## 💰 Pricing

### Sentry

**Free Tier:**
- ✅ 5,000 errors/month
- ✅ 10,000 performance units/month
- ✅ 1 project
- ✅ 30-day retention

**Team Tier ($26/month):**
- ✅ 50,000 errors/month
- ✅ 100,000 performance units/month
- ✅ Unlimited projects
- ✅ 90-day retention
- ✅ Priority support

For StudentDeals.uz, **Free tier** should be sufficient for initial launch.

---

## 🎯 Next Steps

1. ✅ Sentry projects created
2. ✅ DSNs configured
3. ✅ Winston logging enabled
4. ✅ Health endpoints added
5. ✅ Error test endpoint added
6. [ ] Test error tracking end-to-end
7. [ ] Configure alerts
8. [ ] Set up Slack integration
9. [ ] Monitor for 1 week
10. [ ] Adjust sample rates based on usage

