# Caching & Performance Optimization

Quick reference for caching and performance optimization in StudentDeals.uz web app.

## Quick Start

### ISR (Incremental Static Regeneration)

Add to static pages:

```typescript
// Revalidate every 60 seconds
export const revalidate = 60;

export default function Page() {
  return <div>Content</div>;
}
```

### Image Optimization

Use OptimizedImage component:

```typescript
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  sizeVariant="hero"
  priority // for above-the-fold images
/>
```

### Cache Headers

Configured automatically via middleware:

- **Static pages** (homepage): 60s cache, 5min stale
- **Dynamic pages** (auth): 10s cache, 1min stale
- **Static assets**: 1 year cache, immutable

## Configuration Files

- `next.config.js` - Image optimization, static asset headers
- `src/middleware.ts` - Dynamic page cache headers
- `src/components/OptimizedImage.tsx` - Image component with sizes

## Cache Strategy

| Resource | Browser Cache | CDN Cache | Stale Time |
|----------|---------------|-----------|------------|
| Homepage | 60s | 60s | 5min |
| Auth pages | 0s | 10s | 1min |
| Static assets | 1 year | 1 year | - |
| Images | 1 year | 1 year | - |

## Image Sizes

| Variant | Use Case | Sizes |
|---------|----------|-------|
| `icon` | Icons, small logos | 32-64px |
| `thumbnail` | Avatars | 64-128px |
| `card` | Product cards | 256-384px |
| `content` | Content images | 640-1080px |
| `hero` | Hero banners | 1080-1920px |
| `full` | Full width | 100vw |

## Testing

```bash
# Check cache headers
curl -I https://studentdeals.uz/ru

# Test image optimization
curl -I https://studentdeals.uz/_next/image?url=/images/hero.jpg&w=1920&q=75

# Run Lighthouse
npx lighthouse https://studentdeals.uz/ru --view
```

## Performance Targets

- **TTFB**: < 200ms (< 50ms cached)
- **FCP**: < 1.8s (< 0.9s cached)
- **LCP**: < 2.5s (< 1.2s cached)
- **CLS**: < 0.1

## Full Documentation

See [docs/CACHING_ISR.md](../../docs/CACHING_ISR.md) for complete documentation.

