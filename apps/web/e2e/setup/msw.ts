import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';

// Mock API handlers
const handlers = [
  // Mock Next.js API routes
  http.post('http://localhost:3000/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    if (body.email !== 'test@example.com' || body.password !== 'password123') {
      return HttpResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return HttpResponse.json({ 
      success: true,
      message: 'Login successful' 
    });
  }),
  
  http.post('http://localhost:3000/api/auth/register', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    if (body.password.length < 8) {
      return HttpResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    return HttpResponse.json({ 
      success: true,
      message: 'Registration successful' 
    });
  }),
];

export const worker = setupWorker(...handlers);
