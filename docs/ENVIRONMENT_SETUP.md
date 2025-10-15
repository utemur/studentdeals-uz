# Environment Setup Guide

This guide explains how to configure the StudentDeals.uz application for different environments.

## Overview

The application consists of:
- **Frontend (Next.js)**: `apps/web` - React application with Next.js 14
- **Backend (NestJS)**: `apps/api` - Node.js API with NestJS framework
- **UI Package**: `packages/ui` - Shared UI components

## Environment Variables

### Frontend (apps/web)

#### Required Variables

| Variable | Description | Local | Production |
|----------|-------------|-------|------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` | `https://studentdeals-api.onrender.com` |

#### Setup Instructions

1. **Local Development**:
   ```bash
   # Copy the example file
   cp apps/web/env.local.example apps/web/.env.local
   
   # Edit .env.local
   NEXT_PUBLIC_API_URL=https://studentdeals-api.onrender.com
   ```

2. **Production (Vercel)**:
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://studentdeals-api.onrender.com`

### Backend (apps/api)

#### Required Variables

| Variable | Description | Local | Production |
|----------|-------------|-------|------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` | Render PostgreSQL URL |
| `JWT_SECRET` | JWT signing secret | Random string | Strong secret |
| `JWT_EXPIRES_IN` | JWT expiration | `7d` | `7d` |
| `RESEND_API_KEY` | Email service API key | Your Resend key | Your Resend key |
| `FROM_EMAIL` | Sender email | `noreply@studentdeals.uz` | `noreply@studentdeals.uz` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000,https://studentdeals.uz,https://www.studentdeals.uz` | Same as local |

#### Setup Instructions

1. **Local Development**:
   ```bash
   # Copy the example file
   cp apps/api/env.example apps/api/.env
   
   # Edit .env with your values
   DATABASE_URL=postgresql://username:password@localhost:5432/studentdeals
   JWT_SECRET=your-super-secret-jwt-key-here
   ALLOWED_ORIGINS=http://localhost:3000,https://studentdeals.uz,https://www.studentdeals.uz
   ```

2. **Production (Render)**:
   - Go to Render Dashboard → Service → Environment
   - Add all required variables from the table above

## Development Workflow

### Quick Start

1. **Start API server**:
   ```bash
   pnpm dev:api
   ```

2. **Start Frontend**:
   ```bash
   pnpm dev:web
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - API: http://localhost:3001
   - Health Check: http://localhost:3000/ru/health

### Testing Scenarios

#### 1. Local Development with Production API

```bash
# 1. Set frontend to use production API
echo "NEXT_PUBLIC_API_URL=https://studentdeals-api.onrender.com" > apps/web/.env.local

# 2. Start frontend
pnpm dev:web

# 3. Test registration
# - Go to http://localhost:3000/ru/signup
# - Register a new user
# - Check DevTools Network tab - requests should go to https://studentdeals-api.onrender.com
```

#### 2. Local Development with Local API

```bash
# 1. Set frontend to use local API
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > apps/web/.env.local

# 2. Start API server
pnpm dev:api

# 3. Start frontend
pnpm dev:web

# 4. Test registration
# - Go to http://localhost:3000/ru/signup
# - Register a new user
# - Check DevTools Network tab - requests should go to http://localhost:3001
```

#### 3. Health Check

```bash
# Check API health
curl http://localhost:3001/health

# Check database health
curl http://localhost:3001/health/db

# Check frontend health page
# Go to http://localhost:3000/ru/health
```

## CORS Configuration

The API uses environment-based CORS configuration:

### Local Development
```bash
ALLOWED_ORIGINS=http://localhost:3000,https://studentdeals.uz,https://www.studentdeals.uz
```

### Production
```bash
ALLOWED_ORIGINS=https://studentdeals.uz,https://www.studentdeals.uz
```

### Adding New Origins

To add a new origin (e.g., staging):

1. **Update API environment**:
   ```bash
   ALLOWED_ORIGINS=http://localhost:3000,https://studentdeals.uz,https://www.studentdeals.uz,https://staging.studentdeals.uz
   ```

2. **Restart API server**:
   ```bash
   pnpm dev:api
   ```

## Troubleshooting

### Common Issues

#### 1. CORS Errors

**Symptoms**: Browser shows CORS error in console

**Solution**:
- Check `ALLOWED_ORIGINS` in API environment
- Ensure your frontend URL is in the allowed list
- Restart API server after changing CORS settings

#### 2. API Connection Errors

**Symptoms**: Frontend can't connect to API

**Solution**:
- Check `NEXT_PUBLIC_API_URL` in frontend environment
- Verify API server is running
- Check health endpoint: `curl ${API_URL}/health`

#### 3. Database Connection Errors

**Symptoms**: API can't connect to database

**Solution**:
- Check `DATABASE_URL` in API environment
- Verify database server is running
- Test connection: `curl ${API_URL}/health/db`

### Debug Commands

```bash
# Check frontend environment
cat apps/web/.env.local

# Check API environment
cat apps/api/.env

# Test API health
curl -s http://localhost:3001/health | jq

# Test database health
curl -s http://localhost:3001/health/db | jq

# Check CORS headers
curl -H "Origin: http://localhost:3000" -I http://localhost:3001/health
```

## Production Deployment

### Frontend (Vercel)

1. **Set Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = `https://studentdeals-api.onrender.com`

2. **Deploy**:
   ```bash
   git push origin main
   # Vercel will automatically deploy
   ```

### Backend (Render)

1. **Set Environment Variables**:
   - All variables from the table above
   - `ALLOWED_ORIGINS` = `https://studentdeals.uz,https://www.studentdeals.uz`

2. **Deploy**:
   ```bash
   git push origin main
   # Render will automatically deploy
   ```

## Monitoring

### Health Checks

- **Frontend Health**: https://studentdeals.uz/ru/health
- **API Health**: https://studentdeals-api.onrender.com/health
- **Database Health**: https://studentdeals-api.onrender.com/health/db

### Logs

- **Frontend**: Vercel Dashboard → Functions → Logs
- **Backend**: Render Dashboard → Service → Logs

## Security Notes

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Use strong JWT secrets** in production
3. **Limit CORS origins** to only necessary domains
4. **Use HTTPS** in production
5. **Rotate secrets** regularly

## Support

If you encounter issues:

1. Check this documentation first
2. Check the health endpoints
3. Review logs in Vercel/Render dashboards
4. Test with curl commands
5. Contact the development team
