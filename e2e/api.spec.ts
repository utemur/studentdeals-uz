import { test, expect } from '@playwright/test';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

test.describe('API Health & Auth Endpoints', () => {
  test('Health endpoint returns 200', async ({ request }) => {
    const response = await request.get(`${API_URL}/health`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('timestamp');
  });

  test('Health DB endpoint returns 200', async ({ request }) => {
    const response = await request.get(`${API_URL}/health/db`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('database', 'connected');
  });

  test('Auth register endpoint validates required fields', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      }
    });
    
    expect(response.status()).toBe(201);
    
    const data = await response.json();
    expect(data).toHaveProperty('user');
    expect(data).toHaveProperty('accessToken');
    expect(data.user).toHaveProperty('email', 'test@example.com');
  });

  test('Auth register rejects invalid email', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: 'invalid-email',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      }
    });
    
    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data.message).toContain('email');
  });

  test('Auth register rejects weak password', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: 'test2@example.com',
        password: '123',
        firstName: 'Test',
        lastName: 'User'
      }
    });
    
    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data.message).toContain('password');
  });

  test('Auth login with valid credentials', async ({ request }) => {
    // First register a user
    await request.post(`${API_URL}/auth/register`, {
      data: {
        email: 'login-test@example.com',
        password: 'password123',
        firstName: 'Login',
        lastName: 'Test'
      }
    });

    // Then login
    const response = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: 'login-test@example.com',
        password: 'password123'
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('user');
    expect(data).toHaveProperty('accessToken');
    expect(data.user.email).toBe('login-test@example.com');
  });

  test('Auth login rejects invalid credentials', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      }
    });
    
    expect(response.status()).toBe(401);
    
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data.message).toContain('Invalid credentials');
  });

  test('Auth me endpoint requires authentication', async ({ request }) => {
    const response = await request.get(`${API_URL}/auth/me`);
    expect(response.status()).toBe(401);
  });

  test('Auth me endpoint with valid token', async ({ request }) => {
    // Register and get token
    const registerResponse = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: 'me-test@example.com',
        password: 'password123',
        firstName: 'Me',
        lastName: 'Test'
      }
    });
    
    const { accessToken } = await registerResponse.json();
    
    // Test /auth/me with token
    const meResponse = await request.get(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    expect(meResponse.status()).toBe(200);
    
    const userData = await meResponse.json();
    expect(userData).toHaveProperty('email', 'me-test@example.com');
  });
});
