# Visual Regression Testing Guide

Complete guide to visual regression testing with Playwright for StudentDeals.uz.

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Running Tests](#running-tests)
- [Updating Snapshots](#updating-snapshots)
- [CI Integration](#ci-integration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

Visual regression testing helps catch unintended visual changes by:
- ✅ Taking screenshots of key pages
- ✅ Comparing against baseline screenshots
- ✅ Detecting pixel differences
- ✅ Failing tests if changes exceed threshold
- ✅ Running automatically in CI

### What We Test

| Page | Variants | Viewports |
|------|----------|-----------|
| Homepage | ru, uz | Desktop, Tablet, Mobile |
| Sign In | ru, uz | Desktop, Mobile |
| Sign Up | ru, uz | Desktop, Mobile |
| Components | Forms, Buttons | Various states |

## How It Works

### 1. First Run (Baseline)

```bash
# Create baseline screenshots
pnpm --filter web run test:visual:update
```

This creates screenshots in:
```
apps/web/e2e/visual.spec.ts-snapshots/
├── homepage-ru-chromium-linux.png
├── signin-ru-chromium-linux.png
├── signup-ru-chromium-linux.png
└── ...
```

### 2. Subsequent Runs (Comparison)

```bash
# Compare against baseline
pnpm --filter web run test:visual
```

Playwright will:
1. Take new screenshots
2. Compare pixel-by-pixel with baseline
3. Calculate difference percentage
4. Pass if difference < threshold
5. Fail if difference > threshold

### 3. Visual Diff

If tests fail, Playwright generates:
- `*-actual.png` - Current screenshot
- `*-expected.png` - Baseline screenshot
- `*-diff.png` - Visual diff highlighting changes

## Running Tests

### Local Testing

```bash
# Run all visual tests
pnpm --filter web run test:visual

# Run with UI mode (recommended)
pnpm --filter web run test:e2e:ui

# Run specific test
pnpm --filter web exec playwright test visual.spec.ts -g "homepage"

# Update all snapshots
pnpm --filter web run test:visual:update
```

### Update Specific Snapshot

```bash
# Update only homepage snapshots
pnpm --filter web exec playwright test visual.spec.ts -g "homepage" --update-snapshots

# Update only Russian versions
pnpm --filter web exec playwright test visual.spec.ts -g "Russian" --update-snapshots
```

## Updating Snapshots

### When to Update

Update snapshots when:
- ✅ You intentionally changed the UI
- ✅ You updated styles or layout
- ✅ You added new features
- ✅ Tests fail but changes are expected

### How to Update

```bash
# 1. Review the changes
pnpm --filter web run test:visual

# 2. If changes are intentional, update
pnpm --filter web run test:visual:update

# 3. Commit the new snapshots
git add apps/web/e2e/**/*.png
git commit -m "test: update visual regression snapshots"
```

### Reviewing Changes

Before updating snapshots:

1. **Run tests** to see what changed
2. **Check diff images** in `test-results/`
3. **Verify changes are intentional**
4. **Update snapshots** if correct
5. **Commit to git**

## CI Integration

### Automatic Testing

Visual regression tests run automatically on PRs that modify:
- `apps/web/src/**`
- `apps/web/public/**`
- `packages/ui/**`

### Workflow

```yaml
# .github/workflows/visual-regression.yml
- Run visual tests
- Upload artifacts (screenshots, diffs)
- Comment on PR with results
- Fail PR if tests fail
```

### What Happens on Failure

1. ❌ Tests fail
2. 📸 Screenshot diffs uploaded as artifacts
3. 💬 Bot comments on PR with instructions
4. 🚫 PR blocked until fixed

### Viewing Results in CI

1. Go to PR → Checks → Visual Regression Tests
2. Click on "Artifacts"
3. Download `screenshot-diffs`
4. Review `*-diff.png` files

## Best Practices

### 1. Disable Animations

```typescript
// ✅ Good - Animations disabled
await expect(page).toHaveScreenshot('page.png', {
  animations: 'disabled',
});

// ❌ Bad - Animations enabled (flaky)
await expect(page).toHaveScreenshot('page.png');
```

### 2. Wait for Network Idle

```typescript
// ✅ Good - Wait for page to load
await page.goto('/ru');
await page.waitForLoadState('networkidle');
await expect(page).toHaveScreenshot('page.png');

// ❌ Bad - Screenshot too early
await page.goto('/ru');
await expect(page).toHaveScreenshot('page.png');
```

### 3. Set Appropriate Thresholds

```typescript
// ✅ Good - Allow small differences
await expect(page).toHaveScreenshot('page.png', {
  maxDiffPixels: 100, // Allow 100 pixels to differ
  threshold: 0.2, // Allow 20% difference
});

// ❌ Bad - Too strict (flaky)
await expect(page).toHaveScreenshot('page.png', {
  maxDiffPixels: 0,
});
```

### 4. Test Specific Elements

```typescript
// ✅ Good - Test specific component
const form = page.locator('form');
await expect(form).toHaveScreenshot('form.png');

// ❌ Bad - Full page when not needed
await expect(page).toHaveScreenshot('full-page.png', {
  fullPage: true,
});
```

### 5. Handle Dynamic Content

```typescript
// ✅ Good - Mask dynamic content
await expect(page).toHaveScreenshot('page.png', {
  mask: [page.locator('.timestamp'), page.locator('.user-id')],
});

// ❌ Bad - Include dynamic content (flaky)
await expect(page).toHaveScreenshot('page.png');
```

## Configuration

### Playwright Config

```typescript
// playwright.config.ts
expect: {
  toHaveScreenshot: {
    maxDiffPixels: 100, // Max pixels that can differ
    threshold: 0.2, // 20% difference threshold
    animations: 'disabled', // Disable animations
  },
}
```

### Per-Test Config

```typescript
// Override config for specific test
await expect(page).toHaveScreenshot('page.png', {
  maxDiffPixels: 50, // Stricter for this test
  threshold: 0.1,
  fullPage: true,
  animations: 'disabled',
});
```

## Troubleshooting

### Tests failing with small differences

**Problem:** Tests fail but differences are tiny (fonts, anti-aliasing)

**Solutions:**
1. Increase `maxDiffPixels` to 100-200
2. Increase `threshold` to 0.2-0.3
3. Ensure same OS for baseline and CI (use Linux)
4. Disable animations

### Tests flaky (sometimes pass, sometimes fail)

**Problem:** Tests randomly fail

**Solutions:**
1. Wait for `networkidle` before screenshot
2. Disable animations
3. Mask dynamic content (timestamps, IDs)
4. Use fixed viewport size
5. Disable web fonts or wait for them to load

### Snapshots don't match between OS

**Problem:** Mac snapshots don't match Linux CI

**Solutions:**
1. Generate snapshots on Linux (in CI or Docker)
2. Use `--update-snapshots` in CI once
3. Commit Linux snapshots to git
4. Don't generate snapshots locally on Mac

### Large diff files

**Problem:** Diff images are too large

**Solutions:**
1. Test specific components, not full pages
2. Reduce viewport size
3. Use PNG compression
4. Clean up old diffs regularly

## Advanced Usage

### Testing Different States

```typescript
test('button states', async ({ page }) => {
  await page.goto('/ru');
  
  const button = page.getByRole('button', { name: 'Submit' });
  
  // Default state
  await expect(button).toHaveScreenshot('button-default.png');
  
  // Hover state
  await button.hover();
  await expect(button).toHaveScreenshot('button-hover.png');
  
  // Focus state
  await button.focus();
  await expect(button).toHaveScreenshot('button-focus.png');
  
  // Disabled state
  await button.evaluate(el => el.setAttribute('disabled', 'true'));
  await expect(button).toHaveScreenshot('button-disabled.png');
});
```

### Testing Responsive Design

```typescript
test('responsive homepage', async ({ page }) => {
  await page.goto('/ru');
  
  // Mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page).toHaveScreenshot('homepage-mobile.png');
  
  // Tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page).toHaveScreenshot('homepage-tablet.png');
  
  // Desktop
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect(page).toHaveScreenshot('homepage-desktop.png');
});
```

### Masking Dynamic Content

```typescript
test('page with dynamic content', async ({ page }) => {
  await page.goto('/ru/dashboard');
  
  await expect(page).toHaveScreenshot('dashboard.png', {
    // Mask elements that change
    mask: [
      page.locator('.timestamp'),
      page.locator('.user-id'),
      page.locator('.random-content'),
    ],
  });
});
```

## Monitoring

### Metrics to Track

1. **Test Pass Rate** - % of visual tests passing
2. **Snapshot Update Frequency** - How often snapshots change
3. **False Positives** - Tests failing for wrong reasons
4. **Coverage** - % of UI covered by visual tests

### Tools

- **Playwright Report** - View test results and diffs
- **GitHub Artifacts** - Download screenshot diffs
- **Percy** (optional) - Visual testing platform
- **Chromatic** (optional) - Storybook visual testing

## Resources

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Visual Testing Best Practices](https://www.browserstack.com/guide/visual-regression-testing)
- [Percy Documentation](https://docs.percy.io/)
- [Chromatic Documentation](https://www.chromatic.com/docs/)

## Support

For issues with visual regression tests:
1. Check this documentation
2. Review screenshot diffs
3. Check Playwright report
4. Verify viewport and settings
5. Contact QA lead or team lead

