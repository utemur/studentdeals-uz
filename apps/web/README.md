# Web Application

Next.js веб-приложение для платформы Student Deals Uzbekistan.

## Особенности

- **Next.js 14** с App Router
- **TypeScript** для типобезопасности
- **Tailwind CSS** для стилизации
- **PWA** поддержка с Service Worker
- **Интернационализация** (русский/узбекский)
- **Responsive** дизайн

## Страницы

- `/` - Главная страница с информацией о платформе
- `/health` - Health check endpoint
- `/[locale]/` - Локализованные страницы

## Локализация

Поддерживаемые языки:
- `ru` - Русский (по умолчанию)
- `uz` - Узбекский

Переключение языка доступно через компонент `LanguageSwitcher`.

## PWA

Приложение настроено как Progressive Web App с:
- Service Worker для кэширования
- Web App Manifest
- Офлайн поддержка

## Разработка

```bash
# Запуск в режиме разработки
pnpm dev

# Сборка для продакшена
pnpm build

# Запуск продакшен сборки
pnpm start

# Линтинг
pnpm lint

# Проверка типов
pnpm typecheck
```

## Структура

```
src/
├── app/                    # App Router страницы
│   ├── [locale]/          # Локализованные маршруты
│   ├── globals.css        # Глобальные стили
│   └── layout.tsx         # Корневой layout
├── components/            # React компоненты
├── messages/              # Переводы
│   ├── ru.json           # Русские переводы
│   └── uz.json           # Узбекские переводы
├── i18n.ts               # Конфигурация i18n
└── middleware.ts         # Next.js middleware
```

## Переменные окружения

Создайте `.env.local` файл:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Деплой

Приложение готово для деплоя на:
- Vercel
- Netlify
- Docker
- Любую платформу, поддерживающую Node.js
