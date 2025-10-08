# 🚀 Vercel Deployment Guide for NestJS API

## Project Setup

This monorepo contains:
- **apps/web** - Next.js frontend
- **apps/api** - NestJS backend

This guide covers deploying the **NestJS API** to Vercel as `studentdeals-uz-api`.

## 📋 Prerequisites

1. ✅ Vercel account
2. ✅ GitHub repository connected to Vercel
3. ✅ Environment variables ready (DATABASE_URL, JWT_SECRET, etc.)

## 🔧 Configuration Files

### vercel.json (Root)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/api/dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "apps/api/dist/main.js"
    }
  ]
}
```

### apps/api/src/main.ts

Updated to support both local development and Vercel serverless:

```typescript
// For local development
if (require.main === module) {
  bootstrap();
}

// For Vercel serverless
export default async (req: any, res: any) => {
  const app = await bootstrap();
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
};
```

## 🚀 Deployment Steps

### 1. Create New Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Name it: `studentdeals-uz-api`

### 2. Configure Build Settings

**Framework Preset:** Other

**Root Directory:** `./` (keep at root)

**Build Command:**
```bash
pnpm install && pnpm --filter api build
```

**Output Directory:**
```
apps/api/dist
```

**Install Command:**
```bash
pnpm install
```

### 3. Environment Variables

Add these in Vercel Project Settings → Environment Variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# JWT
JWT_SECRET=your-production-secret-key-here

# Server
NODE_ENV=production
PORT=3001
```

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## 🧪 Testing Deployment

### Health Check

```bash
curl https://studentdeals-uz-api.vercel.app/health
# Expected: { "ok": true }
```

### Database Health

```bash
curl https://studentdeals-uz-api.vercel.app/health/db
# Expected: { "ok": true, "db": "up" }
```

### Auth Endpoints

```bash
# Register
curl -X POST https://studentdeals-uz-api.vercel.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://studentdeals-uz-api.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📝 Important Notes

### Serverless Functions

- Each request creates a new serverless function instance
- Cold starts may occur (~1-2 seconds)
- Database connections are pooled via Prisma

### CORS Configuration

The API allows requests from:
- `http://localhost:3000` (local development)
- `https://studentdeals.uz` (production frontend)
- `https://studentdeals-uz.vercel.app` (Vercel frontend)

Update `apps/api/src/main.ts` if you need to add more origins.

### Prisma Migrations

Run migrations manually before deploying:

```bash
cd apps/api
npx prisma migrate deploy
```

Or add to build command:
```bash
pnpm install && cd apps/api && npx prisma migrate deploy && cd ../.. && pnpm --filter api build
```

## 🐛 Troubleshooting

### Error: "No entrypoint found"

**Solution:** Ensure `vercel.json` points to `apps/api/dist/main.js` (compiled output).

### Error: "Cannot find module"

**Solution:** 
1. Check that `pnpm install` runs at root
2. Verify `apps/api/package.json` has all dependencies
3. Ensure `postinstall` script runs `prisma generate`

### Error: "Database connection failed"

**Solution:**
1. Verify `DATABASE_URL` in Vercel environment variables
2. Check that Supabase/database allows connections from Vercel IPs
3. Ensure `?sslmode=require` is in connection string

### Cold Start Issues

**Solution:**
- Use Vercel Pro for faster cold starts
- Implement connection pooling (already done with Prisma)
- Consider keeping functions warm with periodic pings

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to:
- **main branch** → Production deployment
- **Other branches** → Preview deployments

Each deployment gets a unique URL for testing.

## 📊 Monitoring

### Vercel Dashboard

Monitor:
- Function invocations
- Response times
- Error rates
- Build logs

### API Endpoints

- **Root:** `https://studentdeals-uz-api.vercel.app/`
- **Health:** `https://studentdeals-uz-api.vercel.app/health`
- **DB Health:** `https://studentdeals-uz-api.vercel.app/health/db`
- **Auth:** `https://studentdeals-uz-api.vercel.app/auth/*`

## ✅ Checklist

Before deploying:
- [ ] `vercel.json` exists in root
- [ ] `apps/api/src/main.ts` exports default handler
- [ ] Environment variables configured in Vercel
- [ ] Database accessible from Vercel
- [ ] Prisma migrations applied
- [ ] Local build succeeds: `pnpm --filter api build`
- [ ] CORS origins include your frontend URL

## 🎉 Success!

Once deployed, your API will be available at:
```
https://studentdeals-uz-api.vercel.app
```

Update your frontend to use this URL in production!

