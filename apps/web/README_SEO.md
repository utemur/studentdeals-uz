# SEO & OpenGraph - Quick Reference

Quick guide for SEO optimization in StudentDeals.uz.

## Files

- `src/app/robots.ts` - Robots.txt configuration
- `src/app/sitemap.ts` - Dynamic sitemap generation
- `src/lib/seo.ts` - SEO metadata utility

## Quick Start

### Add SEO to a Page

```typescript
import { generateSEOMetadata, pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { locale } = params;
  const metadata = pageMetadata.home[locale];
  
  return generateSEOMetadata({
    title: metadata.title,
    description: metadata.description,
    locale,
    path: '',
  });
}
```

### Add New Page to Sitemap

```typescript
// Edit src/app/sitemap.ts
const staticPages = [
  '',
  'privacy',
  'terms',
  'about', // Add new page
];
```

## What's Included

### Robots.txt
- ✅ Allow: public pages (/, /ru, /uz, /privacy, /terms)
- ❌ Disallow: private pages (/dashboard, /signin, /api)
- 📍 Sitemap: https://studentdeals.uz/sitemap.xml

### Sitemap.xml
- ✅ All public pages for ru and uz
- ✅ Proper priorities (1.0 for homepage, 0.5 for legal)
- ✅ Change frequencies (daily, weekly, monthly)
- ✅ Hreflang alternates

### Metadata
- ✅ Unique title per page
- ✅ Compelling descriptions
- ✅ OpenGraph tags (og:title, og:description, og:image)
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ Hreflang tags

## Testing

```bash
# View robots.txt
curl https://studentdeals.uz/robots.txt

# View sitemap
curl https://studentdeals.uz/sitemap.xml

# Check metadata
curl -s https://studentdeals.uz/ru | grep -E 'og:|twitter:|canonical|hreflang'

# Test OpenGraph
# https://developers.facebook.com/tools/debug/

# Run Lighthouse SEO audit
npx lighthouse https://studentdeals.uz/ru --only-categories=seo --view
```

## Page Priorities

| Page | Priority | Change Freq | Reason |
|------|----------|-------------|--------|
| Homepage | 1.0 | daily | Most important |
| Privacy/Terms | 0.5 | monthly | Rarely changes |
| Other | 0.8 | weekly | Regular updates |

## OpenGraph Image Specs

- **Size**: 1200x630px
- **Format**: JPG or PNG
- **Max size**: 8MB
- **Location**: `/public/images/og-*.jpg`

## Environment Variables

```bash
# Required
NEXT_PUBLIC_APP_URL=https://studentdeals.uz

# Optional (for verification)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-code
NEXT_PUBLIC_YANDEX_VERIFICATION=your-code
```

## Full Documentation

See [docs/SEO_OPENGRAPH.md](../../docs/SEO_OPENGRAPH.md) for complete guide.

