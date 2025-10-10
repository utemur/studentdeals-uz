# Environment Variables Setup

This document describes all environment variables needed for StudentDeals.uz.

## Quick Start

### Web App (Next.js)

Create `apps/web/.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=1.0
NEXT_PUBLIC_SENTRY_DEBUG=false

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### API (NestJS)

Create `apps/api/.env`:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/studentdeals

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Email Configuration (Resend)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@studentdeals.uz

# Sentry Configuration
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_TRACES_SAMPLE_RATE=1.0
SENTRY_PROFILES_SAMPLE_RATE=1.0
SENTRY_DEBUG=false
SENTRY_RELEASE=

# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Production Configuration

### Vercel (Web App)

Set these environment variables in Vercel dashboard:

```bash
# Production values
NEXT_PUBLIC_API_URL=https://api.studentdeals.uz
NEXT_PUBLIC_SENTRY_DSN=https://your-prod-dsn@sentry.io/project-id
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1  # 10% sampling
NEXT_PUBLIC_APP_URL=https://studentdeals.uz
```

### Render (API)

Set these environment variables in Render dashboard:

```bash
# Production values
DATABASE_URL=postgresql://user:password@host:5432/studentdeals
JWT_SECRET=your-production-secret-key-very-long-and-random
JWT_EXPIRES_IN=7d
RESEND_API_KEY=re_your_production_api_key
RESEND_FROM_EMAIL=noreply@studentdeals.uz
SENTRY_DSN=https://your-prod-dsn@sentry.io/project-id
SENTRY_TRACES_SAMPLE_RATE=0.1  # 10% sampling
SENTRY_PROFILES_SAMPLE_RATE=0.1  # 10% sampling
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://studentdeals.uz
```

## Variable Descriptions

### Web App

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | - | Backend API URL |
| `NEXT_PUBLIC_SENTRY_DSN` | Yes | - | Sentry project DSN |
| `NEXT_PUBLIC_ENVIRONMENT` | No | `NODE_ENV` | Environment name |
| `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` | No | `0.1` (prod), `1.0` (dev) | Performance sampling rate |
| `NEXT_PUBLIC_SENTRY_DEBUG` | No | `false` | Enable Sentry debug logs |
| `NEXT_PUBLIC_APP_URL` | Yes | - | Frontend URL |

### API

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `JWT_SECRET` | Yes | - | Secret key for JWT tokens |
| `JWT_EXPIRES_IN` | No | `7d` | JWT token expiration |
| `RESEND_API_KEY` | Yes | - | Resend email service API key |
| `RESEND_FROM_EMAIL` | Yes | - | Sender email address |
| `SENTRY_DSN` | Yes | - | Sentry project DSN |
| `SENTRY_TRACES_SAMPLE_RATE` | No | `0.1` (prod), `1.0` (dev) | Performance sampling rate |
| `SENTRY_PROFILES_SAMPLE_RATE` | No | `0.1` (prod), `1.0` (dev) | Profiling sampling rate |
| `SENTRY_DEBUG` | No | `false` | Enable Sentry debug logs |
| `SENTRY_RELEASE` | No | - | Release version for Sentry |
| `NODE_ENV` | No | `development` | Environment mode |
| `PORT` | No | `3001` | API server port |
| `FRONTEND_URL` | Yes | - | Frontend URL for CORS |

## Security Best Practices

1. ✅ **Never commit .env files** - They are in `.gitignore`
2. ✅ **Use different secrets for each environment** - Don't reuse dev secrets in prod
3. ✅ **Rotate secrets regularly** - Change JWT_SECRET and API keys periodically
4. ✅ **Use strong JWT secrets** - At least 32 characters, random
5. ✅ **Limit CORS origins** - Only allow trusted domains
6. ✅ **Use environment-specific Sentry DSNs** - Separate projects for dev/prod

## Getting API Keys

### Sentry DSN
1. Go to [sentry.io](https://sentry.io)
2. Create a new project (or use existing)
3. Go to Settings → Projects → [Your Project] → Client Keys (DSN)
4. Copy the DSN

### Resend API Key
1. Go to [resend.com](https://resend.com)
2. Sign up / Log in
3. Go to API Keys
4. Create a new API key
5. Copy the key (starts with `re_`)

### Database URL
For local development:
```bash
# Start PostgreSQL with Docker
docker run --name studentdeals-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=studentdeals \
  -p 5432:5432 \
  -d postgres:15

# Connection string
DATABASE_URL=postgresql://postgres:password@localhost:5432/studentdeals
```

For production, use managed PostgreSQL:
- Render PostgreSQL
- Supabase
- Railway
- Neon

## Troubleshooting

### "Missing API key" error (Resend)
- Check `RESEND_API_KEY` is set
- Verify key starts with `re_`
- Check key is valid in Resend dashboard

### "Invalid DSN" error (Sentry)
- Check `SENTRY_DSN` format: `https://key@sentry.io/project-id`
- Verify project exists in Sentry
- Check DSN is not expired

### Database connection errors
- Verify `DATABASE_URL` format
- Check database is running
- Verify credentials are correct
- Check network/firewall rules

### CORS errors
- Verify `FRONTEND_URL` matches actual frontend URL
- Check CORS configuration in `main.ts`
- Ensure origin is in allowed list

## CI/CD Integration

### GitHub Actions

Add these secrets to GitHub repository:

```yaml
# Web App (Vercel)
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

# API (Render)
RENDER_API_KEY
RENDER_SERVICE_ID

# Sentry
SENTRY_AUTH_TOKEN
SENTRY_ORG
SENTRY_PROJECT
```

### Automatic Release Tracking

Set `SENTRY_RELEASE` to git commit SHA:

```bash
# In CI/CD
export SENTRY_RELEASE=$(git rev-parse --short HEAD)
```

## Support

For issues with environment variables:
1. Check this documentation
2. Verify all required variables are set
3. Check variable values are correct
4. Review application logs for specific errors
5. Contact team lead or DevOps

