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
- **Build Command:** `pnpm install --no-frozen-lockfile --prod=false && pnpm --filter api build`
- **Start Command:** `node dist/main.js`
- **Node Version:** 20
- **Package Manager:** pnpm

### Переменные окружения:
- `PORT=10000` - порт сервера
- `NODE_ENV=production` - для продакшена

### Локальная проверка:
```bash
# Установка зависимостей
pnpm install

# Сборка API
pnpm --filter api build

# Запуск
pnpm --filter api start
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
