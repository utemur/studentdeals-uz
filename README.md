# StudentDeals.uz

Эксклюзивные скидки для студентов Узбекистана — площадка вроде UNiDAYS/Student Beans.
Студент подтверждает учебную почту вуза → получает доступ к скидочным кодам
проверенных брендов.

Пилот: **WIUT** (Westminster International University in Tashkent), домен `@wiut.uz`.

## Технологии

Один Next.js 14 (App Router) проект — без монорепозитория, без отдельного API:

- **Next.js** 14 + TypeScript + Tailwind CSS
- **Prisma** + PostgreSQL (Supabase)
- **next-intl** — локализация (русский по умолчанию, узбекский)
- **Resend** — письма со ссылкой для входа
- **jose** — подпись сессионной cookie (passwordless-вход по magic link)

## Быстрый старт

```bash
pnpm install
cp .env.example .env   # заполните переменные — см. ниже
pnpm db:push            # применить схему Prisma к базе
pnpm db:seed             # засеять WIUT + несколько тестовых брендов/скидок
pnpm dev                  # http://localhost:3000
```

Или просто `./dev.sh` — освободит порт 3000 и запустит `pnpm dev`.

## Переменные окружения (`.env`)

См. `.env.example`:

- `DATABASE_URL` — строка подключения к PostgreSQL
- `RESEND_API_KEY`, `FROM_EMAIL` — отправка писем со ссылкой для входа
- `SESSION_SECRET` — секрет для подписи сессионной cookie
- `NEXT_PUBLIC_APP_URL` — базовый URL приложения (используется в ссылках писем)

## Как устроен вход

Пароля нет. Студент вводит учебную почту → если её домен есть в таблице
`University` (сейчас только `wiut.uz`) — на почту приходит одноразовая
ссылка (`MagicLinkToken`, живёт 15 минут) → переход по ссылке подтверждает
почту, создаёт/обновляет `User` и ставит сессионную cookie.

## Управление брендами и скидками

Админ-панели пока нет — на пилоте бренды/скидки добавляются напрямую через
Prisma Studio:

```bash
pnpm db:studio
```

## Структура проекта

```
src/
  app/[locale]/     — страницы (/, /brands, /brands/[slug], /deals, /signin)
  app/api/           — auth (magic link) и reveal-код эндпоинты
  components/        — Header, DealCard, BrandCard, ...
  lib/                — db, session, email, auth, events
  messages/           — ru.json, uz.json
prisma/
  schema.prisma, seed.ts
```

## Деплой

Vercel, один проект, без дополнительной настройки — база данных внешняя
(Supabase), so переменные окружения задаются в Vercel Project Settings.

## Не входит в MVP

Аффилиат-трекинг, избранное, админ-панель, монетизация, второй вуз/аудитория
школьников — сознательно отложены до появления реальной тяги на пилоте.
