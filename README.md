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

GitHub Actions автоматически выполняет:
1. **Lint** - проверка кода с ESLint
2. **Typecheck** - проверка типов TypeScript
3. **Build** - сборка всех пакетов

Workflow запускается на:
- Pull requests в `main` и `develop`
- Push в `main` и `develop`

## Лицензия

MIT
