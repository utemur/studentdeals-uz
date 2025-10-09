# 🌍 Environment Configuration

## 📋 API URL Configuration

### 🏠 **Local Development**
- **Frontend:** `http://localhost:3000`
- **API:** `http://localhost:3001`
- **Default API URL:** `http://localhost:3001` (fallback)

### 🚀 **Production Deployment**
- **Frontend:** Vercel (`https://studentdeals.uz`)
- **API:** Render (`https://studentdeals-api.onrender.com`)
- **API URL:** `https://studentdeals-api.onrender.com`

## 🔧 Environment Variables

### **apps/web/.env.local** (Local Development)
```bash
# Optional - defaults to http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### **apps/web/.env.production** (Production)
```bash
# Required for production
NEXT_PUBLIC_API_URL=https://studentdeals-api.onrender.com
```

## 📁 Files Using API URL

### ✅ **Correctly Configured:**
- `apps/web/src/lib/api.ts` - ✅ Uses `process.env.NEXT_PUBLIC_API_URL`
- `apps/web/src/app/actions/auth.ts` - ✅ Uses `process.env.NEXT_PUBLIC_API_URL`
- `apps/web/src/app/[locale]/health/page.tsx` - ✅ Uses `api()` helper

### 🎯 **API Endpoints:**
- `GET /health` - Health check
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user

## 🚀 Deployment Checklist

### **Vercel (Frontend):**
1. Set `NEXT_PUBLIC_API_URL=https://studentdeals-api.onrender.com`
2. Deploy from `apps/web` directory
3. Verify API calls work in production

### **Render (Backend):**
1. Set `DATABASE_URL` to Supabase connection
2. Set `JWT_SECRET` for authentication
3. Deploy from `apps/api` directory
4. Verify CORS allows `https://studentdeals.uz`

## 🧪 Testing

### **Local Development:**
```bash
# Start API
cd apps/api && PORT=3001 node dist/main.js

# Start Frontend
cd apps/web && pnpm dev

# Test API
curl http://localhost:3001/health
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### **Production:**
```bash
# Test production API
curl https://studentdeals-api.onrender.com/health
curl -X POST https://studentdeals-api.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
