# Изменения: Интеграция регистрации через Telegram бота

## Обзор

Реализована интеграция с Telegram ботом для регистрации пользователей. Теперь пользователи могут войти на сайт только после завершения регистрации через Telegram бота. Все кнопки "Регистрация" перенаправляют на Telegram бота.

## Выполненные изменения

### 1. База данных (Prisma)

#### Добавлено поле `telegramVerifiedAt` в модель User
- **Файл:** `apps/api/prisma/schema.prisma`
- **Изменение:** Добавлено поле `telegramVerifiedAt DateTime?` для отслеживания верификации через Telegram бота
- **Миграция:** Создана миграция `20250202191000_add_telegram_verified_at`

**Обоснование:** Поле `telegramVerifiedAt` устанавливается Telegram ботом при завершении регистрации. Если поле `null`, пользователь не может войти на сайт.

### 2. Backend (NestJS API)

#### Обновлен AuthService для использования Prisma
- **Файл:** `apps/api/src/auth/auth.service.ts`
- **Изменения:**
  - Переключен с in-memory storage на PrismaService
  - Все методы (`register`, `login`, `me`, `getAllUsers`, `searchUsers`, `verifyEmail`) теперь используют Prisma
  - Добавлена проверка `telegramVerifiedAt` в методе `login`

#### Добавлена проверка Telegram верификации при логине
- **Файл:** `apps/api/src/auth/auth.service.ts`
- **Изменение:** В методе `login` добавлена проверка:
  ```typescript
  if (!user.telegramVerifiedAt) {
    throw new ForbiddenException({
      error: 'TELEGRAM_REGISTRATION_REQUIRED',
      message: 'Registration via Telegram bot is required before login',
    });
  }
  ```
- **Статус код:** 403 Forbidden
- **Формат ошибки:** `{ error: 'TELEGRAM_REGISTRATION_REQUIRED', message: '...' }`

#### Обновлен AuthModule
- **Файл:** `apps/api/src/auth/auth.module.ts`
- **Изменение:** Добавлен PrismaService в providers

### 3. Frontend (Next.js)

#### Обновлена обработка ошибок в API клиенте
- **Файл:** `apps/web/src/lib/api.ts`
- **Изменение:** Улучшена обработка ошибок NestJS, правильное извлечение структурированных ошибок

#### Обновлен Next.js API route для логина
- **Файл:** `apps/web/src/app/api/auth/login/route.ts`
- **Изменение:** Добавлена обработка ошибки `TELEGRAM_REGISTRATION_REQUIRED` с возвратом статуса 403

#### Обновлена страница входа (Signin)
- **Файл:** `apps/web/src/app/[locale]/signin/page.tsx`
- **Изменения:**
  - Добавлена обработка ошибки `TELEGRAM_REGISTRATION_REQUIRED`
  - Показывается сообщение с ссылкой на Telegram бота при ошибке
  - Добавлена локализация для русского и узбекского языков
  - Ссылка "Регистрация" внизу страницы заменена на ссылку на Telegram бота

#### Обновлена страница регистрации (Signup)
- **Файл:** `apps/web/src/app/[locale]/signup/page.tsx`
- **Изменения:**
  - Страница превращена в информационную страницу
  - Удалена форма регистрации
  - Добавлено объяснение о регистрации через Telegram бота
  - Добавлена кнопка для перехода в Telegram бота
  - Добавлена локализация

#### Обновлен компонент ClientUserMenu
- **Файл:** `apps/web/src/components/ClientUserMenu.tsx`
- **Изменение:** Кнопка "Регистрация" заменена на ссылку на Telegram бота (`https://t.me/studentdeals_uz_bot`)

#### Обновлен компонент UserMenu
- **Файл:** `apps/web/src/components/UserMenu.tsx`
- **Изменение:** Кнопка "Регистрация" заменена на ссылку на Telegram бота

#### Обновлена главная страница
- **Файл:** `apps/web/src/app/[locale]/page.tsx`
- **Изменения:**
  - Все ссылки на `/signup` заменены на ссылки на Telegram бота
  - Обновлены тексты, указывающие на регистрацию через Telegram

#### Обновлена страница "О нас"
- **Файл:** `apps/web/src/app/[locale]/about/page.tsx`
- **Изменение:** Ссылка на регистрацию заменена на ссылку на Telegram бота

#### Обновлена страница верификации email
- **Файл:** `apps/web/src/app/[locale]/verify/page.tsx`
- **Изменения:**
  - Добавлена локализация для всех сообщений
  - Ссылка на регистрацию заменена на ссылку на Telegram бота

## Константы

Все компоненты используют константу:
```typescript
const TELEGRAM_BOT_URL = 'https://t.me/studentdeals_uz_bot';
```

## Локализация

Добавлены переводы для:
- Сообщений об ошибках при логине
- Сообщений на странице регистрации
- Кнопок и ссылок на Telegram бота
- Сообщений на странице верификации

**Языки:** Русский (ru) и Узбекский (uz)

## Миграция базы данных

### Выполнение миграции

```bash
cd apps/api
pnpm prisma migrate deploy
```

Или для разработки:
```bash
pnpm prisma migrate dev
```

### Откат миграции (если нужно)

```bash
pnpm prisma migrate reset
```

## Тестирование

### Проверка логина без Telegram верификации

1. Создать пользователя через API (без установки `telegramVerifiedAt`)
2. Попытаться войти через форму на сайте
3. Должна появиться ошибка с сообщением о необходимости регистрации через Telegram
4. Должна отобразиться ссылка на Telegram бота

### Проверка логина с Telegram верификацией

1. Создать пользователя через Telegram бота (с установкой `telegramVerifiedAt`)
2. Войти через форму на сайте
3. Должен произойти успешный вход

### Проверка кнопок регистрации

1. Проверить все кнопки "Регистрация" на сайте
2. Все должны вести на `https://t.me/studentdeals_uz_bot`
3. Страница `/signup` должна показывать информацию о Telegram боте

## Важные замечания

1. **Telegram бот должен устанавливать `telegramVerifiedAt`** при завершении регистрации пользователя
2. **Не изменять отдельный репозиторий Telegram бота** в рамках этой задачи
3. **Все существующие `/auth/bot/...` endpoints остаются без изменений**
4. **База данных должна быть обновлена** через миграцию перед деплоем

## Следующие шаги для Telegram бота

Telegram бот должен:
1. При завершении регистрации пользователя устанавливать поле `telegramVerifiedAt` в таблице `users`
2. Использовать существующий API endpoint или напрямую обновлять базу данных через Prisma

Пример кода для Telegram бота:
```typescript
// После успешной регистрации пользователя
await prisma.user.update({
  where: { email: userEmail },
  data: { telegramVerifiedAt: new Date() },
});
```

## Файлы изменений

### Backend
- `apps/api/prisma/schema.prisma` - добавлено поле `telegramVerifiedAt`
- `apps/api/prisma/migrations/20250202191000_add_telegram_verified_at/migration.sql` - миграция
- `apps/api/src/auth/auth.service.ts` - использование Prisma, проверка Telegram верификации
- `apps/api/src/auth/auth.module.ts` - добавлен PrismaService

### Frontend
- `apps/web/src/lib/api.ts` - улучшена обработка ошибок
- `apps/web/src/app/api/auth/login/route.ts` - обработка TELEGRAM_REGISTRATION_REQUIRED
- `apps/web/src/app/[locale]/signin/page.tsx` - обработка ошибки, ссылка на Telegram
- `apps/web/src/app/[locale]/signup/page.tsx` - информационная страница с ссылкой на Telegram
- `apps/web/src/components/ClientUserMenu.tsx` - ссылка на Telegram вместо signup
- `apps/web/src/components/UserMenu.tsx` - ссылка на Telegram вместо signup
- `apps/web/src/app/[locale]/page.tsx` - обновлены ссылки на главной странице
- `apps/web/src/app/[locale]/about/page.tsx` - обновлена ссылка
- `apps/web/src/app/[locale]/verify/page.tsx` - обновлена ссылка и локализация

## Проверка работоспособности

1. ✅ Prisma Client сгенерирован с новым полем
2. ✅ Миграция создана
3. ✅ Backend компилируется
4. ✅ Frontend компилируется
5. ✅ Все ссылки на регистрацию обновлены
6. ✅ Локализация добавлена
7. ✅ Обработка ошибок реализована

## Деплой

1. Применить миграцию базы данных на production
2. Задеплоить обновленный API
3. Задеплоить обновленный фронтенд
4. Убедиться, что Telegram бот устанавливает `telegramVerifiedAt` при регистрации

