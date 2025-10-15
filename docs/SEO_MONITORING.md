# SEO & Monitoring Enhancements - StudentDeals.uz

Comprehensive SEO optimization and uptime monitoring setup for StudentDeals.uz.

## 📊 Overview

This document covers:
- 🤖 **robots.txt** - Search engine crawling rules
- 🗺️ **sitemap.xml** - Dynamic sitemap generation
- 🎨 **OG Tags** - Dynamic Open Graph metadata per locale
- 📡 **Better Stack** - Uptime monitoring webhooks
- 📄 **About Page** - Company mission and values

## 🤖 robots.txt

Automatically generated at `/robots.txt` using Next.js Metadata API.

### Configuration

**File:** `apps/web/src/app/robots.ts`

**Features:**
- ✅ Allow all crawlers to access public pages
- ✅ Disallow admin panel (`/admin`, `/dashboard`)
- ✅ Disallow API routes (`/api/*`)
- ✅ Disallow verification/reset token links (`/*?token=*`)
- ✅ Disallow beta page (`/beta`)
- ✅ Block AI training bots (GPTBot, ChatGPT-User, Google-Extended)
- ✅ Link to sitemap
- ✅ Specify canonical host

**Generated robots.txt:**
```txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/*
Disallow: /dashboard
Disallow: /*?token=*
Disallow: /beta

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: Google-Extended
Disallow: /

Sitemap: https://studentdeals.uz/sitemap.xml
Host: https://studentdeals.uz
```

### Testing

```bash
# View robots.txt
curl https://studentdeals.uz/robots.txt

# Verify with Google
https://www.google.com/webmasters/tools/robots-testing-tool
```

## 🗺️ sitemap.xml

Dynamically generated sitemap with multi-locale support.

### Configuration

**File:** `apps/web/src/app/sitemap.ts`

**Features:**
- ✅ Dynamic generation (no static file)
- ✅ Multi-locale support (ru, uz)
- ✅ Alternate language links (hreflang)
- ✅ Priority and change frequency
- ✅ Last modified timestamps

**Included Pages:**
- `/` (Home) - Priority: 1.0, Daily
- `/about` - Priority: 0.8, Weekly
- `/signin` - Priority: 0.6, Monthly
- `/signup` - Priority: 0.6, Monthly
- `/privacy` - Priority: 0.5, Monthly
- `/terms` - Priority: 0.5, Monthly
- `/cookies` - Priority: 0.5, Monthly

**Generated XML:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://studentdeals.uz/ru</loc>
    <lastmod>2025-10-12</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ru" href="https://studentdeals.uz/ru"/>
    <xhtml:link rel="alternate" hreflang="uz" href="https://studentdeals.uz/uz"/>
  </url>
  <!-- More entries... -->
</urlset>
```

### Testing

```bash
# View sitemap
curl https://studentdeals.uz/sitemap.xml

# Validate sitemap
https://www.xml-sitemaps.com/validate-xml-sitemap.html

# Submit to Google
https://search.google.com/search-console
```

## 🎨 Dynamic OG Tags

Open Graph metadata for rich social media previews, dynamically generated per locale.

### Implementation

**Example:** `apps/web/src/app/[locale]/about/page.tsx`

```typescript
export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://studentdeals.uz';

  const content = {
    ru: {
      title: 'О нас | StudentDeals.uz',
      description: 'StudentDeals.uz - платформа эксклюзивных скидок для студентов Узбекистана.',
    },
    uz: {
      title: 'Biz haqimizda | StudentDeals.uz',
      description: 'StudentDeals.uz - O\'zbekiston talabalari uchun eksklyuziv chegirmalar platformasi.',
    },
  };

  const t = content[locale as 'ru' | 'uz'] || content.ru;

  return {
    title: t.title,
    description: t.description,
    openGraph: {
      title: t.title,
      description: t.description,
      url: `${baseUrl}/${locale}/about`,
      siteName: 'StudentDeals.uz',
      locale: locale === 'ru' ? 'ru_RU' : 'uz_UZ',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-about.jpg`,
          width: 1200,
          height: 630,
          alt: 'StudentDeals.uz - О нас',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
      images: [`${baseUrl}/og-about.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
      languages: {
        ru: `${baseUrl}/ru/about`,
        uz: `${baseUrl}/uz/about`,
      },
    },
  };
}
```

### OG Tags Per Page

| Page | Title | Description | Image |
|------|-------|-------------|-------|
| Home | StudentDeals.uz | Эксклюзивные скидки для студентов | og-home.jpg |
| About | О нас \| StudentDeals.uz | Наша миссия и ценности | og-about.jpg |
| Signin | Вход \| StudentDeals.uz | Войдите в аккаунт | og-signin.jpg |
| Signup | Регистрация \| StudentDeals.uz | Создайте аккаунт | og-signup.jpg |

### OG Image Requirements

**Recommended Size:** 1200x630px
**Format:** JPG or PNG
**Max Size:** 8MB
**Aspect Ratio:** 1.91:1

**Location:** `apps/web/public/og-*.jpg`

### Testing OG Tags

```bash
# Facebook Sharing Debugger
https://developers.facebook.com/tools/debug/

# Twitter Card Validator
https://cards-dev.twitter.com/validator

# LinkedIn Post Inspector
https://www.linkedin.com/post-inspector/
```

## 📡 Better Stack Uptime Monitoring

Uptime monitoring with Better Stack (formerly BetterUptime.com).

### Features

- ✅ **Health Checks**: Every 1-5 minutes
- ✅ **Webhook Alerts**: POST to `/monitoring/webhook`
- ✅ **Multi-endpoint**: Monitor API, Auth, Database
- ✅ **Status Page**: Public status dashboard
- ✅ **Incident Management**: Automatic alerting

### Monitored Endpoints

| Endpoint | Check Interval | Timeout | Expected Status |
|----------|----------------|---------|-----------------|
| `/health` | 1 minute | 10s | 200 OK |
| `/health/db` | 5 minutes | 15s | 200 OK |
| `/auth/me` | 5 minutes | 10s | 401 Unauthorized |
| `/monitoring/health` | 1 minute | 10s | 200 OK |

### Webhook Integration

**Endpoint:** `POST /monitoring/webhook`

**Request Body:**
```json
{
  "request_id": "req_123456",
  "monitor_id": "mon_123456",
  "monitor_name": "API Health",
  "monitor_url": "https://api.studentdeals.uz/health",
  "status": "down",
  "started_at": "2025-10-12T14:30:00Z",
  "cause": "Connection timeout"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook received",
  "requestId": "req_123456"
}
```

**Webhook Signature:**
Set `BETTERSTACK_WEBHOOK_SECRET` environment variable for verification.

**Headers:**
```
Content-Type: application/json
X-BetterStack-Signature: <secret>
```

### Setting Up Better Stack

1. **Create Account:**
   - Go to https://betterstack.com/uptime
   - Sign up with email

2. **Add Monitors:**
   ```
   Monitor 1: API Health
   - URL: https://api.studentdeals.uz/health
   - Check interval: 1 minute
   - Expected status: 200
   - Keyword check: "ok"
   
   Monitor 2: Database Health
   - URL: https://api.studentdeals.uz/health/db
   - Check interval: 5 minutes
   - Expected status: 200
   - Keyword check: "connected"
   
   Monitor 3: Auth Endpoint
   - URL: https://api.studentdeals.uz/auth/me
   - Check interval: 5 minutes
   - Expected status: 401
   - Note: This is expected to return 401 (no token)
   ```

3. **Configure Webhook:**
   - Go to Settings → Integrations → Webhooks
   - Add webhook URL: `https://api.studentdeals.uz/monitoring/webhook`
   - Method: POST
   - Add header: `X-BetterStack-Signature: <your-secret>`
   - Test webhook

4. **Set Environment Variable:**
   ```bash
   BETTERSTACK_WEBHOOK_SECRET=your_webhook_secret_here
   ```

5. **Test Alerts:**
   - Temporarily stop API server
   - Wait for alert (1-5 minutes)
   - Check webhook logs
   - Restart API server
   - Verify recovery notification

### API Endpoints

#### GET /monitoring/health

Health check endpoint specifically for Better Stack.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-12T14:30:00.000Z",
  "service": "studentdeals-api",
  "uptime": 12345
}
```

#### POST /monitoring/webhook

Receive Better Stack alerts.

**Request:**
```json
{
  "monitor_name": "API Health",
  "status": "down",
  "cause": "Connection timeout"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook received"
}
```

#### GET /monitoring/status

Get monitoring configuration.

**Response:**
```json
{
  "monitoring": {
    "provider": "Better Stack",
    "endpoints": [
      {
        "name": "API Health",
        "url": "/health",
        "checkInterval": "1 minute"
      }
    ]
  },
  "uptime": 12345,
  "timestamp": "2025-10-12T14:30:00.000Z"
}
```

### Alerting Workflow

```mermaid
graph LR
    A[Better Stack] -->|Health Check| B[API Endpoint]
    B -->|200 OK| A
    B -->|Timeout/Error| C[Better Stack]
    C -->|POST Webhook| D[/monitoring/webhook]
    D -->|Log Alert| E[Pino Logger]
    E -->|Send to| F[Sentry]
    C -->|Notify| G[Slack/Email]
```

## 📄 About Page

Company information page with mission, values, and contact info.

### URL Structure

- Russian: `https://studentdeals.uz/ru/about`
- Uzbek: `https://studentdeals.uz/uz/about`

### Sections

1. **Hero**: Title and subtitle
2. **Mission**: Company mission statement
3. **Story**: How StudentDeals.uz was created
4. **Stats**: Key metrics (10k+ students, 100+ partners)
5. **Values**: 4 core values with icons
6. **How It Works**: 3-step user flow
7. **Team**: About the team
8. **Contact**: Email and feedback link

### SEO Optimization

- ✅ Dynamic metadata per locale
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ Alternate language links (hreflang)
- ✅ Structured data (TODO: JSON-LD)

### Content Highlights

**Mission (Russian):**
> Сделать качественное образование и студенческую жизнь более доступными для всех студентов Узбекистана через эксклюзивные скидки и специальные предложения.

**Mission (Uzbek):**
> Eksklyuziv chegirmalar va maxsus takliflar orqali O'zbekiston barcha talabalari uchun sifatli ta'lim va talaba hayotini yanada qulayroq qilish.

**Stats:**
- 10,000+ Students
- 100+ Partners
- 50% Average Discount
- 24/7 Support

## 🚀 Deployment

### Environment Variables

```bash
# Base URL for absolute URLs
NEXT_PUBLIC_BASE_URL=https://studentdeals.uz

# Better Stack webhook secret
BETTERSTACK_WEBHOOK_SECRET=your_webhook_secret_here

# API URL
NEXT_PUBLIC_API_URL=https://api.studentdeals.uz
```

### Vercel Deployment

```bash
# Deploy with environment variables
vercel --prod \
  -e NEXT_PUBLIC_BASE_URL=https://studentdeals.uz \
  -e NEXT_PUBLIC_API_URL=https://api.studentdeals.uz
```

### Render Deployment

```bash
# Set environment variables in Render dashboard
BETTERSTACK_WEBHOOK_SECRET=your_secret
API_URL=https://api.studentdeals.uz
```

## 📊 Monitoring & Analytics

### Google Search Console

1. **Submit Sitemap:**
   - Go to https://search.google.com/search-console
   - Add sitemap: `https://studentdeals.uz/sitemap.xml`

2. **Verify Ownership:**
   - Add meta tag to `<head>`
   - Or add TXT record to DNS

3. **Monitor Performance:**
   - Check indexing status
   - View search queries
   - Fix crawl errors

### Better Stack Dashboard

1. **Uptime Overview:**
   - Monitor response times
   - View incident history
   - Check status page

2. **Alert Configuration:**
   - Set alert thresholds
   - Configure notification channels
   - Test webhooks

3. **Reporting:**
   - Monthly uptime reports
   - SLA tracking
   - Downtime analysis

## 🔍 SEO Best Practices

### Checklist

- [x] robots.txt configured
- [x] sitemap.xml generated
- [x] OG tags per page
- [x] Twitter Cards
- [x] Canonical URLs
- [x] Alternate language links (hreflang)
- [x] Mobile-friendly
- [x] Fast loading (< 3s)
- [x] HTTPS enabled
- [ ] Structured data (JSON-LD)
- [ ] AMP pages (optional)
- [ ] Page Speed optimized (90+)

### Performance Targets

- **Lighthouse Score**: > 90
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## 📚 Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Better Stack Documentation](https://betterstack.com/docs)
- [Google Search Console](https://search.google.com/search-console)
- [Schema.org](https://schema.org/)

---

**Last Updated**: October 12, 2025
**Maintained By**: StudentDeals.uz Development Team

