import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load Russian homepage', async ({ page }) => {
    await page.goto('/ru');
    
    // Check title
    await expect(page).toHaveTitle(/Student Deals/i);
    
    // Check Russian content
    await expect(page.getByText('Лучшие предложения для студентов')).toBeVisible();
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
    
    // Find and click UZ button
    const uzButton = page.getByRole('button', { name: 'UZ' });
    await expect(uzButton).toBeVisible();
    await uzButton.click();
    
    // Check URL changed
    await expect(page).toHaveURL(/\/uz/);
  });

  test('should switch language from Uzbek to Russian', async ({ page }) => {
    await page.goto('/uz');
    
    // Find and click RU button
    const ruButton = page.getByRole('button', { name: 'RU' });
    await expect(ruButton).toBeVisible();
    await ruButton.click();
    
    // Check URL changed
    await expect(page).toHaveURL(/\/ru/);
  });

  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('/ru');
    
    // Find sign in button
    const signInButton = page.getByRole('button', { name: 'Войти' });
    await expect(signInButton).toBeVisible();
    await signInButton.click();
    await expect(page).toHaveURL(/\/ru\/signin/);
  });

  test('should navigate to sign up page', async ({ page }) => {
    await page.goto('/ru');
    
    // Find sign up button
    const signUpButton = page.getByRole('button', { name: 'Регистрация' });
    await expect(signUpButton).toBeVisible();
    await signUpButton.click();
    await expect(page).toHaveURL(/\/ru\/signup/);
  });
});

