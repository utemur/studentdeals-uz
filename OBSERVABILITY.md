# 📊 Observability & Monitoring

## 🎯 Overview

StudentDeals.uz использует **Sentry** для мониторинга ошибок и производительности в обоих приложениях:
- **Frontend (Next.js):** Client-side, Server-side, и Edge runtime
- **Backend (NestJS):** API errors, performance profiling

## 🔧 Sentry Setup

### 1. Создание проекта в Sentry

1. Зарегистрируйтесь на [sentry.io](https://sentry.io)
2. Создайте новую организацию (если нужно)
3. Создайте два проекта:
   - **`studentdeals-web`** (Platform: Next.js)
   - **`studentdeals-api`** (Platform: Node.js)
4. Скопируйте DSN для каждого проекта

### 2. Получение DSN

После создания проекта:
1. Перейдите в **Settings** → **Projects** → **[Your Project]**
2. Выберите **Client Keys (DSN)**
3. Скопируйте **DSN URL**

Формат DSN:
```
https://<key>@<organization>.ingest.sentry.io/<project-id>
```

## 🌐 Environment Variables

### Frontend (apps/web)

#### Vercel Deployment

1. Откройте проект в [Vercel Dashboard](https://vercel.com/dashboard)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте следующие переменные:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SENTRY_DSN` | `https://...@sentry.io/...` | Production, Preview, Development |
| `SENTRY_DSN` | `https://...@sentry.io/...` | Production, Preview, Development |
| `SENTRY_ORG` | `your-org-slug` | Production, Preview |
| `SENTRY_PROJECT` | `studentdeals-web` | Production, Preview |
| `SENTRY_AUTH_TOKEN` | `sntrys_...` | Production, Preview |

**Примечание:** `SENTRY_AUTH_TOKEN` нужен для загрузки source maps. Получить можно в Sentry → Settings → Auth Tokens.

#### Local Development

Создайте `apps/web/.env.local`:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_DSN=https://...@sentry.io/...
```

### Backend (apps/api)

#### Render Deployment

1. Откройте сервис в [Render Dashboard](https://dashboard.render.com)
2. Перейдите в **Environment** → **Environment Variables**
3. Добавьте переменную:

| Variable | Value |
|----------|-------|
| `SENTRY_DSN` | `https://...@sentry.io/...` |

#### Local Development

Создайте `apps/api/.env`:
```bash
SENTRY_DSN=https://...@sentry.io/...
```

## 📦 Installed Packages

### Frontend (apps/web)
```json
{
  "dependencies": {
    "@sentry/nextjs": "^10.19.0"
  }
}
```

### Backend (apps/api)
```json
{
  "dependencies": {
    "@sentry/nestjs": "^10.19.0",
    "@sentry/profiling-node": "^10.19.0"
  }
}
```

## 🔍 Configuration Files

### Frontend

- **`sentry.client.config.ts`** - Client-side configuration
  - Session Replay
  - Error tracking
  - Performance monitoring

- **`sentry.server.config.ts`** - Server-side configuration
  - API route errors
  - Server component errors

- **`sentry.edge.config.ts`** - Edge runtime configuration
  - Middleware errors
  - Edge API routes

- **`next.config.js`** - Sentry webpack plugin
  - Source maps upload
  - Automatic instrumentation
  - Tunnel route: `/monitoring`

### Backend

- **`src/instrument.ts`** - Sentry initialization
  - Performance profiling
  - Error tracking
  - Tracing

- **`src/app.module.ts`** - Sentry integration
  - Global error filter
  - Sentry module

## 🧪 Testing Sentry Integration

### Frontend

1. **Client-side error:**
```typescript
// In any client component
throw new Error("Test client error");
```

2. **Server-side error:**
```typescript
// In any server component or API route
export default async function Page() {
  throw new Error("Test server error");
}
```

3. **Check Sentry Dashboard:**
   - Go to **Issues** tab
   - You should see the test errors

### Backend

1. **Create test endpoint:**
```typescript
@Get('/sentry-test')
testSentry() {
  throw new Error('Test Sentry error!');
}
```

2. **Trigger error:**
```bash
curl http://localhost:3001/sentry-test
```

3. **Check Sentry Dashboard:**
   - Go to **Issues** tab
   - You should see the test error with full stack trace

## 📊 Monitoring Features

### Error Tracking
- ✅ Automatic error capture
- ✅ Stack traces with source maps
- ✅ User context (if authenticated)
- ✅ Breadcrumbs (user actions before error)

### Performance Monitoring
- ✅ API response times
- ✅ Database query performance
- ✅ Page load times
- ✅ Component render times

### Session Replay (Frontend)
- ✅ Visual reproduction of user sessions
- ✅ Console logs
- ✅ Network requests
- ✅ DOM mutations

### Profiling (Backend)
- ✅ CPU profiling
- ✅ Function call stacks
- ✅ Performance bottlenecks

## 🔐 Security Best Practices

### 1. Sensitive Data Filtering

Sentry автоматически фильтрует:
- Пароли
- Токены
- Кредитные карты
- Email адреса (опционально)

### 2. Source Maps

Source maps загружаются только в Sentry и **не доступны** в production bundle:
```javascript
hideSourceMaps: true, // в next.config.js
```

### 3. PII (Personally Identifiable Information)

Настройте фильтрацию в Sentry Dashboard:
1. **Settings** → **Security & Privacy**
2. Enable **Data Scrubbing**
3. Add custom scrubbing rules

## 📈 Alerts & Notifications

### Настройка алертов в Sentry

1. **Issues Alerts:**
   - Settings → Alerts → Create Alert
   - Условие: "First seen" или "Frequency"
   - Действие: Email, Slack, Discord

2. **Performance Alerts:**
   - Settings → Alerts → Create Alert
   - Условие: "Transaction duration"
   - Threshold: > 1000ms

3. **Integrations:**
   - Slack: `/sentry link`
   - Discord: Settings → Integrations → Discord
   - Email: Автоматически

## 🐛 Troubleshooting

### Frontend: Sentry not capturing errors

**Проблема:** Ошибки не появляются в Sentry

**Решение:**
1. Проверьте DSN:
```bash
echo $NEXT_PUBLIC_SENTRY_DSN
```

2. Проверьте инициализацию:
```typescript
// В браузере:
console.log(window.__SENTRY__);
```

3. Проверьте network tab:
   - Должны быть запросы к `sentry.io`
   - Или к `/monitoring` (tunnel route)

### Backend: Sentry not capturing errors

**Проблема:** Ошибки API не появляются в Sentry

**Решение:**
1. Проверьте DSN:
```bash
echo $SENTRY_DSN
```

2. Проверьте инициализацию:
```typescript
// В main.ts добавьте:
console.log('Sentry DSN:', process.env.SENTRY_DSN);
```

3. Проверьте логи:
```bash
# Render logs
render logs --tail

# Local
pnpm --filter api start:prod
```

### Source Maps not working

**Проблема:** Stack traces показывают минифицированный код

**Решение:**
1. Убедитесь, что `SENTRY_AUTH_TOKEN` установлен в Vercel
2. Проверьте логи сборки:
```bash
# Должно быть:
> Uploading source maps to Sentry
```

3. Проверьте в Sentry:
   - Settings → Projects → Releases
   - Должны быть загруженные releases

## 📚 Useful Links

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry NestJS Docs](https://docs.sentry.io/platforms/javascript/guides/nestjs/)
- [Sentry Dashboard](https://sentry.io/organizations/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)

## 🎯 Production Checklist

- [ ] Sentry projects created (web + api)
- [ ] DSN added to Vercel environment variables
- [ ] DSN added to Render environment variables
- [ ] Auth token generated and added to Vercel
- [ ] Test errors captured in Sentry
- [ ] Source maps uploaded successfully
- [ ] Alerts configured
- [ ] Team members invited to Sentry
- [ ] PII scrubbing configured
- [ ] Sample rates adjusted for production

