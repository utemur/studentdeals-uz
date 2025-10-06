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

```bash
# Установка зависимостей
pnpm install

# Запуск в режиме разработки
pnpm dev

# Сборка
pnpm build

# Запуск продакшен сборки
pnpm start

# Проверка типов
pnpm typecheck
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

## CORS

API настроен для работы с:
- `https://studentdeals.uz` (продакшен)
- `http://localhost:3000` (разработка)
