import { test, expect } from '@playwright/test';

test.describe('Locale Redirects', () => {
  test('Root path redirects to default locale (ru)', async ({ page }) => {
    // Navigate to root path
    await page.goto('/');
    
    // Should redirect to /ru
    await expect(page).toHaveURL(/\/ru/);
    
    // Should show the homepage content
    await expect(page).toHaveTitle(/StudentDeals.uz/);
  });

  test('Paths without locale prefix redirect to default locale', async ({ page }) => {
    // Test various paths that should redirect to /ru
    const testPaths = ['/about', '/contact', '/signup', '/signin'];
    
    for (const path of testPaths) {
      await page.goto(path);
      
      // Should redirect to /ru + path
      await expect(page).toHaveURL(`/ru${path}`);
    }
  });

  test('Locale-prefixed paths work correctly', async ({ page }) => {
    // Test that existing locale-prefixed paths work
    await page.goto('/ru/signup');
    await expect(page).toHaveURL('/ru/signup');
    
    await page.goto('/uz/signup');
    await expect(page).toHaveURL('/uz/signup');
  });

  test('Assets are excluded from locale redirects', async ({ page }) => {
    // Test that static assets are not redirected
    const assetPaths = [
      '/favicon.ico',
      '/robots.txt',
      '/sitemap.xml',
      '/sw.js'
    ];
    
    for (const path of assetPaths) {
      const response = await page.goto(path);
      // Should not redirect (status should be 200 or 404, not 301/302)
      expect(response?.status()).not.toBe(301);
      expect(response?.status()).not.toBe(302);
    }
  });

  test('Next.js assets are excluded from locale redirects', async ({ page }) => {
    // Test that _next assets are not redirected
    const response = await page.goto('/_next/static/test.js');
    // Should not redirect (status should be 200 or 404, not 301/302)
    expect(response?.status()).not.toBe(301);
    expect(response?.status()).not.toBe(302);
  });
});
