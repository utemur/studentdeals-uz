import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages in Russian locale', async ({ page }) => {
    await page.goto('/ru');
    
    // Home page
    await expect(page).toHaveURL(/\/ru/);
    
    // Navigate to health check (if link exists)
    const healthLink = page.getByRole('link', { name: /health/i });
    if (await healthLink.count() > 0) {
      await healthLink.click();
      await expect(page).toHaveURL(/\/ru\/health/);
    }
  });

  test('should navigate between pages in Uzbek locale', async ({ page }) => {
    await page.goto('/uz');
    
    // Home page
    await expect(page).toHaveURL(/\/uz/);
    
    // Navigate to health check (if link exists)
    const healthLink = page.getByRole('link', { name: /health/i });
    if (await healthLink.count() > 0) {
      await healthLink.click();
      await expect(page).toHaveURL(/\/uz\/health/);
    }
  });

  test('should maintain locale when navigating', async ({ page }) => {
    await page.goto('/ru');
    
    // Click any internal link
    const links = page.getByRole('link').filter({ has: page.locator('[href^="/"]') });
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      const firstLink = links.first();
      await firstLink.click();
      
      // Should stay in /ru/* path
      await expect(page).toHaveURL(/\/ru\//);
    }
  });

  test('should redirect root to default locale', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to /ru or /uz
    await expect(page).toHaveURL(/\/(ru|uz)/);
  });

  test('should handle 404 pages', async ({ page }) => {
    await page.goto('/ru/non-existent-page');
    
    // Should show 404 or redirect
    const response = await page.waitForLoadState('networkidle');
    
    // Check if 404 page or redirected
    const url = page.url();
    const has404 = await page.getByText(/404|not found|не найдено/i).count() > 0;
    const isRedirected = !url.includes('non-existent-page');
    
    expect(has404 || isRedirected).toBeTruthy();
  });
});

