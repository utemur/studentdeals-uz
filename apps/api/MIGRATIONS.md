# 🗄️ Database Migrations

## Обзор

Prisma схема настроена для PostgreSQL с двумя основными моделями для системы аутентификации.

## 📋 Модели

### User

Основная модель пользователя.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | String (cuid) | Уникальный идентификатор |
| `email` | String (unique) | Email пользователя |
| `passwordHash` | String | Хеш пароля (bcrypt) |
| `emailVerifiedAt` | DateTime? | Дата верификации email |
| `createdAt` | DateTime | Дата создания |
| `updatedAt` | DateTime | Дата обновления |
| `tokens` | EmailVerificationToken[] | Токены верификации |

### EmailVerificationToken

Токены для верификации email.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | String (cuid) | Уникальный идентификатор |
| `userId` | String | ID пользователя (FK) |
| `token` | String (unique) | Токен верификации |
| `expiresAt` | DateTime | Срок действия |
| `usedAt` | DateTime? | Дата использования |
| `user` | User | Связь с пользователем |

## 🚀 Применение миграций

### Локальная разработка

```bash
cd apps/api
npx prisma migrate dev
```

### Production (Render)

Миграции применяются автоматически при деплое через:

```bash
npx prisma migrate deploy
```

Или добавьте в Build Command на Render:

```bash
pnpm install --prod=false && cd apps/api && npx prisma migrate deploy && cd ../.. && pnpm --filter api build
```

## 📝 Создание новой миграции

```bash
cd apps/api
npx prisma migrate dev --name your_migration_name
```

## 🔄 Сброс базы данных (dev only)

```bash
cd apps/api
npx prisma migrate reset
```

## 🧪 Проверка схемы

```bash
cd apps/api
npx prisma validate
```

## 📊 Просмотр данных

```bash
cd apps/api
npx prisma studio
```

Или из корня:

```bash
pnpm prisma:studio
```

## 🐛 Troubleshooting

### Ошибка: "P1001: Can't reach database server"

**Причина:** База данных недоступна или неправильная строка подключения.

**Решение:**
1. Проверьте `DATABASE_URL` в `.env`
2. Убедитесь, что база данных запущена
3. Проверьте доступность хоста:
   ```bash
   nc -vz your-host.com 5432
   ```

### Ошибка: "Migration failed to apply"

**Причина:** Конфликт с существующими данными или схемой.

**Решение:**
1. Проверьте состояние миграций:
   ```bash
   npx prisma migrate status
   ```
2. Примените отдельные миграции:
   ```bash
   npx prisma migrate resolve --applied migration_name
   ```

### Несоответствие схемы и базы данных

**Причина:** Схема изменена, но миграции не применены.

**Решение:**
```bash
npx prisma migrate dev
```

## 🔒 Безопасность

- ✅ Пароли хешируются с помощью bcrypt (10 раундов)
- ✅ Email уникален (индекс на уровне БД)
- ✅ Токены уникальны (индекс на уровне БД)
- ✅ Cascade delete для токенов при удалении пользователя
- ✅ TIMESTAMP(3) для точности до миллисекунд

## 📦 Структура миграций

```
apps/api/prisma/migrations/
├── 20241207000000_init_auth/
│   └── migration.sql
└── migration_lock.toml
```

## 🌐 Переменные окружения

### Разработка

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/studentdeals?sslmode=prefer"
```

### Production (Render PostgreSQL)

```env
DATABASE_URL="postgresql://user:password@host.render.com:5432/database?sslmode=require"
```

## ✅ Чеклист для production

- [ ] `DATABASE_URL` настроен
- [ ] Миграции применены
- [ ] `postinstall` скрипт настроен
- [ ] Prisma Client сгенерирован
- [ ] Health check `/health/db` работает
- [ ] Бэкапы базы данных настроены
