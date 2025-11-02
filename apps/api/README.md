# API Backend

NestJS backend для платформы Student Deals Uzbekistan.

## Особенности

- **NestJS** - современный Node.js фреймворк
- **TypeScript** - полная поддержка типов
- **CORS** - настроен для https://studentdeals.uz
- **Health Check** - endpoint `/health` для мониторинга
- **Swagger** - документация API на `/api/docs`
- **Render Ready** - готов к деплою на Render

## API Endpoints

### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "ok"
}
```

### Swagger Documentation
```
GET /api/docs
```

## Разработка

### Dev запуск

```bash
# Установка зависимостей
pnpm install

# Генерация Prisma Client
pnpm --filter api run prisma:generate

# Запуск в режиме разработки (с hot-reload)
pnpm --filter api run start:dev
```

**API:** http://localhost:3001  
**Health:** GET /health

### Другие команды

```bash
# Сборка
pnpm --filter api build

# Запуск продакшен сборки
pnpm --filter api start

# Prisma Studio (GUI для БД)
pnpm --filter api run prisma:studio

# Миграции БД
pnpm --filter api run prisma:migrate
```

## Деплой на Render

### Настройки Render:

**Важно:** Для монорепозитория нужно использовать **Root Directory: корень проекта** (не `apps/api`), чтобы pnpm мог установить зависимости для всего workspace.

#### Обязательные настройки:
- **Root Directory:** `.` (корень проекта, оставьте пустым или установите `/`)
- **Node Version:** 20
- **Package Manager:** pnpm

#### Команды:

**Build Command:**
```bash
npm install -g pnpm && pnpm install --frozen-lockfile && pnpm --filter api build
```

**Start Command:**
```bash
pnpm --filter api start:prod
```

### Переменные окружения:

Обязательные переменные:
- `DATABASE_URL` - PostgreSQL connection string (Render автоматически предоставляет для PostgreSQL services)
- `PORT` - порт сервера (обычно Render устанавливает автоматически, но можно явно указать)
- `NODE_ENV=production` - окружение

Опциональные переменные:
- `PRISMA_LOG_LEVEL` - уровень логирования Prisma (например, `query`, `info`, `warn`, `error`)
- `JWT_SECRET` - секретный ключ для JWT токенов
- `RESEND_API_KEY` - API ключ для отправки email через Resend
- `EMAIL_FROM` - адрес отправителя email
- `APP_URL` - URL приложения для генерации ссылок
- `ALLOWED_ORIGINS` - разрешенные origins для CORS (через запятую)
- `SENTRY_DSN` - DSN для Sentry мониторинга

### Примечания по деплою:

1. **Prisma Client генерируется автоматически** при выполнении `pnpm install` благодаря скрипту `postinstall: "prisma generate"` в `package.json`
2. **Prisma CLI доступен** в production благодаря тому, что `prisma` находится в `dependencies` (не в `devDependencies`)
3. **Команды используют `--filter api`** для работы с API сервисом из корня монорепозитория

### Локальная проверка:
```bash
# Установка зависимостей из корня монорепозитория
cd /path/to/StudentDeals.uz
pnpm install

# Переход в директорию API
cd apps/api

# Генерация Prisma Client (выполняется автоматически при postinstall)
pnpm prisma generate

# Сборка
pnpm build

# Запуск продакшен сборки
pnpm start:prod
```

## Структура

```
src/
├── main.ts              # Точка входа с CORS, Swagger, валидацией
├── app.module.ts        # Корневой модуль с ConfigModule
├── app.controller.ts    # Основной контроллер
├── app.service.ts       # Основной сервис
└── health.controller.ts # Health check с Swagger документацией
```

## Middleware

### Compression

API использует gzip/deflate compression для оптимизации размера ответов.

**Конфигурация:**
```typescript
import compression from 'compression';
app.use(compression());
```

**Особенности:**
- ✅ Автоматическое сжатие всех ответов > 1KB
- ✅ Поддержка gzip и deflate
- ✅ Снижение трафика на ~70-80%
- ✅ Улучшение скорости загрузки

**Отключение для конкретных роутов:**
```typescript
// В контроллере
@Header('Content-Encoding', 'identity')
@Get('large-file')
getLargeFile() {
  // Compression будет отключен для этого роута
}
```

### Helmet

Безопасные HTTP заголовки через helmet.

**Конфигурация:**
```typescript
import helmet from 'helmet';
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'same-origin' },
  contentSecurityPolicy: false, // CSP handled by Next.js
}));
```

**Применённые заголовки:**
- Cross-Origin-Opener-Policy: same-origin
- Cross-Origin-Resource-Policy: same-origin
- Referrer-Policy: no-referrer
- Strict-Transport-Security: max-age=15552000
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 0

### Rate Limiting

Глобальный rate limit через @nestjs/throttler.

**Конфигурация:**
```typescript
ThrottlerModule.forRoot([{
  ttl: 60000, // 60 seconds = 1 minute
  limit: 100, // 100 requests per minute per IP
}])
```

**Ответ при превышении:**
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

## CORS

API настроен для работы с:
- `https://studentdeals.uz` (продакшен)
- `https://www.studentdeals.uz` (продакшен)
- `http://localhost:*` (разработка, любой порт)
- Requests без origin (curl, mobile apps)
