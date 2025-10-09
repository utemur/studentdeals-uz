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

## Email Verification Testing

### Локальное тестирование с MailHog

MailHog - это SMTP сервер для тестирования email локально без отправки реальных писем.

#### 1. Запуск MailHog в Docker

```bash
# Запустить MailHog контейнер
docker run -d \
  --name mailhog \
  -p 1025:1025 \
  -p 8025:8025 \
  mailhog/mailhog

# Проверить что контейнер запущен
docker ps | grep mailhog
```

**Порты:**
- `1025` - SMTP сервер (для отправки писем)
- `8025` - Web UI (для просмотра писем)

#### 2. Настройка ENV для MailHog

Создайте `apps/api/.env`:
```bash
# SMTP Configuration (MailHog)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@studentdeals.uz
APP_URL=http://localhost:3000
```

#### 3. Тестирование отправки email

```bash
# 1. Запустите API
cd apps/api
pnpm build
PORT=3001 node dist/main.js

# 2. Зарегистрируйте пользователя
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Откройте MailHog Web UI
open http://localhost:8025

# 4. Вы должны увидеть письмо с подтверждением
```

#### 4. Проверка verification flow

```bash
# 1. Скопируйте токен из письма в MailHog
# Пример: http://localhost:3000/ru/verify?token=abc123...

# 2. Откройте ссылку в браузере
open "http://localhost:3000/ru/verify?token=<TOKEN>"

# 3. Или проверьте через API
curl "http://localhost:3001/auth/verify?token=<TOKEN>"

# Успешный ответ:
# {"success":true,"message":"Email verified successfully"}

# Истёкший токен (>24h):
# {"statusCode":400,"message":"Token expired"}

# Уже использованный токен:
# {"statusCode":400,"message":"Token already used"}
```

#### 5. Остановка MailHog

```bash
# Остановить контейнер
docker stop mailhog

# Удалить контейнер
docker rm mailhog
```

### Production SMTP Configuration

Для production используйте реальный SMTP сервис:

#### Gmail (для тестирования)

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Не обычный пароль! Используйте App Password
SMTP_FROM=noreply@studentdeals.uz
APP_URL=https://studentdeals.uz
```

**Важно:** Для Gmail нужно создать App Password:
1. Google Account → Security → 2-Step Verification
2. App passwords → Generate
3. Используйте сгенерированный пароль

#### SendGrid (рекомендуется для production)

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<your-sendgrid-api-key>
SMTP_FROM=noreply@studentdeals.uz
APP_URL=https://studentdeals.uz
```

#### Mailgun

```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=<your-mailgun-password>
SMTP_FROM=noreply@studentdeals.uz
APP_URL=https://studentdeals.uz
```

## Миграции

### Создание новой миграции

```bash
cd apps/api

# 1. Обновите schema.prisma
# 2. Создайте миграцию
npx prisma migrate dev --name add_new_field

# 3. Примените к production
npx prisma migrate deploy
```

### Просмотр статуса миграций

```bash
cd apps/api
npx prisma migrate status
```

### Откат миграции

```bash
cd apps/api

# Откатить последнюю миграцию
npx prisma migrate resolve --rolled-back <migration-name>

# Сбросить всю базу (ОСТОРОЖНО!)
npx prisma migrate reset
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

### Email не отправляется

**Локально (MailHog):**
1. Проверьте что MailHog запущен: `docker ps | grep mailhog`
2. Проверьте порт 1025: `nc -zv localhost 1025`
3. Проверьте логи API: должно быть "✅ Verification email sent"

**Production:**
1. Проверьте SMTP credentials в Render
2. Проверьте логи Render на ошибки SMTP
3. Проверьте что SMTP_HOST и SMTP_PORT корректны
4. Для Gmail: убедитесь что используете App Password

### Токен верификации не работает

1. Проверьте что токен не истёк (24 часа)
2. Проверьте что токен не был использован
3. Проверьте формат URL: `/auth/verify?token=<TOKEN>`
4. Проверьте логи API на ошибки
