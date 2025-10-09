# 🔒 Security Configuration

## 📋 Overview

StudentDeals.uz использует многоуровневую защиту для обеспечения безопасности приложения:

- **Frontend (Next.js):** Security headers, CSP, CORS
- **Backend (NestJS):** Helmet, CORS, Rate Limiting, Compression

## 🌐 Frontend Security (apps/web)

### Security Headers

Все security headers настроены в `apps/web/next.config.js` через функцию `headers()`:

#### 1. Content Security Policy (CSP)

```
default-src 'self'; 
script-src 'self' 'unsafe-inline' 'unsafe-eval' vercel.live static.cloudflareinsights.com *.sentry.io; 
style-src 'self' 'unsafe-inline'; 
img-src 'self' data: blob: https:; 
font-src 'self' data: https:; 
connect-src 'self' ${NEXT_PUBLIC_API_URL} https://vercel.live https://vitals.vercel-insights.com *.sentry.io; 
frame-ancestors 'none'; 
base-uri 'self'; 
form-action 'self'
```

**Важно:** `connect-src` динамически включает `NEXT_PUBLIC_API_URL` для API запросов.

#### 2. Другие заголовки

| Header | Value | Описание |
|--------|-------|----------|
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Контроль передачи referrer |
| `X-Content-Type-Options` | `nosniff` | Защита от MIME sniffing |
| `X-Frame-Options` | `DENY` | Защита от clickjacking |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Отключение опасных API |
| `Cross-Origin-Opener-Policy` | `same-origin` | Изоляция окон браузера |
| `Cross-Origin-Resource-Policy` | `same-origin` | Защита ресурсов |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | HTTPS only (prod) |

**Примечание:** HSTS включается только в production (`NODE_ENV === 'production'`).

### Изменение API URL в CSP

При смене `NEXT_PUBLIC_API_URL`, CSP автоматически обновляется:

```javascript
// next.config.js
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const csp = `connect-src 'self' ${apiUrl} ...`;
```

**Локально:**
```bash
# По умолчанию
connect-src 'self' http://localhost:3001 ...

# С переменной окружения
NEXT_PUBLIC_API_URL=https://api.example.com
connect-src 'self' https://api.example.com ...
```

**Production (Vercel):**
```bash
# Environment Variables
NEXT_PUBLIC_API_URL=https://studentdeals-uz.onrender.com
```

## 🛡️ Backend Security (apps/api)

### 1. Helmet

Helmet устанавливает безопасные HTTP заголовки:

```typescript
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'same-origin' },
  contentSecurityPolicy: false, // CSP handled by frontend
}));
```

**Заголовки от Helmet:**
- `X-DNS-Prefetch-Control: off`
- `X-Frame-Options: SAMEORIGIN`
- `Strict-Transport-Security: max-age=15552000; includeSubDomains`
- `X-Download-Options: noopen`
- `X-Content-Type-Options: nosniff`
- `X-Permitted-Cross-Domain-Policies: none`
- `Referrer-Policy: no-referrer`
- `Cross-Origin-Resource-Policy: same-origin`

### 2. CORS Configuration

CORS настраивается через переменную окружения `CORS_ORIGINS`:

```bash
# Format (comma-separated)
CORS_ORIGINS="origin1,origin2,origin3"

# Example
CORS_ORIGINS="http://localhost:3000,https://studentdeals.uz,https://www.studentdeals.uz,https://studentdeals-uz.vercel.app"
```

**Разрешённые методы:**
- GET, HEAD, PUT, PATCH, POST, DELETE

**Разрешённые заголовки:**
- Content-Type, Authorization, X-Requested-With

**Credentials:** Включены (`credentials: true`)

#### Обновление CORS Origins

**Локально:**
```bash
export CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

**Production (Render):**
```bash
# Environment Variables
CORS_ORIGINS=https://studentdeals.uz,https://www.studentdeals.uz,https://studentdeals-uz.vercel.app
```

### 3. Rate Limiting

Rate limiting защищает API от злоупотреблений:

```typescript
ThrottlerModule.forRoot([{
  ttl: Number(process.env.RATE_LIMIT_WINDOW) || 60000, // milliseconds
  limit: Number(process.env.RATE_LIMIT_MAX) || 100,
}])
```

**Переменные окружения:**

| Variable | Default | Описание |
|----------|---------|----------|
| `RATE_LIMIT_WINDOW` | `60000` | Окно в миллисекундах (60 сек) |
| `RATE_LIMIT_MAX` | `100` | Макс. запросов за окно |

**Исключения:**
- Health endpoints (`/`, `/health`, `/health/db`) не лимитируются (`@SkipThrottle()`)

**Ответ при превышении лимита:**
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

#### Настройка Rate Limits

**Development (мягкие лимиты):**
```bash
RATE_LIMIT_WINDOW=60000  # 60 seconds
RATE_LIMIT_MAX=100       # 100 requests
```

**Production (строгие лимиты):**
```bash
RATE_LIMIT_WINDOW=60000  # 60 seconds
RATE_LIMIT_MAX=120       # 120 requests (adjust based on traffic)
```

**Для API endpoints с высокой нагрузкой:**
```typescript
@SkipThrottle()  // Полностью отключить
// или
@Throttle({ default: { limit: 1000, ttl: 60000 } })  // Кастомный лимит
```

### 4. Compression

Gzip compression включён для всех ответов:

```typescript
app.use(compression());
```

**Эффект:**
- Уменьшение размера JSON ответов на 70-90%
- Быстрее загрузка для клиентов
- Меньше трафика

### 5. Trust Proxy

Для корректной работы за Render/Cloudflare:

```typescript
app.set('trust proxy', 1);
```

**Эффект:**
- Корректное определение IP клиента из `X-Forwarded-For`
- Правильная работа rate limiting
- Корректные логи

### 6. X-API-Version Header

Все ответы включают версию API:

```typescript
@Header('X-API-Version', API_VERSION)
```

**Пример:**
```bash
curl -I http://localhost:3001/health
# X-API-Version: 0.1.0
```

## 🧪 Проверка Security Headers

### Frontend (Next.js)

```bash
# Локально
pnpm --filter web build
pnpm --filter web start
curl -I http://localhost:3000

# Production
curl -I https://studentdeals.uz
```

**Ожидаемые заголовки:**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' ...
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload (prod only)
```

### Backend (NestJS)

```bash
# Локально
pnpm --filter api build
pnpm --filter api start:prod
curl -I http://localhost:3001/health

# Production
curl -I https://studentdeals-uz.onrender.com/health
```

**Ожидаемые заголовки:**
```
X-DNS-Prefetch-Control: off
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-Permitted-Cross-Domain-Policies: none
Referrer-Policy: no-referrer
Cross-Origin-Resource-Policy: same-origin
X-API-Version: 0.1.0
Content-Encoding: gzip (если ответ > 1KB)
Access-Control-Allow-Origin: <origin>
Access-Control-Allow-Credentials: true
```

### Rate Limiting Test

```bash
# Быстро отправить 101 запрос
for i in {1..101}; do 
  curl -s http://localhost:3001/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test","password":"test"}' \
    -w "\n%{http_code}\n" | tail -1
done

# Последний запрос должен вернуть 429
```

## 🚀 Production Deployment

### Vercel (Frontend)

**Environment Variables:**
```bash
NEXT_PUBLIC_API_URL=https://studentdeals-uz.onrender.com
NODE_ENV=production
SENTRY_ENVIRONMENT=production
```

**Проверка после деплоя:**
```bash
curl -I https://studentdeals.uz | grep -E "Content-Security-Policy|X-Frame-Options|Strict-Transport-Security"
```

### Render (Backend)

**Environment Variables:**
```bash
CORS_ORIGINS=https://studentdeals.uz,https://www.studentdeals.uz,https://studentdeals-uz.vercel.app
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=120
NODE_ENV=production
```

**Проверка после деплоя:**
```bash
curl -I https://studentdeals-uz.onrender.com/health | grep -E "X-API-Version|X-Content-Type-Options|Access-Control"
```

## 🔧 Troubleshooting

### CSP блокирует ресурсы

**Проблема:** Console показывает CSP violations

**Решение:**
1. Откройте DevTools → Console
2. Найдите заблокированный источник
3. Добавьте источник в соответствующую директиву CSP:

```javascript
// next.config.js
"script-src 'self' 'unsafe-inline' trusted-cdn.com",
"style-src 'self' 'unsafe-inline' fonts.googleapis.com",
"font-src 'self' fonts.gstatic.com",
```

**Важно:** Не используйте `*` wildcard! Добавляйте только доверенные источники.

### CORS ошибки

**Проблема:** Browser показывает CORS error

**Решение:**
1. Проверьте `CORS_ORIGINS` в Render:
```bash
echo $CORS_ORIGINS
```

2. Убедитесь, что origin включён в список:
```bash
CORS_ORIGINS=https://studentdeals.uz,https://www.studentdeals.uz
```

3. Проверьте заголовки:
```bash
curl -H "Origin: https://studentdeals.uz" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://studentdeals-uz.onrender.com/auth/login -v
```

### Rate Limiting слишком строгий

**Проблема:** Получаете 429 Too Many Requests

**Решение:**
1. Увеличьте лимиты в Render:
```bash
RATE_LIMIT_WINDOW=60000  # 60 seconds
RATE_LIMIT_MAX=200       # increase from 100 to 200
```

2. Или отключите для конкретных endpoints:
```typescript
@SkipThrottle()
@Get('/public-endpoint')
```

### Compression не работает

**Проблема:** Ответы не сжимаются

**Решение:**
1. Проверьте заголовок запроса:
```bash
curl -H "Accept-Encoding: gzip" http://localhost:3001/health -v
```

2. Ответ должен содержать:
```
Content-Encoding: gzip
```

3. Compression работает только для ответов > 1KB

## 📊 Security Checklist

### Pre-Deployment

- [ ] CSP настроен с правильным `NEXT_PUBLIC_API_URL`
- [ ] CORS origins включают все production домены
- [ ] Rate limits настроены для production трафика
- [ ] HSTS включён только в production
- [ ] Sentry DSN настроен
- [ ] JWT_SECRET установлен (не дефолтный)
- [ ] DATABASE_URL использует SSL (`?sslmode=require`)

### Post-Deployment

- [ ] Проверить security headers на production
- [ ] Протестировать CORS с production origin
- [ ] Проверить rate limiting (429 при превышении)
- [ ] Проверить compression (Content-Encoding: gzip)
- [ ] Проверить X-API-Version header
- [ ] Проверить Sentry error tracking

## 🔐 Best Practices

### 1. Не используйте wildcard в CSP

❌ **Плохо:**
```javascript
"script-src 'self' *"
"connect-src 'self' https://*"
```

✅ **Хорошо:**
```javascript
"script-src 'self' trusted-cdn.com"
"connect-src 'self' https://api.example.com"
```

### 2. Регулярно обновляйте зависимости

```bash
# Проверить уязвимости
pnpm audit

# Обновить зависимости
pnpm update
```

### 3. Используйте HTTPS везде

- ✅ Production: HTTPS only (HSTS enforced)
- ✅ API: SSL для database connections
- ✅ Cookies: `secure: true` в production

### 4. Храните секреты безопасно

- ❌ Не коммитьте `.env` файлы
- ✅ Используйте Vercel/Render environment variables
- ✅ Ротируйте JWT_SECRET периодически
- ✅ Используйте сильные пароли для DATABASE_URL

### 5. Мониторинг

- ✅ Sentry для отслеживания ошибок
- ✅ Rate limiting логи в Render
- ✅ CORS errors в browser console
- ✅ CSP violations в Sentry

## 📚 Useful Commands

### Check Headers Locally

```bash
# Frontend
curl -I http://localhost:3000 | grep -E "Content-Security-Policy|X-Frame-Options"

# Backend
curl -I http://localhost:3001/health | grep -E "X-API-Version|X-Content-Type-Options"
```

### Check Headers in Production

```bash
# Frontend
curl -I https://studentdeals.uz | grep -E "Strict-Transport-Security|Content-Security-Policy"

# Backend
curl -I https://studentdeals-uz.onrender.com/health | grep -E "X-API-Version|Access-Control"
```

### Test CORS

```bash
curl -H "Origin: https://studentdeals.uz" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://studentdeals-uz.onrender.com/auth/login -v
```

### Test Rate Limiting

```bash
# Send 101 requests quickly
for i in {1..101}; do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test","password":"test"}'
done | tail -5

# Last requests should return 429
```

### Test Compression

```bash
curl -H "Accept-Encoding: gzip" \
     http://localhost:3001/health \
     -v 2>&1 | grep "Content-Encoding"

# Should show: Content-Encoding: gzip
```

## 🌍 Environment Variables Summary

### Frontend (Vercel)

```bash
NEXT_PUBLIC_API_URL=https://studentdeals-uz.onrender.com
NODE_ENV=production
SENTRY_ENVIRONMENT=production
```

### Backend (Render)

```bash
# CORS
CORS_ORIGINS=https://studentdeals.uz,https://www.studentdeals.uz,https://studentdeals-uz.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=120

# Security
JWT_SECRET=<strong-random-secret>
DATABASE_URL=postgresql://...?sslmode=require

# Monitoring
SENTRY_DSN=https://...@sentry.io/...

# Server
PORT=3001
NODE_ENV=production
```

## 🚨 Security Incident Response

### If you detect a security issue:

1. **Не публикуйте детали** в public issues
2. **Свяжитесь с командой** через private channel
3. **Ротируйте секреты:**
   ```bash
   # Generate new JWT_SECRET
   openssl rand -base64 32
   
   # Update in Render
   # Update in Vercel
   ```
4. **Проверьте логи** в Sentry/Render
5. **Обновите зависимости:**
   ```bash
   pnpm update
   pnpm audit fix
   ```

## 📖 References

- [OWASP Secure Headers](https://owasp.org/www-project-secure-headers/)
- [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Helmet.js](https://helmetjs.github.io/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [NestJS Security](https://docs.nestjs.com/security/helmet)

