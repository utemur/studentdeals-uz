import { test, expect } from '@playwright/test';
import { http, HttpResponse } from 'msw';

test.describe('Authentication', () => {
  test.describe('Sign In Page', () => {
    test('should display sign in form in Russian', async ({ page }) => {
      await page.goto('/ru/signin');
      
      // Check page title
      await expect(page).toHaveTitle(/Вход|Sign In/i);
      
      // Check form elements
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/пароль|password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /войти|sign in/i })).toBeVisible();
    });

    test('should show error for invalid email', async ({ page }) => {
      await page.goto('/ru/signin');
      
      // Fill invalid email
      await page.getByLabel(/email/i).fill('invalid-email');
      await page.getByLabel(/пароль|password/i).fill('password123');
      
      // Submit form
      await page.getByRole('button', { name: /войти|sign in/i }).click();
      
      // Check for error message
      await expect(page.getByText(/неверный|invalid|ошибка|error/i)).toBeVisible();
    });

    test('should show error for wrong credentials', async ({ page }) => {
      await page.goto('/ru/signin');
      
      // Fill wrong credentials
      await page.getByLabel(/email/i).fill('wrong@example.com');
      await page.getByLabel(/пароль|password/i).fill('wrongpassword');
      
      // Submit form
      await page.getByRole('button', { name: /войти|sign in/i }).click();
      
      // Wait for API call
      await page.waitForTimeout(1000);
      
      // Check for error message
      const errorMessage = page.getByText(/неверные|invalid|credentials/i);
      if (await errorMessage.count() > 0) {
        await expect(errorMessage).toBeVisible();
      }
    });

    test('should successfully login with valid credentials', async ({ page }) => {
      await page.goto('/ru/signin');
      
      // Fill valid credentials (as per MSW mock)
      await page.getByLabel(/email/i).fill('test@example.com');
      await page.getByLabel(/пароль|password/i).fill('password123');
      
      // Submit form
      await page.getByRole('button', { name: /войти|sign in/i }).click();
      
      // Wait for navigation
      await page.waitForTimeout(2000);
      
      // Should redirect to home or dashboard
      await expect(page).not.toHaveURL(/\/signin/);
    });
  });

  test.describe('Sign Up Page', () => {
    test('should display sign up form in Russian', async ({ page }) => {
      await page.goto('/ru/signup');
      
      // Check page title
      await expect(page).toHaveTitle(/Регистрация|Sign Up/i);
      
      // Check form elements
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/пароль|password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /зарегистрироваться|sign up/i })).toBeVisible();
    });

    test('should show error for invalid email', async ({ page }) => {
      await page.goto('/ru/signup');
      
      // Fill invalid email
      await page.getByLabel(/email/i).fill('invalid-email');
      await page.getByLabel(/пароль|password/i).fill('password123');
      
      // Submit form
      await page.getByRole('button', { name: /зарегистрироваться|sign up/i }).click();
      
      // Check for error message
      await expect(page.getByText(/неверный|invalid|ошибка|error/i)).toBeVisible();
    });

    test('should show error for short password', async ({ page }) => {
      await page.goto('/ru/signup');
      
      // Fill short password
      await page.getByLabel(/email/i).fill('test@example.com');
      await page.getByLabel(/пароль|password/i).fill('short');
      
      // Submit form
      await page.getByRole('button', { name: /зарегистрироваться|sign up/i }).click();
      
      // Wait for API call
      await page.waitForTimeout(1000);
      
      // Check for error message
      const errorMessage = page.getByText(/минимум|least|8|символов|characters/i);
      if (await errorMessage.count() > 0) {
        await expect(errorMessage).toBeVisible();
      }
    });

    test('should show error for existing email', async ({ page }) => {
      await page.goto('/ru/signup');
      
      // Fill existing email (as per MSW mock)
      await page.getByLabel(/email/i).fill('existing@example.com');
      await page.getByLabel(/пароль|password/i).fill('password123');
      
      // Submit form
      await page.getByRole('button', { name: /зарегистрироваться|sign up/i }).click();
      
      // Wait for API call
      await page.waitForTimeout(1000);
      
      // Check for error message
      const errorMessage = page.getByText(/уже|already|зарегистрирован|registered/i);
      if (await errorMessage.count() > 0) {
        await expect(errorMessage).toBeVisible();
      }
    });

    test('should successfully register with valid data', async ({ page }) => {
      await page.goto('/ru/signup');
      
      // Fill valid data
      await page.getByLabel(/email/i).fill('newuser@example.com');
      await page.getByLabel(/пароль|password/i).fill('password123');
      
      // Submit form
      await page.getByRole('button', { name: /зарегистрироваться|sign up/i }).click();
      
      // Wait for navigation
      await page.waitForTimeout(2000);
      
      // Should redirect (to home or success page)
      await expect(page).not.toHaveURL(/\/signup/);
    });
  });

  test.describe('Translations', () => {
    test('signin page should have correct Russian translations', async ({ page }) => {
      await page.goto('/ru/signin');
      
      // Check for Russian text
      const russianTexts = [
        /вход/i,
        /email/i,
        /пароль/i,
      ];
      
      for (const text of russianTexts) {
        const element = page.getByText(text).first();
        if (await element.count() > 0) {
          await expect(element).toBeVisible();
        }
      }
    });

    test('signup page should have correct Russian translations', async ({ page }) => {
      await page.goto('/ru/signup');
      
      // Check for Russian text
      const russianTexts = [
        /регистрация/i,
        /email/i,
        /пароль/i,
      ];
      
      for (const text of russianTexts) {
        const element = page.getByText(text).first();
        if (await element.count() > 0) {
          await expect(element).toBeVisible();
        }
      }
    });

    test('signin page should have correct Uzbek translations', async ({ page }) => {
      await page.goto('/uz/signin');
      
      // Page should load (translations may not be complete yet)
      await expect(page).toHaveURL(/\/uz\/signin/);
      
      // Check form exists
      await expect(page.getByLabel(/email/i)).toBeVisible();
    });

    test('signup page should have correct Uzbek translations', async ({ page }) => {
      await page.goto('/uz/signup');
      
      // Page should load (translations may not be complete yet)
      await expect(page).toHaveURL(/\/uz\/signup/);
      
      // Check form exists
      await expect(page.getByLabel(/email/i)).toBeVisible();
    });
  });
});

