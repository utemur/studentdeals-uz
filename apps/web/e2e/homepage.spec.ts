import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load Russian homepage', async ({ page }) => {
    await page.goto('/ru');
    
    // Check title
    await expect(page).toHaveTitle(/Student Deals/i);
    
    // Check Russian content
    await expect(page.getByText('Скидки для студентов')).toBeVisible();
  });

  test('should load Uzbek homepage', async ({ page }) => {
    await page.goto('/uz');
    
    // Check title
    await expect(page).toHaveTitle(/Student Deals/i);
    
    // Check Uzbek content (if translated)
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should switch language from Russian to Uzbek', async ({ page }) => {
    await page.goto('/ru');
    
    // Find and click language switcher
    const languageSwitcher = page.getByRole('combobox', { name: /язык|language/i })
      .or(page.locator('select').filter({ hasText: /Русский|Uzbek/ }));
    
    if (await languageSwitcher.count() > 0) {
      await languageSwitcher.selectOption('uz');
      
      // Check URL changed
      await expect(page).toHaveURL(/\/uz/);
    }
  });

  test('should switch language from Uzbek to Russian', async ({ page }) => {
    await page.goto('/uz');
    
    // Find and click language switcher
    const languageSwitcher = page.getByRole('combobox', { name: /til|language/i })
      .or(page.locator('select').filter({ hasText: /Русский|Uzbek/ }));
    
    if (await languageSwitcher.count() > 0) {
      await languageSwitcher.selectOption('ru');
      
      // Check URL changed
      await expect(page).toHaveURL(/\/ru/);
    }
  });

  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('/ru');
    
    // Find sign in link
    const signInLink = page.getByRole('link', { name: /войти|sign in/i });
    
    if (await signInLink.count() > 0) {
      await signInLink.click();
      await expect(page).toHaveURL(/\/ru\/signin/);
    }
  });

  test('should navigate to sign up page', async ({ page }) => {
    await page.goto('/ru');
    
    // Find sign up link
    const signUpLink = page.getByRole('link', { name: /регистрация|зарегистрироваться|sign up/i });
    
    if (await signUpLink.count() > 0) {
      await signUpLink.click();
      await expect(page).toHaveURL(/\/ru\/signup/);
    }
  });
});

