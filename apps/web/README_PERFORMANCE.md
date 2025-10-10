# Performance Budgets & Web Vitals

Performance budgets and Web Vitals monitoring for StudentDeals.uz.

## Performance Budgets

### Bundle Size Budgets

| Resource | Budget | Current | Status |
|----------|--------|---------|--------|
| First Load JS | 200 KB | TBD | ✅ |
| Page JS | 100 KB | TBD | ✅ |
| CSS | 50 KB | TBD | ✅ |
| Images | 500 KB | TBD | ✅ |

### Web Vitals Budgets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5s - 4s | > 4s |
| **FID** (First Input Delay) | < 100ms | 100ms - 300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |
| **INP** (Interaction to Next Paint) | < 200ms | 200ms - 500ms | > 500ms |
| **FCP** (First Contentful Paint) | < 1.8s | 1.8s - 3s | > 3s |
| **TTFB** (Time to First Byte) | < 800ms | 800ms - 1.8s | > 1.8s |

## Web Vitals Reporting

### What is Tracked

All Core Web Vitals and additional metrics are automatically tracked:

- **LCP** - When the largest content element becomes visible
- **FID** - Time from first interaction to browser response
- **CLS** - Visual stability (layout shifts)
- **INP** - Responsiveness to user interactions (new metric)
- **FCP** - When first content is painted
- **TTFB** - Time to receive first byte from server

### Where Metrics are Sent

1. **Sentry Performance** - For monitoring and alerting
2. **API Endpoint** (`/api/metrics`) - For custom analytics
3. **Console** (dev only) - For debugging

### Implementation

```typescript
// Automatically initialized in layout
import { WebVitals } from '@/components/WebVitals';

<WebVitals />
```

## Bundle Size Checking

### Check Bundle Size

```bash
# Build and check bundle size
pnpm --filter web run build
pnpm --filter web run check:bundle

# Analyze bundle composition
pnpm --filter web run build:analyze
```

### CI Integration

Bundle size is automatically checked on every PR:
- ✅ Pass: All pages < 200KB first load JS
- ❌ Fail: Any page > 200KB first load JS

### What Happens on Failure

1. CI check fails
2. PR cannot be merged
3. Bot comments with details
4. Developer must optimize bundle

## Optimization Strategies

### 1. Code Splitting

```typescript
// ✅ Good - Dynamic import
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
});

// ❌ Bad - Static import
import HeavyComponent from './HeavyComponent';
```

### 2. Tree Shaking

```typescript
// ✅ Good - Named imports
import { Button } from '@studentdeals/ui';

// ❌ Bad - Default import
import * as UI from '@studentdeals/ui';
```

### 3. Remove Unused Dependencies

```bash
# Find unused dependencies
npx depcheck

# Remove unused packages
pnpm remove unused-package
```

### 4. Optimize Images

```typescript
// ✅ Good - next/image with optimization
<OptimizedImage src="/hero.jpg" width={1920} height={1080} />

// ❌ Bad - Regular img tag
<img src="/hero.jpg" />
```

### 5. Use Server Components

```typescript
// ✅ Good - Server component (no JS sent to client)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// ❌ Bad - Client component (JS sent to client)
'use client';
export default function Page() {
  const [data, setData] = useState(null);
  useEffect(() => { fetchData().then(setData); }, []);
  return <div>{data}</div>;
}
```

## Monitoring

### Real User Monitoring (RUM)

Web Vitals are collected from real users and sent to:

1. **Sentry Performance**
   - View in Sentry dashboard
   - Set up alerts for poor metrics
   - Track trends over time

2. **Custom Analytics**
   - Aggregate metrics in database
   - Create custom dashboards
   - Export for analysis

### Synthetic Monitoring

Use Lighthouse CI for automated testing:

```bash
# Run Lighthouse
npx lighthouse https://studentdeals.uz/ru --view

# Expected scores:
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 95
# SEO: > 95
```

## Budgets Rationale

### Why 200KB for First Load JS?

- ✅ **Mobile-friendly** - Loads quickly on 3G networks
- ✅ **Good UX** - Interactive in < 3 seconds
- ✅ **SEO** - Google rewards fast sites
- ✅ **Conversion** - Faster sites convert better

### Industry Benchmarks

| Site Type | Typical First Load JS |
|-----------|----------------------|
| Landing page | 50-100 KB |
| Web app | 150-250 KB |
| E-commerce | 200-300 KB |
| **StudentDeals.uz** | **< 200 KB** ✅ |

## Testing

### Local Testing

```bash
# 1. Build the app
pnpm --filter web run build

# 2. Check bundle size
pnpm --filter web run check:bundle

# 3. Analyze bundle
pnpm --filter web run build:analyze
```

### CI Testing

Bundle size is checked automatically on PRs:

```yaml
# .github/workflows/bundle-size.yml
- name: Check bundle size
  run: pnpm --filter web run check:bundle
```

## Troubleshooting

### Bundle size too large

**Problem:** Bundle exceeds 200KB

**Solutions:**
1. Run `npm run build:analyze` to see what's large
2. Use dynamic imports for heavy components
3. Remove unused dependencies
4. Optimize images
5. Use Server Components where possible

### Web Vitals not reporting

**Problem:** No metrics in Sentry

**Solutions:**
1. Check `web-vitals` package is installed
2. Verify WebVitals component is in layout
3. Check Sentry is configured
4. Test in production mode (some metrics only in prod)

### Metrics showing "poor"

**Problem:** LCP > 4s or CLS > 0.25

**Solutions:**
1. Optimize images (use next/image)
2. Enable caching (ISR, Cache-Control)
3. Reduce JavaScript bundle size
4. Fix layout shifts (set image dimensions)
5. Preload critical resources

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

## Support

For performance issues:
1. Check this documentation
2. Run bundle analyzer
3. Review Web Vitals metrics
4. Check Sentry Performance dashboard
5. Contact performance specialist

