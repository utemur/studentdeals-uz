import { http, HttpResponse } from 'msw';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const handlers = [
  // Health endpoints
  http.get(`${API_URL}/health`, () => {
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${API_URL}/health/db`, () => {
    return HttpResponse.json({ ok: true, db: 'connected' });
  }),

  // Auth endpoints
  http.post(`${API_URL}/auth/register`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    // Simulate validation errors
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { statusCode: 400, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!body.email.includes('@')) {
      return HttpResponse.json(
        { statusCode: 400, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (body.password.length < 8) {
      return HttpResponse.json(
        { statusCode: 400, message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Simulate email already exists
    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        { statusCode: 400, message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Success response
    return HttpResponse.json({
      id: 'user_123',
      email: body.email,
    }, { status: 201 });
  }),

  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    // Simulate validation errors
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { statusCode: 400, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Simulate invalid credentials
    if (body.email !== 'test@example.com' || body.password !== 'password123') {
      return HttpResponse.json(
        { statusCode: 401, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Success response
    return HttpResponse.json({
      accessToken: 'mock-jwt-token-123',
    });
  }),

  http.get(`${API_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { statusCode: 401, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      id: 'user_123',
      email: 'test@example.com',
      emailVerifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }),

  http.get(`${API_URL}/auth/verify`, ({ request }) => {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return HttpResponse.json(
        { statusCode: 404, message: 'Invalid verification token' },
        { status: 404 }
      );
    }

    if (token === 'expired-token') {
      return HttpResponse.json(
        { statusCode: 400, message: 'Token expired' },
        { status: 400 }
      );
    }

    if (token === 'used-token') {
      return HttpResponse.json(
        { statusCode: 400, message: 'Token already used' },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: 'Email verified successfully',
    });
  }),
];

