import { test, expect } from '@playwright/test';

test.describe('Authentication UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ru');
  });

  test('User can access signup page', async ({ page }) => {
    await page.goto('/ru/signup');
    
    await expect(page).toHaveTitle(/StudentDeals.uz/);
    await expect(page.locator('h1')).toContainText(/Регистрация|Sign Up/);
    
    // Check form fields
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('User can access signin page', async ({ page }) => {
    await page.goto('/ru/signin');
    
    await expect(page).toHaveTitle(/StudentDeals.uz/);
    await expect(page.locator('h1')).toContainText(/Вход|Sign In/);
    
    // Check form fields
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Signup form validation works', async ({ page }) => {
    await page.goto('/ru/signup');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Обязательное поле|Required field')).toBeVisible();
  });

  test('Signup with valid data', async ({ page }) => {
    await page.goto('/ru/signup');
    
    // Fill form with valid data
    await page.fill('input[name="email"]', 'test-ui@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect or show success message
    await page.waitForLoadState('networkidle');
    
    // Check for success indicators
    const successIndicator = page.locator('text=Успешно|Success').or(
      page.locator('text=Проверьте почту|Check your email')
    );
    await expect(successIndicator).toBeVisible({ timeout: 10000 });
  });

  test('Signup prevents duplicate email registration', async ({ page }) => {
    await page.goto('/ru/signup');
    
    // Fill form with existing email
    await page.fill('input[name="email"]', 'admin@studentdeals.uz');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=already registered|already exists|уже зарегистрирован')).toBeVisible();
  });

  test('Signin with valid credentials', async ({ page }) => {
    await page.goto('/ru/signin');
    
    // Fill form with valid credentials
    await page.fill('input[name="email"]', 'admin@studentdeals.uz');
    await page.fill('input[name="password"]', 'admin123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard or show success
    await page.waitForLoadState('networkidle');
    
    // Check for success indicators
    const successIndicator = page.locator('text=Добро пожаловать|Welcome').or(
      page.locator('text=Dashboard|Панель')
    );
    await expect(successIndicator).toBeVisible({ timeout: 10000 });
  });

  test('Signin rejects invalid credentials', async ({ page }) => {
    await page.goto('/ru/signin');
    
    // Fill form with invalid credentials
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Invalid credentials|Неверные данные|Ошибка')).toBeVisible();
  });

  test('Language switcher works', async ({ page }) => {
    await page.goto('/ru/signup');
    
    // Check if language switcher exists
    const languageSwitcher = page.locator('[data-testid="language-switcher"]').or(
      page.locator('button:has-text("UZ")')
    );
    
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();
      
      // Should switch to Uzbek
      await expect(page).toHaveURL(/\/uz\//);
    }
  });

  test('Form accessibility', async ({ page }) => {
    await page.goto('/ru/signup');
    
    // Check for proper labels
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Check for required attributes
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('Mobile responsive design', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/ru/signup');
    
    // Check if form is visible and usable on mobile
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check if form is properly sized for mobile
    const form = page.locator('form');
    const formBox = await form.boundingBox();
    expect(formBox?.width).toBeLessThanOrEqual(375);
  });
});
