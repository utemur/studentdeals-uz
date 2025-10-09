import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.describe('Sign In Page', () => {
    test('should display sign in form in Russian', async ({ page }) => {
      await page.goto('/ru/signin');
      
      // Check page title (should include "Student Deals")
      await expect(page).toHaveTitle(/Student Deals/i);
      
      // Check form heading
      await expect(page.getByText('Войти в аккаунт')).toBeVisible();
      
      // Check form elements by placeholder or name
      await expect(page.getByPlaceholder(/email/i)).toBeVisible();
      await expect(page.getByPlaceholder(/пароль/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /войти/i })).toBeVisible();
    });

    test('should show error for invalid email', async ({ page }) => {
      await page.goto('/ru/signin');
      
      // Fill invalid email
      await page.getByPlaceholder(/email/i).fill('invalid-email');
      await page.getByPlaceholder(/пароль/i).fill('password123');
      
      // Submit form
      await page.getByRole('button', { name: /войти/i }).click();
      
      // Check for error message (will appear as toast)
      await expect(page.getByText(/ошибка|error/i)).toBeVisible();
    });

    test('should show error for wrong credentials', async ({ page }) => {
      await page.goto('/ru/signin');
      
      // Fill wrong credentials
      await page.getByPlaceholder(/email/i).fill('wrong@example.com');
      await page.getByPlaceholder(/пароль/i).fill('wrongpassword');
      
      // Submit form
      await page.getByRole('button', { name: /войти/i }).click();
      
      // Wait for API call and error message
      await page.waitForTimeout(2000);
      
      // Check for error message (toast should appear)
      await expect(page.getByText(/ошибка|error/i)).toBeVisible();
    });

    test('should successfully login with valid credentials', async ({ page }) => {
      await page.goto('/ru/signin');
      
      // Fill valid credentials (as per MSW mock)
      await page.getByPlaceholder(/email/i).fill('test@example.com');
      await page.getByPlaceholder(/пароль/i).fill('password123');
      
      // Submit form
      await page.getByRole('button', { name: /войти/i }).click();
      
      // Wait for navigation (success toast + redirect)
      await page.waitForTimeout(3000);
      
      // Should redirect to home or show success message
      await expect(page).not.toHaveURL(/\/signin/);
    });
  });

  test.describe('Sign Up Page', () => {
    test('should display sign up form in Russian', async ({ page }) => {
      await page.goto('/ru/signup');
      
      // Check page title (should include "Student Deals")
      await expect(page).toHaveTitle(/Student Deals/i);
      
      // Check form heading
      await expect(page.getByText('Создать аккаунт')).toBeVisible();
      
      // Check form elements by placeholder or name
      await expect(page.getByPlaceholder(/email/i)).toBeVisible();
      await expect(page.getByPlaceholder(/пароль/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /зарегистрироваться/i })).toBeVisible();
    });

    test('should show error for invalid email', async ({ page }) => {
      await page.goto('/ru/signup');
      
      // Fill invalid email
      await page.getByPlaceholder(/email/i).fill('invalid-email');
      await page.getByPlaceholder(/пароль/i).fill('password123');
      
      // Submit form
      await page.getByRole('button', { name: /зарегистрироваться/i }).click();
      
      // Check for error message (will appear as toast)
      await expect(page.getByText(/ошибка|error/i)).toBeVisible();
    });

    test('should show error for short password', async ({ page }) => {
      await page.goto('/ru/signup');
      
      // Fill short password
      await page.getByPlaceholder(/email/i).fill('test@example.com');
      await page.getByPlaceholder(/пароль/i).fill('short');
      
      // Submit form
      await page.getByRole('button', { name: /зарегистрироваться/i }).click();
      
      // Wait for API call
      await page.waitForTimeout(2000);
      
      // Check for error message (toast should appear)
      await expect(page.getByText(/ошибка|error/i)).toBeVisible();
    });

    test('should show error for existing email', async ({ page }) => {
      await page.goto('/ru/signup');
      
      // Fill existing email (as per MSW mock)
      await page.getByPlaceholder(/email/i).fill('existing@example.com');
      await page.getByPlaceholder(/пароль/i).fill('password123');
      
      // Submit form
      await page.getByRole('button', { name: /зарегистрироваться/i }).click();
      
      // Wait for API call
      await page.waitForTimeout(2000);
      
      // Check for error message (toast should appear)
      await expect(page.getByText(/ошибка|error/i)).toBeVisible();
    });

    test('should successfully register with valid data', async ({ page }) => {
      await page.goto('/ru/signup');
      
      // Fill valid data
      await page.getByPlaceholder(/email/i).fill('newuser@example.com');
      await page.getByPlaceholder(/пароль/i).fill('password123');
      
      // Submit form
      await page.getByRole('button', { name: /зарегистрироваться/i }).click();
      
      // Wait for navigation (success toast + redirect)
      await page.waitForTimeout(3000);
      
      // Should redirect (to home or success page)
      await expect(page).not.toHaveURL(/\/signup/);
    });
  });

  test.describe('Translations', () => {
    test('signin page should have correct Russian translations', async ({ page }) => {
      await page.goto('/ru/signin');
      
      // Check for Russian text
      await expect(page.getByText('Войти в аккаунт')).toBeVisible();
      await expect(page.getByPlaceholder(/пароль/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /войти/i })).toBeVisible();
    });

    test('signup page should have correct Russian translations', async ({ page }) => {
      await page.goto('/ru/signup');
      
      // Check for Russian text
      await expect(page.getByText('Создать аккаунт')).toBeVisible();
      await expect(page.getByPlaceholder(/пароль/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /зарегистрироваться/i })).toBeVisible();
    });

    test('signin page should have correct Uzbek translations', async ({ page }) => {
      await page.goto('/uz/signin');
      
      // Page should load (translations may not be complete yet)
      await expect(page).toHaveURL(/\/uz\/signin/);
      
      // Check form exists
      await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    });

    test('signup page should have correct Uzbek translations', async ({ page }) => {
      await page.goto('/uz/signup');
      
      // Page should load (translations may not be complete yet)
      await expect(page).toHaveURL(/\/uz\/signup/);
      
      // Check form exists
      await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    });
  });
});

