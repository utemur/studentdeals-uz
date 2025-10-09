'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@studentdeals/ui';
import { api } from '@/lib/api';
import Toast from '@/components/Toast';
import type { LoginRequest, AuthResponse } from '@studentdeals/types';

export default function SigninPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToast(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const loginData: LoginRequest = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };

      // Call our Next.js API route (proxy to Render API + sets httpOnly cookie)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setToast({ message: 'Вход выполнен успешно!', type: 'success' });
      
      // Редирект через 500ms
      setTimeout(() => {
        router.push(`/${locale}`);
        router.refresh();
      }, 500);
    } catch (err: any) {
      setToast({ message: err.message || 'Ошибка входа', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Войти в аккаунт
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Нет аккаунта?{' '}
              <a href={`/${locale}/signup`} className="font-medium text-blue-600 hover:text-blue-500">
                Зарегистрироваться
              </a>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email адрес"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
}
