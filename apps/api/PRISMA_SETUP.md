# Prisma Setup для Supabase

## Настройка подключения к Supabase

### 1. Создайте .env файл в apps/api/
```bash
# Database
DATABASE_URL="postgresql://postgres:greeniceginG8$@db.ktdgrtkbbrddbmlflcop.supabase.co:5432/postgres"

# Server
PORT=3001
NODE_ENV=development
```

### 2. Установите зависимости
```bash
pnpm install
```

### 3. Сгенерируйте Prisma Client
```bash
cd apps/api
npx prisma generate
```

### 4. Примените миграции к Supabase
```bash
cd apps/api
npx prisma migrate deploy
```

### 5. Проверьте подключение
```bash
cd apps/api
npx prisma db pull
```

## Модели данных

### User
- `id` - уникальный идентификатор (cuid)
- `email` - email пользователя (уникальный)
- `passwordHash` - хеш пароля
- `emailVerifiedAt` - дата верификации email
- `createdAt` - дата создания
- `updatedAt` - дата обновления

### EmailVerificationToken
- `id` - уникальный идентификатор (cuid)
- `userId` - ID пользователя (внешний ключ)
- `token` - токен верификации (уникальный)
- `expiresAt` - дата истечения токена
- `usedAt` - дата использования токена

## Полезные команды

### Prisma Studio
```bash
pnpm prisma:studio
```

### Создание новой миграции
```bash
cd apps/api
npx prisma migrate dev --name migration_name
```

### Сброс базы данных
```bash
cd apps/api
npx prisma migrate reset
```

### Просмотр схемы
```bash
cd apps/api
npx prisma db pull
```

## Структура файлов

```
apps/api/
├── prisma/
│   ├── schema.prisma          # Схема базы данных
│   └── migrations/            # Миграции
│       ├── 20241206_init/
│       │   └── migration.sql  # SQL миграция
│       └── migration_lock.toml
├── src/
│   ├── prisma.service.ts      # Prisma сервис
│   └── ...
└── .env                       # Переменные окружения
```

## Troubleshooting

### Ошибка подключения к базе данных
1. Проверьте строку подключения в .env
2. Убедитесь, что Supabase проект активен
3. Проверьте настройки сети и файрвола

### Ошибка генерации Prisma Client
1. Убедитесь, что schema.prisma корректен
2. Проверьте версии @prisma/client и prisma
3. Очистите node_modules и переустановите зависимости
