# 🔐 Authentication Setup

## 📋 Overview

StudentDeals.uz использует JWT-based аутентификацию с httpOnly cookies для безопасного хранения токенов:

- **Backend (Render API):** NestJS + JWT + in-memory storage (dev) / Prisma (prod)
- **Frontend (Next.js):** Route Handlers как proxy + httpOnly cookies
- **Security:** Токены недоступны для JavaScript на клиенте

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Browser       │      │   Next.js        │      │   Render API    │
│   (Client)      │─────▶│   Route Handler  │─────▶│   (NestJS)      │
│                 │      │   /api/auth/*    │      │   /auth/*       │
└─────────────────┘      └──────────────────┘      └─────────────────┘
        │                         │
        │                         │ Set-Cookie: sd_token
        │◀────────────────────────┘ (httpOnly, secure, 7d)
        │
        │ Cookie автоматически
        │ отправляется с каждым
        │ запросом к Next.js
        └────────────────────────▶
```

## 🔄 Authentication Flow

### Registration Flow

```
1. User submits form on /[locale]/signup
   ↓
2. POST /api/auth/register (Next.js Route Handler)
   ↓
3. POST https://studentdeals-uz.onrender.com/auth/register
   ← {id, email}
   ↓
4. POST https://studentdeals-uz.onrender.com/auth/login
   ← {accessToken}
   ↓
5. Set-Cookie: sd_token=<JWT>; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
   ↓
6. Return {success: true, user: {id, email}}
   ↓
7. Redirect to /[locale]
```

### Login Flow

```
1. User submits form on /[locale]/signin
   ↓
2. POST /api/auth/login (Next.js Route Handler)
   ↓
3. POST https://studentdeals-uz.onrender.com/auth/login
   ← {accessToken}
   ↓
4. Set-Cookie: sd_token=<JWT>; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
   ↓
5. Return {success: true}
   ↓
6. Redirect to /[locale]
```

### Protected Page Access

```
1. User navigates to /[locale]/dashboard
   ↓
2. Server Component calls getCurrentUser()
   ↓
3. Read cookie: sd_token
   ↓
4. GET https://studentdeals-uz.onrender.com/auth/me
   Headers: Authorization: Bearer <JWT>
   ← {id, email, emailVerifiedAt, ...}
   ↓
5. If user exists → render dashboard
   If no user → redirect('/[locale]/signin')
```

### Logout Flow

```
1. User clicks logout button
   ↓
2. POST /api/auth/logout (Next.js Route Handler)
   ↓
3. Delete cookie: sd_token
   ↓
4. Return {success: true}
   ↓
5. Redirect to /[locale]
```

## 📁 File Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── api/auth/
│   │   │   ├── login/route.ts       # Login proxy + set cookie
│   │   │   ├── register/route.ts    # Register proxy + auto-login + set cookie
│   │   │   ├── logout/route.ts      # Clear cookie
│   │   │   └── me/route.ts          # Get current user (from cookie)
│   │   └── [locale]/
│   │       ├── signin/page.tsx      # Login form
│   │       ├── signup/page.tsx      # Registration form
│   │       └── dashboard/page.tsx   # Protected page (server component)
│   ├── lib/
│   │   ├── api.ts                   # API helpers (authApi.register, login, me)
│   │   └── auth-server.ts           # Server-side auth (getCurrentUser, isAuthenticated)
│   └── hooks/
│       └── useAuth.ts               # Client-side auth hook
```

## 🔧 API Endpoints

### Next.js Route Handlers (Proxy)

| Endpoint | Method | Description | Cookie |
|----------|--------|-------------|--------|
| `/api/auth/register` | POST | Register + auto-login | ✅ Sets `sd_token` |
| `/api/auth/login` | POST | Login | ✅ Sets `sd_token` |
| `/api/auth/logout` | POST | Logout | ✅ Deletes `sd_token` |
| `/api/auth/me` | GET | Get current user | ✅ Reads `sd_token` |

### Render API (Backend)

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/auth/register` | POST | Register user | ❌ Public |
| `/auth/login` | POST | Login user | ❌ Public |
| `/auth/me` | GET | Get user profile | ✅ Bearer token |

## 🍪 Cookie Configuration

```typescript
{
  name: 'sd_token',
  httpOnly: true,                              // ✅ Not accessible via JavaScript
  secure: process.env.NODE_ENV === 'production', // ✅ HTTPS only in prod
  sameSite: 'lax',                             // ✅ CSRF protection
  maxAge: 60 * 60 * 24 * 7,                    // ✅ 7 days
  path: '/',                                   // ✅ Available for all routes
}
```

**Security Benefits:**
- ✅ **httpOnly:** Защита от XSS (токен недоступен для JavaScript)
- ✅ **secure:** Только HTTPS в production
- ✅ **sameSite:** Защита от CSRF атак
- ✅ **7 days expiry:** Автоматическое удаление через неделю

## 🧪 Testing Authentication

### 1. Registration

```bash
# Request
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -v

# Response
HTTP/1.1 200 OK
Set-Cookie: sd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800

{
  "success": true,
  "user": {
    "id": "user_1234567890",
    "email": "test@example.com"
  }
}
```

### 2. Login

```bash
# Request
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -v

# Response
HTTP/1.1 200 OK
Set-Cookie: sd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800

{
  "success": true
}
```

### 3. Get Current User

```bash
# Request (with cookie)
curl http://localhost:3000/api/auth/me \
  -H "Cookie: sd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -v

# Response
HTTP/1.1 200 OK

{
  "id": "user_1234567890",
  "email": "test@example.com",
  "emailVerifiedAt": null,
  "createdAt": "2025-10-09T17:00:00.000Z",
  "updatedAt": "2025-10-09T17:00:00.000Z"
}
```

### 4. Logout

```bash
# Request
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: sd_token=..." \
  -v

# Response
HTTP/1.1 200 OK
Set-Cookie: sd_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT

{
  "success": true
}
```

### 5. Access Protected Page

```bash
# Without cookie → redirect to signin
curl http://localhost:3000/ru/dashboard -v
# HTTP/1.1 307 Temporary Redirect
# Location: /ru/signin

# With valid cookie → render dashboard
curl http://localhost:3000/ru/dashboard \
  -H "Cookie: sd_token=..." \
  -v
# HTTP/1.1 200 OK
# (HTML content of dashboard)
```

## 💻 Client-Side Usage

### useAuth Hook

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <a href="/ru/signin">Sign In</a>;
  }

  return (
    <div>
      <p>Welcome, {user?.email}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Login Form

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    });

    if (response.ok) {
      router.push('/ru');
      router.refresh();
    } else {
      const data = await response.json();
      setError(data.error);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## 🛡️ Server-Side Usage

### Protected Page (Server Component)

```typescript
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';

export default async function ProtectedPage({ params }: { params: { locale: string } }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${params.locale}/signin`);
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {user.email}!</p>
    </div>
  );
}
```

### API Route with Auth

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authApi } from '@/lib/api';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('sd_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await authApi.me(token);
    // ... do something with user
    return NextResponse.json({ data: 'protected data' });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
```

## 🔐 Security Best Practices

### 1. httpOnly Cookies

✅ **Используем:**
```typescript
res.cookies.set('sd_token', token, {
  httpOnly: true,  // ✅ Not accessible via document.cookie
  secure: true,    // ✅ HTTPS only
  sameSite: 'lax', // ✅ CSRF protection
});
```

❌ **Не используем:**
```typescript
localStorage.setItem('token', token);  // ❌ Vulnerable to XSS
```

### 2. Token Expiry

- **JWT expires in:** 30 minutes (backend)
- **Cookie expires in:** 7 days (frontend)
- **Refresh strategy:** User must re-login after 30 minutes

### 3. CORS Configuration

Backend должен разрешать credentials:

```typescript
// apps/api/src/main.ts
app.enableCors({
  origin: ['https://studentdeals.uz', 'http://localhost:3000'],
  credentials: true,  // ✅ Required for cookies
});
```

### 4. CSP Configuration

Frontend CSP должен разрешать API requests:

```javascript
// apps/web/next.config.js
connect-src 'self' https://studentdeals-uz.onrender.com
```

## 🧪 Manual Testing

### Test Registration

1. **Open browser:** `http://localhost:3000/ru/signup`
2. **Fill form:**
   - Email: `test@example.com`
   - Password: `password123` (min 8 chars)
3. **Submit form**
4. **Check DevTools:**
   - Application → Cookies → `sd_token` should be set
   - Network → POST /api/auth/register → Status 200
5. **Verify redirect:** Should redirect to `/ru`

### Test Login

1. **Open browser:** `http://localhost:3000/ru/signin`
2. **Fill form:**
   - Email: `test@example.com`
   - Password: `password123`
3. **Submit form**
4. **Check DevTools:**
   - Application → Cookies → `sd_token` should be set
   - Network → POST /api/auth/login → Status 200
5. **Verify redirect:** Should redirect to `/ru`

### Test Protected Page

1. **Without auth:**
   - Navigate to `http://localhost:3000/ru/dashboard`
   - Should redirect to `/ru/signin`

2. **With auth:**
   - Login first
   - Navigate to `http://localhost:3000/ru/dashboard`
   - Should show dashboard with user info

### Test Logout

1. **Click logout button** (in UserMenu)
2. **Check DevTools:**
   - Application → Cookies → `sd_token` should be deleted
   - Network → POST /api/auth/logout → Status 200
3. **Try to access dashboard:**
   - Should redirect to `/ru/signin`

## 🔍 Request/Response Examples

### 1. Register Request

**Request:**
```http
POST /api/auth/register HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```http
HTTP/1.1 200 OK
Set-Cookie: sd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzE3NjAwMjgxNTM2ODYiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3NjAwMjgxNjEsImV4cCI6MTc2MDAyOTk2MX0.hDVuASltbL3qHfjTxMR-3rTodd5RtMvTi5Akfb3PuWI; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800
Content-Type: application/json

{
  "success": true,
  "user": {
    "id": "user_1760028153686",
    "email": "test@example.com"
  }
}
```

### 2. Login Request

**Request:**
```http
POST /api/auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```http
HTTP/1.1 200 OK
Set-Cookie: sd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800
Content-Type: application/json

{
  "success": true
}
```

### 3. Get Current User Request

**Request:**
```http
GET /api/auth/me HTTP/1.1
Host: localhost:3000
Cookie: sd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "user_1760028153686",
  "email": "test@example.com",
  "emailVerifiedAt": null,
  "createdAt": "2025-10-09T17:00:00.000Z",
  "updatedAt": "2025-10-09T17:00:00.000Z"
}
```

### 4. Logout Request

**Request:**
```http
POST /api/auth/logout HTTP/1.1
Host: localhost:3000
Cookie: sd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```http
HTTP/1.1 200 OK
Set-Cookie: sd_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
Content-Type: application/json

{
  "success": true
}
```

## 🐛 Troubleshooting

### Cookie not being set

**Problem:** `sd_token` cookie not appearing in DevTools

**Solution:**
1. Check CORS configuration in backend:
```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,  // ✅ Must be true
});
```

2. Check frontend request includes credentials:
```typescript
fetch('/api/auth/login', {
  credentials: 'include',  // ✅ Include cookies
});
```

3. Check cookie settings:
```typescript
res.cookies.set('sd_token', token, {
  httpOnly: true,
  secure: false,  // ✅ Must be false in development
  sameSite: 'lax',
});
```

### Redirect loop on protected pages

**Problem:** Dashboard keeps redirecting to signin

**Solution:**
1. Check cookie is being sent:
```bash
curl http://localhost:3000/api/auth/me \
  -H "Cookie: sd_token=..." \
  -v
```

2. Check token is valid:
```bash
# Decode JWT
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." | base64 -d
```

3. Check backend `/auth/me` endpoint:
```bash
curl http://localhost:3001/auth/me \
  -H "Authorization: Bearer <token>" \
  -v
```

### 401 Unauthorized on /auth/me

**Problem:** Backend returns 401 when calling `/auth/me`

**Solution:**
1. Check JWT_SECRET matches between frontend and backend
2. Check token hasn't expired (30 min default)
3. Check Authorization header format:
```
Authorization: Bearer <token>
```

### CORS errors in browser

**Problem:** Browser shows CORS error when calling API

**Solution:**
1. Update `CORS_ORIGINS` in Render:
```bash
CORS_ORIGINS=https://studentdeals.uz,http://localhost:3000
```

2. Restart backend after changing env vars

3. Check preflight request:
```bash
curl -X OPTIONS http://localhost:3001/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

## 🚀 Production Deployment

### Vercel (Frontend)

**Environment Variables:**
```bash
NEXT_PUBLIC_API_URL=https://studentdeals-uz.onrender.com
NODE_ENV=production
```

**Cookie settings automatically adjust:**
- `secure: true` (HTTPS only)
- `sameSite: 'lax'`

### Render (Backend)

**Environment Variables:**
```bash
CORS_ORIGINS=https://studentdeals.uz,https://www.studentdeals.uz,https://studentdeals-uz.vercel.app
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
```

**Generate strong JWT_SECRET:**
```bash
openssl rand -base64 32
# Example: 8xK9mP2qR5tY7wZ3nB6vC1dF4gH8jL0m
```

## 📊 Monitoring

### Check Authentication Status

```bash
# Frontend
curl -I http://localhost:3000/ru/dashboard

# Should redirect if not authenticated
# HTTP/1.1 307 Temporary Redirect
# Location: /ru/signin

# Should render if authenticated
# HTTP/1.1 200 OK
```

### Check Cookie Expiry

```javascript
// In browser console
document.cookie.split(';').find(c => c.includes('sd_token'))
// "sd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Check Token in DevTools

1. Open **DevTools** → **Application**
2. Navigate to **Cookies** → `http://localhost:3000`
3. Find `sd_token` cookie
4. Verify:
   - ✅ HttpOnly: Yes
   - ✅ Secure: Yes (prod) / No (dev)
   - ✅ SameSite: Lax
   - ✅ Expires: 7 days from now

## 🎯 Production Checklist

- [ ] JWT_SECRET установлен в Render (не дефолтный)
- [ ] CORS_ORIGINS включает все production домены
- [ ] NEXT_PUBLIC_API_URL указывает на Render API
- [ ] Cookie secure=true в production
- [ ] Тестирование регистрации работает
- [ ] Тестирование логина работает
- [ ] Protected pages редиректят неавторизованных
- [ ] Logout корректно очищает cookie
- [ ] Sentry отслеживает auth ошибки

## 📚 References

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js Cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [JWT.io](https://jwt.io/) - Decode JWT tokens
- [MDN: HttpOnly Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)
- [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

