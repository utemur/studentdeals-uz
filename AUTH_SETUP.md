# 🔐 Auth System Setup

## Обзор

Полная система авторизации на JWT для StudentDeals.uz с NestJS + Prisma на бэкенде и Next.js 14 на фронтенде.

## 🏗️ Архитектура

### Backend (apps/api)

- **Auth Module**: `/auth` эндпоинты для регистрации и входа
- **JWT Strategy**: Passport JWT для защиты роутов
- **Prisma**: ORM для работы с PostgreSQL
- **Helmet**: Безопасность headers
- **CORS**: Настроен для localhost и production доменов

### Frontend (apps/web)

- **Signup Page**: `/signup` - форма регистрации
- **Signin Page**: `/signin` - форма входа
- **API Client**: Утилиты для работы с API

## 📋 Установка

### 1. Установите зависимости

```bash
pnpm install
```

### 2. Настройте переменные окружения

#### Backend (`apps/api/.env`)

```env
DATABASE_URL="postgresql://postgres:password@host:port/database?sslmode=require"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3001
NODE_ENV=development
```

#### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Примените миграции Prisma

```bash
cd apps/api
npx prisma migrate dev
npx prisma generate
```

## 🚀 Запуск

### Запустить API

```bash
pnpm dev:api
```

API доступен на `http://localhost:3001`

### Запустить Web

```bash
pnpm dev:web
```

Web доступен на `http://localhost:3000`

## 📡 API Endpoints

### POST /auth/signup

Регистрация нового пользователя.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx...",
    "email": "user@example.com"
  }
}
```

### POST /auth/signin

Вход существующего пользователя.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx...",
    "email": "user@example.com"
  }
}
```

### GET /auth/me

Получить профиль текущего пользователя (требует авторизации).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "clxxx...",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## 🛡️ Безопасность

### Backend

- ✅ **Helmet**: HTTP security headers
- ✅ **CORS**: Настроен для разрешённых доменов
- ✅ **bcrypt**: Хеширование паролей (10 раундов)
- ✅ **JWT**: Token-based авторизация (7 дней)
- ✅ **Validation**: class-validator для DTO
- ✅ **X-Powered-By**: Скрыт

### Frontend

- ✅ **localStorage**: Хранение токена (можно заменить на httpOnly cookies)
- ✅ **Error handling**: Обработка ошибок API
- ✅ **Loading states**: UX индикаторы загрузки

## 📚 Swagger Documentation

API документация доступна по адресу:

```
http://localhost:3001/api/docs
```

## 🧪 Тестирование

### Тест регистрации

```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Тест входа

```bash
curl -X POST http://localhost:3001/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Тест профиля

```bash
curl http://localhost:3001/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Troubleshooting

### Ошибка: "User with this email already exists"

Пользователь с таким email уже зарегистрирован. Используйте другой email или войдите.

### Ошибка: "Invalid credentials"

Неверный email или пароль. Проверьте данные.

### Ошибка: "Unauthorized"

JWT токен недействителен или истёк. Войдите заново.

### Проблема с CORS

Убедитесь, что URL фронтенда добавлен в список разрешённых в `apps/api/src/main.ts`:

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://studentdeals.uz',
    'https://studentdeals-uz.vercel.app',
  ],
  credentials: true,
});
```

## 📦 Структура файлов

```
apps/
├── api/
│   └── src/
│       ├── auth/
│       │   ├── dto/
│       │   │   ├── signup.dto.ts
│       │   │   ├── signin.dto.ts
│       │   │   └── auth-response.dto.ts
│       │   ├── guards/
│       │   │   └── jwt-auth.guard.ts
│       │   ├── strategies/
│       │   │   └── jwt.strategy.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   └── auth.module.ts
│       └── main.ts
└── web/
    └── src/
        ├── app/
        │   └── [locale]/
        │       ├── signup/
        │       │   └── page.tsx
        │       └── signin/
        │           └── page.tsx
        └── lib/
            └── api.ts
```

## 🚢 Deploy на Render

### Build Command:

```bash
pnpm install --prod=false && pnpm --filter api build
```

### Start Command:

```bash
pnpm --filter api start:prod
```

### Environment Variables:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret
PORT=3001
NODE_ENV=production
```

## 📝 TODO

- [ ] Добавить refresh tokens
- [ ] Реализовать email верификацию
- [ ] Добавить social auth (Google, GitHub)
- [ ] Улучшить UX (toast notifications)
- [ ] Добавить rate limiting
- [ ] Реализовать forgot password flow
- [ ] Добавить unit tests
- [ ] Добавить e2e tests

## 🎉 Готово!

Система авторизации полностью настроена и готова к использованию!
