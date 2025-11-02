# Student Deals Uzbekistan

[![CI](https://github.com/timsalley/StudentDeals.uz/actions/workflows/ci.yml/badge.svg)](https://github.com/timsalley/StudentDeals.uz/actions/workflows/ci.yml)
[![Build Web](https://github.com/timsalley/StudentDeals.uz/actions/workflows/build-web.yml/badge.svg)](https://github.com/timsalley/StudentDeals.uz/actions/workflows/build-web.yml)
[![E2E Tests](https://github.com/timsalley/StudentDeals.uz/actions/workflows/e2e.yml/badge.svg)](https://github.com/timsalley/StudentDeals.uz/actions/workflows/e2e.yml)

Монорепозиторий для платформы студенческих предложений в Узбекистане, построенный с использованием pnpm и Turborepo.

## Структура проекта

```
├── apps/
│   └── web/                 # Next.js веб-приложение
├── packages/
│   ├── config/             # Общие конфигурации (ESLint, Prettier, TypeScript)
│   ├── types/              # Общие TypeScript типы
│   └── ui/                 # Переиспользуемые UI компоненты
├── .github/workflows/      # GitHub Actions CI/CD
└── package.json           # Корневой package.json с workspace
```

## Технологии

- **Монорепозиторий**: pnpm workspaces + Turborepo
- **Веб-приложение**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI**: Переиспользуемые компоненты с Tailwind CSS
- **Интернационализация**: next-intl (русский/узбекский)
- **PWA**: Service Worker + Manifest
- **CI/CD**: GitHub Actions
- **Node.js**: >= 20

## Быстрый старт

### Предварительные требования

- Node.js >= 20
- pnpm >= 8

### Установка

```bash
# Клонирование репозитория
git clone <repository-url>
cd StudentDeals.uz

# Установка зависимостей
pnpm install

# Запуск в режиме разработки
pnpm dev

# Сборка всех пакетов
pnpm build
```

### Доступные скрипты

```bash
# Разработка
pnpm dev                    # Запуск всех приложений в dev режиме
pnpm dev:web               # Запуск только веб-приложения

# Сборка
pnpm build                 # Сборка всех пакетов
pnpm build:web            # Сборка только веб-приложения

# Линтинг и проверка типов
pnpm lint                 # Линтинг всех пакетов
pnpm typecheck           # Проверка типов всех пакетов

# Очистка
pnpm clean               # Очистка всех build артефактов
```

## Пакеты

### `apps/web`
Next.js веб-приложение с поддержкой:
- App Router
- TypeScript
- Tailwind CSS
- PWA (Service Worker + Manifest)
- Интернационализация (ru/uz)
- Базовые страницы: `/` и `/health`

### `packages/types`
Общие TypeScript типы и интерфейсы:
- `User` - пользовательские данные
- `Offer` - предложения и скидки
- `Merchant` - данные партнеров

### `packages/ui`
Переиспользуемые UI компоненты:
- `Button` - кнопки с различными вариантами
- `Card` - карточки с заголовком, контентом и футером
- `Container` - контейнеры с адаптивной шириной

### `packages/config`
Общие конфигурации:
- ESLint правила
- Prettier настройки
- TypeScript конфигурации

## Разработка

### Добавление нового пакета

```bash
# Создание нового пакета в packages/
mkdir packages/new-package
cd packages/new-package
pnpm init
```

### Работа с зависимостями

```bash
# Добавление зависимости в конкретный пакет
pnpm add <package> --filter <package-name>

# Добавление зависимости в корень
pnpm add -w <package>
```

## CI/CD

GitHub Actions автоматически выполняет проверки при каждом push/PR в `main`:

### 🔄 CI Pipeline

**Три параллельных job'а:**

1. **Typecheck** (`typecheck`)
   - Проверка типов TypeScript
   - Команда: `pnpm -w typecheck`
   - Matrix: Node.js 20.x

2. **Lint** (`lint`)
   - Проверка кода с ESLint
   - Команда: `pnpm -w lint`
   - Matrix: Node.js 20.x

3. **Test** (`test`)
   - Запуск тестов (если есть)
   - Команда: `pnpm -w test --if-present`
   - Matrix: Node.js 20.x

4. **Build Web** (`build-web`)
   - Сборка Next.js приложения
   - Команда: `pnpm -C apps/web build`
   - Запускается только если изменились файлы в `apps/web/**` или `packages/**`
   - Загружает артефакты `.next/static` (хранятся 7 дней)
   - Зависит от: typecheck, lint, test

### ⚡ Оптимизация

**Кэширование:**
- ✅ pnpm store (по хешу `pnpm-lock.yaml`)
- ✅ node_modules (по хешу `pnpm-lock.yaml`)
- ✅ Concurrency: отменяет предыдущие запуски при новом push

**Производительность:**
- Параллельное выполнение typecheck, lint, test
- Build только при изменении релевантных файлов
- Кэш node_modules ускоряет установку до ~30 секунд

### 🎯 Триггеры

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### 📦 Артефакты

Build артефакты сохраняются на 7 дней:
- **Имя:** `web-build-${{ github.sha }}`
- **Путь:** `apps/web/.next/static`
- **Retention:** 7 дней

### 🧪 Локальное тестирование CI

```bash
# Запустить все проверки локально
pnpm install --frozen-lockfile
pnpm -w typecheck
pnpm -w lint
pnpm -w test --if-present
pnpm -C apps/web build
```

---

## 🚀 Environments

### Development (Local)

**Frontend:**
- URL: http://localhost:3000
- Environment: `NEXT_PUBLIC_ENV=development`
- API: http://localhost:3001 (auto-resolved)

**Backend:**
- URL: http://localhost:3001
- Environment: `NODE_ENV=development`
- Database: Local or Supabase dev

**Commands:**
```bash
# Frontend
cd apps/web
pnpm dev

# Backend
cd apps/api
pnpm run start:dev
```

---

### Staging

**Frontend:**
- URL: https://staging.studentdeals.uz
- Deployment: Vercel (staging branch)
- Environment: `NEXT_PUBLIC_ENV=staging`
- API: https://api-staging.studentdeals.uz (auto-resolved)

**Backend:**
- URL: https://api-staging.studentdeals.uz
- Deployment: Render (staging service)
- Environment: `NODE_ENV=staging`
- Database: Staging database

**Environment Variables (Vercel):**
```bash
NEXT_PUBLIC_ENV=staging
# NEXT_PUBLIC_API_URL not needed - auto-resolved to https://api-staging.studentdeals.uz
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=staging
```

**Environment Variables (Render):**
```bash
NODE_ENV=staging
DATABASE_URL=postgresql://...
JWT_SECRET=<staging-secret>
RESEND_API_KEY=re_...
EMAIL_FROM=StudentDeals <noreply@studentdeals.uz>
APP_URL=https://staging.studentdeals.uz
SENTRY_DSN=https://...@sentry.io/...
```

**Deployment:**
```bash
# Frontend (Vercel)
git push origin staging
# Auto-deploys to https://staging.studentdeals.uz

# Backend (Render)
# Create separate Render service for staging
# Connect to staging branch
```

---

### Production

**Frontend:**
- URL: https://studentdeals.uz
- Deployment: Vercel (main branch)
- Environment: `NEXT_PUBLIC_ENV=production`
- API: https://studentdeals-uz.onrender.com (auto-resolved)

**Backend:**
- URL: https://studentdeals-uz.onrender.com
- Deployment: Render (main branch)
- Environment: `NODE_ENV=production`
- Database: Production database

**Environment Variables (Vercel):**
```bash
NEXT_PUBLIC_ENV=production
# NEXT_PUBLIC_API_URL not needed - auto-resolved to https://studentdeals-uz.onrender.com
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=production
```

**Environment Variables (Render):**
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=<strong-production-secret>
RESEND_API_KEY=re_...
EMAIL_FROM=StudentDeals <noreply@studentdeals.uz>
APP_URL=https://studentdeals.uz
SENTRY_DSN=https://...@sentry.io/...
PRISMA_LOG_LEVEL=warn  # Опционально: query, info, warn, error
```

**Настройки Render для API:**
- **Root Directory:** `apps/api` (обязательно!)
- **Build Command:** `npm install -g pnpm && pnpm install --frozen-lockfile && pnpm build`
- **Start Command:** `pnpm start:prod`
- **Node Version:** 20
- **Package Manager:** pnpm

**Важно:**
- Prisma CLI автоматически доступен, так как `prisma` находится в `dependencies`
- Prisma Client генерируется автоматически при `pnpm install` через `postinstall` скрипт
- Все команды Prisma выполняются относительно `apps/api` благодаря настройке Root Directory

---

### Environment URLs Summary

| Environment | Frontend | Backend | Database |
|-------------|----------|---------|----------|
| **Development** | http://localhost:3000 | http://localhost:3001 | Local/Dev |
| **Staging** | https://staging.studentdeals.uz | https://api-staging.studentdeals.uz | Staging DB |
| **Production** | https://studentdeals.uz | https://studentdeals-uz.onrender.com | Production DB |

### API URL Resolution

API URL автоматически определяется на основе `NEXT_PUBLIC_ENV`:

```typescript
// apps/web/src/lib/api.ts
function getApiUrl(): string {
  // Explicit override
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Auto-resolve based on environment
  const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;
  
  switch (env) {
    case 'staging':
      return 'https://api-staging.studentdeals.uz';
    case 'production':
      return 'https://studentdeals-uz.onrender.com';
    default:
      return 'http://localhost:3001';
  }
}
```

**Преимущества:**
- ✅ Не нужно указывать `NEXT_PUBLIC_API_URL` для каждого окружения
- ✅ Автоматическое определение по `NEXT_PUBLIC_ENV`
- ✅ Возможность переопределения через `NEXT_PUBLIC_API_URL`
- ✅ Безопасные дефолты для development

---

## Лицензия

MIT
