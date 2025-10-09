# Student Deals Uzbekistan

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

## Лицензия

MIT
