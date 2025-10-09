'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface AuthResponse {
  accessToken: string;
}

interface UserResponse {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const locale = formData.get('locale') as string || 'ru';

  if (!email || !password) {
    return { error: 'Email и пароль обязательны' };
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { 
        error: error.message || 'Ошибка регистрации' 
      };
    }

    const data = await response.json();
    
    // После успешной регистрации автоматически логиним
    const loginFormData = new FormData();
    loginFormData.set('email', email);
    loginFormData.set('password', password);
    loginFormData.set('locale', locale);
    
    return await login(loginFormData);
  } catch (error) {
    console.error('Register error:', error);
    return { error: 'Ошибка подключения к серверу' };
  }
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const locale = formData.get('locale') as string || 'ru';

  if (!email || !password) {
    return { error: 'Email и пароль обязательны' };
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      return { 
        error: error.message || 'Неверный email или пароль' 
      };
    }

    const data: AuthResponse = await response.json();
    
    // Сохраняем access token в cookie
    const cookieStore = await cookies();
    cookieStore.set('access_token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 30, // 30 минут
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Ошибка подключения к серверу' };
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { error: 'Ошибка при выходе' };
  }
}

export async function getMe(): Promise<UserResponse | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return null;
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      credentials: 'include',
    });

    if (!response.ok) {
      // Если токен невалиден, удаляем его
      cookieStore.delete('access_token');
      return null;
    }

    const user: UserResponse = await response.json();
    return user;
  } catch (error) {
    console.error('GetMe error:', error);
    return null;
  }
}

