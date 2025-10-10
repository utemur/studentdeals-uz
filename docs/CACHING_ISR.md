# Caching & ISR Strategy

This document describes the caching and Incremental Static Regeneration (ISR) strategy for StudentDeals.uz.

## Table of Contents

- [Overview](#overview)
- [ISR Configuration](#isr-configuration)
- [Cache-Control Headers](#cache-control-headers)
- [Image Optimization](#image-optimization)
- [Static Assets](#static-assets)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Overview

Our caching strategy is designed to:
1. ✅ **Maximize performance** - Fast page loads with aggressive caching
2. ✅ **Minimize server load** - Reduce API calls and database queries
3. ✅ **Ensure freshness** - Content updates within acceptable timeframes
4. ✅ **Optimize costs** - Reduce bandwidth and compute usage

### Caching Layers

```
┌─────────────────────────────────────────────────────────┐
│ Browser Cache (max-age)                                 │
│ - Client-side caching                                   │
│ - Controlled by Cache-Control headers                  │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ CDN Cache (s-maxage)                                    │
│ - Vercel Edge Network / Cloudflare                     │
│ - Shared cache for all users                           │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ ISR Cache (revalidate)                                  │
│ - Next.js static generation                            │
│ - Background revalidation                              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Origin Server                                           │
│ - Next.js server / API                                 │
│ - Database queries                                     │
└─────────────────────────────────────────────────────────┘
```

## ISR Configuration

### What is ISR?

Incremental Static Regeneration allows you to:
- Generate pages statically at build time
- Revalidate and update pages in the background
- Serve stale content while regenerating
- Scale to millions of pages

### Implementation

```typescript
// apps/web/src/app/[locale]/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds

export default function HomePage() {
  // Page content
}
```

### Pages with ISR

| Page | Revalidate | Reason |
|------|------------|--------|
| Homepage (`/`) | 60s | Static content, infrequent updates |
| About | 300s (5min) | Very static content |
| Terms | 3600s (1h) | Rarely changes |

### Pages without ISR (Dynamic)

| Page | Cache Strategy | Reason |
|------|----------------|--------|
| Sign In | Short cache (10s) | User-specific, auth state |
| Sign Up | Short cache (10s) | User-specific, auth state |
| Dashboard | No cache | User-specific data |
| Verify | No cache | One-time tokens |

## Cache-Control Headers

### Header Format

```
Cache-Control: public, max-age=60, s-maxage=60, stale-while-revalidate=300
```

- **`public`**: Cache can be stored by any cache (browser, CDN)
- **`max-age=60`**: Browser cache for 60 seconds
- **`s-maxage=60`**: CDN cache for 60 seconds
- **`stale-while-revalidate=300`**: Serve stale content for 300s while revalidating

### Configuration by Route Type

#### 1. Static Pages (Homepage)

```typescript
// Middleware: apps/web/src/middleware.ts
if (pathname === '/' || pathname.match(/^\/(ru|uz)\/?$/)) {
  response.headers.set(
    'Cache-Control',
    'public, max-age=60, s-maxage=60, stale-while-revalidate=300'
  );
}
```

**Strategy:**
- Browser: 60s cache
- CDN: 60s cache
- Stale: 5 minutes
- **Total freshness window**: 60s + 300s = 6 minutes

#### 2. Dynamic Pages (Auth)

```typescript
// Middleware: apps/web/src/middleware.ts
if (pathname.includes('/signin') || pathname.includes('/signup')) {
  response.headers.set(
    'Cache-Control',
    'public, max-age=0, s-maxage=10, stale-while-revalidate=60'
  );
}
```

**Strategy:**
- Browser: No cache (always fresh)
- CDN: 10s cache
- Stale: 1 minute
- **Total freshness window**: 10s + 60s = 70s

#### 3. User-Specific Pages (Dashboard)

```typescript
// No caching
response.headers.set(
  'Cache-Control',
  'private, no-cache, no-store, must-revalidate'
);
```

**Strategy:**
- No caching at all
- Always fetch fresh data
- User-specific content

### Static Assets

#### Next.js Build Assets

```javascript
// next.config.js
{
  source: '/_next/static/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable',
    },
  ],
}
```

**Strategy:**
- 1 year cache (31536000s)
- `immutable` - never revalidate
- Content-hashed filenames ensure uniqueness

#### Images

```javascript
// next.config.js
{
  source: '/_next/image/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable',
    },
  ],
}
```

**Strategy:**
- 1 year cache
- Optimized by Next.js Image Optimization API
- Automatic format conversion (AVIF, WebP)

#### Public Assets

```javascript
// next.config.js
{
  source: '/images/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable',
    },
  ],
}
```

**Strategy:**
- 1 year cache for `/images`, `/icons`, `/fonts`
- Use versioned filenames or content hashes

## Image Optimization

### Next.js Image Component

```typescript
import { OptimizedImage } from '@/components/OptimizedImage';

// Hero image
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  sizeVariant="hero"
  priority // Load immediately (above the fold)
/>

// Card image
<OptimizedImage
  src="/images/product.jpg"
  alt="Product"
  width={384}
  height={256}
  sizeVariant="card"
/>

// Avatar
<AvatarImage
  src="/images/avatar.jpg"
  alt="User avatar"
  size={40}
/>
```

### Image Sizes Configuration

```javascript
// next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
}
```

### Size Variants

| Variant | Sizes | Use Case |
|---------|-------|----------|
| `icon` | 32-64px | Icons, small logos |
| `thumbnail` | 64-128px | User avatars, thumbnails |
| `card` | 256-384px | Product cards, deal images |
| `content` | 640-1080px | Content images, blog posts |
| `hero` | 1080-1920px | Hero banners, full-width images |
| `full` | 100vw | Full viewport width |

### Image Formats

Next.js automatically serves:
1. **AVIF** - Best compression (50% smaller than JPEG)
2. **WebP** - Good compression (30% smaller than JPEG)
3. **JPEG/PNG** - Fallback for older browsers

## Best Practices

### 1. Use ISR for Static Content

```typescript
// ✅ Good - Static content with ISR
export const revalidate = 60;

export default function AboutPage() {
  return <div>About us...</div>;
}
```

```typescript
// ❌ Bad - Static content without ISR
export default function AboutPage() {
  return <div>About us...</div>;
}
```

### 2. Set Appropriate Cache Times

```typescript
// ✅ Good - Appropriate cache times
Homepage: 60s (frequent updates)
About: 300s (infrequent updates)
Terms: 3600s (rarely changes)
```

```typescript
// ❌ Bad - Same cache time for everything
All pages: 60s
```

### 3. Use stale-while-revalidate

```typescript
// ✅ Good - Serve stale while revalidating
Cache-Control: public, max-age=60, stale-while-revalidate=300
```

```typescript
// ❌ Bad - No stale serving
Cache-Control: public, max-age=60
```

### 4. Optimize Images

```typescript
// ✅ Good - Optimized with next/image
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  sizeVariant="hero"
  priority
/>
```

```typescript
// ❌ Bad - Regular img tag
<img src="/images/hero.jpg" alt="Hero" />
```

### 5. Cache Static Assets Aggressively

```javascript
// ✅ Good - Long cache for static assets
/_next/static/*: 1 year, immutable
/images/*: 1 year, immutable
```

```javascript
// ❌ Bad - Short cache for static assets
/_next/static/*: 1 hour
/images/*: 1 day
```

## Testing

### 1. Test Cache Headers

```bash
# Check homepage cache headers
curl -I https://studentdeals.uz/ru

# Expected:
# Cache-Control: public, max-age=60, s-maxage=60, stale-while-revalidate=300
```

### 2. Test Static Assets

```bash
# Check static asset cache
curl -I https://studentdeals.uz/_next/static/css/app.css

# Expected:
# Cache-Control: public, max-age=31536000, immutable
```

### 3. Test Image Optimization

```bash
# Check image optimization
curl -I https://studentdeals.uz/_next/image?url=/images/hero.jpg&w=1920&q=75

# Expected:
# Content-Type: image/avif (or image/webp)
# Cache-Control: public, max-age=31536000, immutable
```

### 4. Test ISR

```bash
# 1. Visit page
curl https://studentdeals.uz/ru

# 2. Wait 60 seconds (revalidate time)

# 3. Visit again - should trigger revalidation
curl https://studentdeals.uz/ru

# 4. Check server logs for revalidation
```

### 5. Performance Testing

```bash
# Test with Lighthouse
npx lighthouse https://studentdeals.uz/ru --view

# Check metrics:
# - Largest Contentful Paint (LCP) < 2.5s
# - First Input Delay (FID) < 100ms
# - Cumulative Layout Shift (CLS) < 0.1
```

## Troubleshooting

### Images not optimizing

**Problem:** Images loading as original format

**Solutions:**
1. Check `next.config.js` has `unoptimized: false`
2. Verify domain is in `images.domains` array
3. Use `next/image` component, not `<img>`
4. Check browser supports WebP/AVIF

### Cache not working

**Problem:** Pages always fetching fresh

**Solutions:**
1. Check Cache-Control headers with `curl -I`
2. Verify middleware is setting headers
3. Check CDN configuration (Vercel/Cloudflare)
4. Clear browser cache and test again

### ISR not revalidating

**Problem:** Pages not updating after revalidate time

**Solutions:**
1. Check `revalidate` export is present
2. Verify page is not client component (`'use client'`)
3. Check server logs for revalidation
4. Try manual revalidation: `revalidatePath('/')`

### Stale content serving too long

**Problem:** Users seeing old content

**Solutions:**
1. Reduce `stale-while-revalidate` time
2. Reduce `revalidate` time
3. Use on-demand revalidation for critical updates
4. Consider disabling cache for that route

## Performance Metrics

### Expected Performance

| Metric | Target | With Caching |
|--------|--------|--------------|
| TTFB (Time to First Byte) | < 200ms | < 50ms (cached) |
| FCP (First Contentful Paint) | < 1.8s | < 0.9s |
| LCP (Largest Contentful Paint) | < 2.5s | < 1.2s |
| TTI (Time to Interactive) | < 3.8s | < 1.9s |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.05 |

### Cache Hit Rates

| Resource | Target Hit Rate |
|----------|----------------|
| Static assets | > 95% |
| Images | > 90% |
| Pages (CDN) | > 80% |
| Pages (ISR) | > 70% |

## Monitoring

### Key Metrics to Monitor

1. **Cache Hit Rate**
   - CDN cache hits vs misses
   - Target: > 80%

2. **Revalidation Frequency**
   - How often ISR triggers
   - Should match `revalidate` setting

3. **Stale Content Duration**
   - How long stale content is served
   - Should be < `stale-while-revalidate`

4. **Image Optimization Rate**
   - AVIF/WebP vs JPEG/PNG
   - Target: > 90% modern formats

### Tools

- **Vercel Analytics**: Cache hit rates, performance metrics
- **Sentry Performance**: Page load times, transaction duration
- **Lighthouse**: Core Web Vitals, performance score
- **WebPageTest**: Detailed waterfall, cache analysis

## On-Demand Revalidation

For critical updates (e.g., deal expires, content moderation):

```typescript
// API route: app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  // Verify secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }
  
  // Revalidate specific path
  const path = request.nextUrl.searchParams.get('path');
  if (path) {
    revalidatePath(path);
    return Response.json({ revalidated: true, path });
  }
  
  return Response.json({ error: 'Missing path' }, { status: 400 });
}
```

Usage:
```bash
curl -X POST "https://studentdeals.uz/api/revalidate?secret=YOUR_SECRET&path=/ru"
```

## Resources

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Web.dev Caching Best Practices](https://web.dev/http-cache/)

## Support

For issues with caching or ISR:
1. Check this documentation
2. Test cache headers with `curl -I`
3. Check Vercel/CDN logs
4. Review server logs for revalidation
5. Contact DevOps or team lead

