# SEO & OpenGraph Guide

Complete guide to SEO optimization and OpenGraph configuration for StudentDeals.uz.

## Table of Contents

- [Overview](#overview)
- [Robots.txt](#robotstxt)
- [Sitemap.xml](#sitemapxml)
- [Metadata & OpenGraph](#metadata--opengraph)
- [Canonical & Hreflang](#canonical--hreflang)
- [Structured Data](#structured-data)
- [Best Practices](#best-practices)
- [Testing](#testing)
- [Monitoring](#monitoring)

## Overview

Our SEO strategy includes:
- ✅ **robots.txt** - Control crawler access
- ✅ **sitemap.xml** - Help search engines discover pages
- ✅ **Dynamic metadata** - Per-page title, description, OG tags
- ✅ **Canonical URLs** - Prevent duplicate content
- ✅ **Hreflang tags** - Multi-language support
- ✅ **OpenGraph** - Rich social media previews
- ✅ **Twitter Cards** - Enhanced Twitter sharing

## Robots.txt

### Configuration

```typescript
// apps/web/src/app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/ru/', '/uz/', '/ru/privacy', '/uz/privacy'],
        disallow: ['/api/', '/_next/', '/dashboard', '/signin', '/signup'],
      },
    ],
    sitemap: 'https://studentdeals.uz/sitemap.xml',
  };
}
```

### What's Allowed

- ✅ Homepage (all locales)
- ✅ Privacy and Terms pages
- ✅ Public content pages

### What's Disallowed

- ❌ API routes (`/api/*`)
- ❌ Next.js internals (`/_next/*`)
- ❌ User-specific pages (`/dashboard`, `/signin`, `/signup`)
- ❌ Admin pages

### Testing

```bash
# View robots.txt
curl https://studentdeals.uz/robots.txt

# Expected output:
# User-agent: *
# Allow: /
# Allow: /ru/
# Disallow: /api/
# Sitemap: https://studentdeals.uz/sitemap.xml
```

## Sitemap.xml

### Configuration

```typescript
// apps/web/src/app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://studentdeals.uz';
  const locales = ['ru', 'uz'];
  
  return [
    {
      url: `${baseUrl}/ru`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          ru: `${baseUrl}/ru`,
          uz: `${baseUrl}/uz`,
        },
      },
    },
    // ... more pages
  ];
}
```

### Page Priorities

| Page | Priority | Change Frequency | Reason |
|------|----------|------------------|--------|
| Homepage | 1.0 | daily | Most important, frequent updates |
| Privacy/Terms | 0.5 | monthly | Legal pages, rare updates |
| Other pages | 0.8 | weekly | Regular content |

### Testing

```bash
# View sitemap
curl https://studentdeals.uz/sitemap.xml

# Validate with Google
# https://www.google.com/webmasters/tools/sitemap-test
```

## Metadata & OpenGraph

### SEO Utility

```typescript
// apps/web/src/lib/seo.ts
export function generateSEOMetadata({
  title,
  description,
  locale,
  path,
  image,
}: SEOConfig): Metadata {
  return {
    title: `${title} | StudentDeals.uz`,
    description,
    
    // Canonical URL
    alternates: {
      canonical: `${BASE_URL}/${locale}${path}`,
      languages: {
        ru: `${BASE_URL}/ru${path}`,
        uz: `${BASE_URL}/uz${path}`,
      },
    },
    
    // OpenGraph
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}${path}`,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
```

### Usage in Pages

```typescript
// apps/web/src/app/[locale]/page.tsx
export async function generateMetadata({ params }: Props) {
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

### OpenGraph Tags Generated

```html
<!-- Basic OpenGraph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://studentdeals.uz/ru" />
<meta property="og:title" content="Лучшие предложения для студентов" />
<meta property="og:description" content="Находите эксклюзивные скидки..." />
<meta property="og:image" content="https://studentdeals.uz/images/og-default.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="ru_RU" />
<meta property="og:locale:alternate" content="uz_UZ" />
<meta property="og:site_name" content="StudentDeals.uz" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@studentdealsuz" />
<meta name="twitter:creator" content="@studentdealsuz" />
<meta name="twitter:title" content="Лучшие предложения для студентов" />
<meta name="twitter:description" content="Находите эксклюзивные скидки..." />
<meta name="twitter:image" content="https://studentdeals.uz/images/og-default.jpg" />
```

## Canonical & Hreflang

### What are they?

- **Canonical URL**: Tells search engines which version of a page is the "main" one
- **Hreflang**: Tells search engines which language version to show to users

### Implementation

```typescript
// Automatically generated by generateSEOMetadata()
alternates: {
  canonical: 'https://studentdeals.uz/ru',
  languages: {
    ru: 'https://studentdeals.uz/ru',
    uz: 'https://studentdeals.uz/uz',
  },
}
```

### Generated HTML

```html
<!-- Canonical URL -->
<link rel="canonical" href="https://studentdeals.uz/ru" />

<!-- Hreflang tags -->
<link rel="alternate" hreflang="ru" href="https://studentdeals.uz/ru" />
<link rel="alternate" hreflang="uz" href="https://studentdeals.uz/uz" />
<link rel="alternate" hreflang="x-default" href="https://studentdeals.uz/ru" />
```

### Why it matters

1. **Prevents duplicate content penalties** - Search engines know which version is primary
2. **Improves international SEO** - Users see content in their language
3. **Better user experience** - Automatic language detection

## Structured Data

### JSON-LD for Organization

Add to homepage:

```typescript
// apps/web/src/app/[locale]/page.tsx
export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'StudentDeals.uz',
    url: 'https://studentdeals.uz',
    logo: 'https://studentdeals.uz/logo.png',
    description: 'Лучшие предложения для студентов Узбекистана',
    sameAs: [
      'https://t.me/studentdealsuz',
      'https://instagram.com/studentdealsuz',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@studentdeals.uz',
      contactType: 'Customer Support',
      availableLanguage: ['Russian', 'Uzbek'],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page content */}
    </>
  );
}
```

## Best Practices

### 1. Title Tags

```typescript
// ✅ Good - Descriptive and unique
title: "Лучшие предложения для студентов | StudentDeals.uz"

// ❌ Bad - Generic or duplicate
title: "Home | StudentDeals.uz"
```

**Guidelines:**
- 50-60 characters optimal
- Include main keyword
- Add brand name at the end
- Unique for each page

### 2. Meta Descriptions

```typescript
// ✅ Good - Compelling and informative
description: "Находите эксклюзивные скидки до 50% от местных и международных брендов специально для студентов Узбекистана"

// ❌ Bad - Too short or keyword stuffing
description: "Скидки студентам"
```

**Guidelines:**
- 150-160 characters optimal
- Include call-to-action
- Describe page content
- Include main keywords naturally

### 3. OpenGraph Images

```typescript
// ✅ Good - Proper size and format
image: {
  url: 'https://studentdeals.uz/images/og-homepage.jpg',
  width: 1200,
  height: 630,
  alt: 'StudentDeals.uz - Скидки для студентов',
}

// ❌ Bad - Wrong size or missing
image: 'https://studentdeals.uz/logo.png' // Too small
```

**Guidelines:**
- 1200x630px recommended
- JPG or PNG format
- Max 8MB file size
- Include text overlay for context
- Test with Facebook Debugger

### 4. Canonical URLs

```typescript
// ✅ Good - Always set canonical
alternates: {
  canonical: 'https://studentdeals.uz/ru/privacy',
}

// ❌ Bad - No canonical (duplicate content risk)
```

### 5. Hreflang Tags

```typescript
// ✅ Good - All language versions
alternates: {
  languages: {
    ru: 'https://studentdeals.uz/ru',
    uz: 'https://studentdeals.uz/uz',
  },
}

// ❌ Bad - Missing alternate languages
```

## Testing

### 1. Test Robots.txt

```bash
# View robots.txt
curl https://studentdeals.uz/robots.txt

# Test with Google Search Console
# https://search.google.com/search-console/robots-txt-tester
```

### 2. Test Sitemap

```bash
# View sitemap
curl https://studentdeals.uz/sitemap.xml

# Validate with XML validator
# https://www.xml-sitemaps.com/validate-xml-sitemap.html

# Submit to Google Search Console
# https://search.google.com/search-console
```

### 3. Test Metadata

```bash
# View page source
curl https://studentdeals.uz/ru | grep -E 'meta|title|link rel'

# Check specific tags
curl -s https://studentdeals.uz/ru | grep 'og:title'
curl -s https://studentdeals.uz/ru | grep 'canonical'
curl -s https://studentdeals.uz/ru | grep 'hreflang'
```

### 4. Test OpenGraph

**Facebook Debugger:**
```
https://developers.facebook.com/tools/debug/
```

**Twitter Card Validator:**
```
https://cards-dev.twitter.com/validator
```

**LinkedIn Post Inspector:**
```
https://www.linkedin.com/post-inspector/
```

### 5. Test with Tools

```bash
# Lighthouse SEO audit
npx lighthouse https://studentdeals.uz/ru --only-categories=seo --view

# Check structured data
# https://search.google.com/test/rich-results
```

## Monitoring

### Key Metrics

1. **Search Console Metrics**
   - Impressions
   - Clicks
   - Average position
   - Click-through rate (CTR)

2. **Coverage Issues**
   - Indexed pages
   - Excluded pages
   - Errors and warnings

3. **Core Web Vitals**
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

### Tools

- **Google Search Console**: Primary SEO monitoring
- **Yandex Webmaster**: For Russian market
- **Bing Webmaster Tools**: Additional coverage
- **Ahrefs/SEMrush**: Keyword tracking and backlinks

## Optimization Checklist

### On-Page SEO

- ✅ Unique title for each page
- ✅ Compelling meta description
- ✅ Proper heading hierarchy (H1 → H2 → H3)
- ✅ Alt text for all images
- ✅ Internal linking
- ✅ Fast page load (< 2.5s LCP)
- ✅ Mobile-friendly design
- ✅ HTTPS enabled

### Technical SEO

- ✅ robots.txt configured
- ✅ sitemap.xml generated
- ✅ Canonical URLs set
- ✅ Hreflang tags for multi-language
- ✅ Structured data (JSON-LD)
- ✅ 404 error handling
- ✅ Proper redirects (301)
- ✅ XML sitemap submitted

### Content SEO

- ✅ Unique content for each page
- ✅ Keyword research and optimization
- ✅ Regular content updates
- ✅ Quality over quantity
- ✅ Natural keyword usage
- ✅ Engaging and valuable content

## Common Issues & Solutions

### Issue: Pages not indexed

**Solutions:**
1. Submit sitemap to Google Search Console
2. Check robots.txt isn't blocking
3. Verify canonical URLs are correct
4. Check for noindex tags
5. Request indexing in Search Console

### Issue: Duplicate content

**Solutions:**
1. Set canonical URLs
2. Use hreflang for multi-language
3. Avoid duplicate meta descriptions
4. Use 301 redirects for old URLs

### Issue: Low CTR (Click-Through Rate)

**Solutions:**
1. Improve title tags (more compelling)
2. Write better meta descriptions
3. Add structured data for rich snippets
4. Optimize for featured snippets

### Issue: Poor OpenGraph previews

**Solutions:**
1. Use correct image size (1200x630)
2. Test with Facebook Debugger
3. Clear cache in social platforms
4. Ensure images are accessible

## Environment Variables

Add to `.env.local` and production:

```bash
# Base URL
NEXT_PUBLIC_APP_URL=https://studentdeals.uz

# Search Engine Verification
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification-code
NEXT_PUBLIC_YANDEX_VERIFICATION=your-yandex-verification-code
```

## Integration with Analytics

### Google Analytics 4

```typescript
// Add to layout or _document
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
```

### Yandex Metrica

```typescript
// Add to layout
<Script id="yandex-metrica" strategy="afterInteractive">
  {`(function(m,e,t,r,i,k,a){...})`}
</Script>
```

## Resources

### SEO Tools

- [Google Search Console](https://search.google.com/search-console)
- [Yandex Webmaster](https://webmaster.yandex.com/)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Ahrefs](https://ahrefs.com/)
- [SEMrush](https://www.semrush.com/)

### Testing Tools

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

### Learning Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [OpenGraph Protocol](https://ogp.me/)
- [Schema.org Documentation](https://schema.org/)

## Support

For SEO issues or questions:
1. Check this documentation
2. Test with provided tools
3. Review Search Console reports
4. Contact SEO specialist or team lead

