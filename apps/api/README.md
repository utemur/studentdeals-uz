# API Backend

NestJS backend для платформы Student Deals Uzbekistan.

## Особенности

- **NestJS** - современный Node.js фреймворк
- **TypeScript** - полная поддержка типов
- **CORS** - настроен для https://studentdeals.uz
- **Health Check** - endpoint `/health` для мониторинга
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

# Линтинг
pnpm lint
```

## Деплой на Render

### Настройки Render:
- **Build Command:** `pnpm build`
- **Start Command:** `pnpm start`
- **Node Version:** 20
- **Package Manager:** pnpm

### Переменные окружения:
- `PORT` - порт сервера (автоматически устанавливается Render)
- `NODE_ENV=production` - для продакшена

## Структура

```
src/
├── main.ts              # Точка входа приложения
├── app.module.ts        # Корневой модуль
└── health.controller.ts # Health check контроллер
```

## CORS

API настроен для работы с:
- `https://studentdeals.uz` (продакшен)
- `http://localhost:3000` (разработка)
