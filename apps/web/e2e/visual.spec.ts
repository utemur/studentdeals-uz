import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests
 * 
 * These tests capture screenshots of key pages and compare them
 * against baseline screenshots to detect visual changes.
 * 
 * First run: Creates baseline screenshots
 * Subsequent runs: Compares against baseline
 * 
 * Update baselines: npm run test:e2e:update-snapshots
 */

test.describe('Visual Regression - Homepage', () => {
  test('homepage should match screenshot (Russian)', async ({ page }) => {
    await page.goto('/ru');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take screenshot and compare
    await expect(page).toHaveScreenshot('homepage-ru.png', {
      fullPage: true,
      animations: 'disabled',
      // Allow small differences (fonts, anti-aliasing)
      maxDiffPixels: 100,
    });
  });

  test('homepage should match screenshot (Uzbek)', async ({ page }) => {
    await page.goto('/uz');
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-uz.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    });
  });

  test('homepage hero section (Russian)', async ({ page }) => {
    await page.goto('/ru');
    
    await page.waitForLoadState('networkidle');
    
    // Screenshot of specific section
    const hero = page.locator('main').first();
    await expect(hero).toHaveScreenshot('homepage-hero-ru.png', {
      animations: 'disabled',
      maxDiffPixels: 50,
    });
  });
});

test.describe('Visual Regression - Sign In', () => {
  test('signin page should match screenshot (Russian)', async ({ page }) => {
    await page.goto('/ru/signin');
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('signin-ru.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    });
  });

  test('signin page should match screenshot (Uzbek)', async ({ page }) => {
    await page.goto('/uz/signin');
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('signin-uz.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    });
  });

  test('signin form should match screenshot', async ({ page }) => {
    await page.goto('/ru/signin');
    
    await page.waitForLoadState('networkidle');
    
    // Screenshot of form only
    const form = page.locator('form');
    await expect(form).toHaveScreenshot('signin-form.png', {
      animations: 'disabled',
      maxDiffPixels: 50,
    });
  });
});

test.describe('Visual Regression - Sign Up', () => {
  test('signup page should match screenshot (Russian)', async ({ page }) => {
    await page.goto('/ru/signup');
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('signup-ru.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    });
  });

  test('signup page should match screenshot (Uzbek)', async ({ page }) => {
    await page.goto('/uz/signup');
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('signup-uz.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    });
  });

  test('signup form should match screenshot', async ({ page }) => {
    await page.goto('/ru/signup');
    
    await page.waitForLoadState('networkidle');
    
    // Screenshot of form only
    const form = page.locator('form');
    await expect(form).toHaveScreenshot('signup-form.png', {
      animations: 'disabled',
      maxDiffPixels: 50,
    });
  });
});

test.describe('Visual Regression - Responsive', () => {
  test('homepage mobile view (Russian)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/ru');
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-mobile-ru.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    });
  });

  test('homepage tablet view (Russian)', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/ru');
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-tablet-ru.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    });
  });

  test('signin mobile view (Russian)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/ru/signin');
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('signin-mobile-ru.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    });
  });
});

test.describe('Visual Regression - Dark Mode', () => {
  test('homepage with dark color scheme', async ({ page }) => {
    // Emulate dark color scheme
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/ru');
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage-dark-ru.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    });
  });
});

test.describe('Visual Regression - Interactive States', () => {
  test('signin form with focus state', async ({ page }) => {
    await page.goto('/ru/signin');
    await page.waitForLoadState('networkidle');
    
    // Focus on email input
    await page.getByPlaceholder(/email/i).focus();
    
    const form = page.locator('form');
    await expect(form).toHaveScreenshot('signin-form-focused.png', {
      animations: 'disabled',
      maxDiffPixels: 50,
    });
  });

  test('button hover state', async ({ page }) => {
    await page.goto('/ru/signin');
    await page.waitForLoadState('networkidle');
    
    // Hover over button
    const button = page.locator('form').getByRole('button', { name: /войти/i });
    await button.hover();
    
    await expect(button).toHaveScreenshot('button-hover.png', {
      animations: 'disabled',
      maxDiffPixels: 20,
    });
  });
});

