'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@studentdeals/ui';
import { api } from '@/lib/api';
import { analytics } from '@/lib/analytics-server';
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
        // Track API error
        analytics.apiError('/api/auth/login', response.status, data.error);
        throw new Error(data.error || 'Login failed');
      }

      // Track successful signin
      analytics.signinSuccess(data.user?.id);
      
      setToast({ message: 'Вход выполнен успешно!', type: 'success' });
      
      // Редирект через 500ms
      setTimeout(() => {
        router.push(`/${locale}`);
        router.refresh();
      }, 500);
    } catch (err: any) {
      let errorMessage = 'Ошибка входа';
      
      if (err.message) {
        // Handle specific error messages
        if (err.message.includes('Invalid credentials')) {
          errorMessage = 'Неверный email или пароль';
        } else if (err.message.includes('User not found')) {
          errorMessage = 'Пользователь не найден';
        } else if (err.message.includes('Network')) {
          errorMessage = 'Ошибка сети. Проверьте подключение к интернету';
        } else {
          errorMessage = err.message;
        }
      }
      
      setToast({ message: errorMessage, type: 'error' });
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
      
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-display font-bold text-gray-900">
              {locale === 'ru' ? 'Вход в аккаунт' : 'Hisobga kirish'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {locale === 'ru' 
                ? 'Войдите в свой аккаунт, чтобы получить доступ к эксклюзивным предложениям'
                : 'Eksklyuziv takliflarga kirish uchun hisobingizga kiring'
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border-0 p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  {locale === 'ru' ? 'Email' : 'Email'}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="h-12 w-full px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                  placeholder={locale === 'ru' ? 'your@email.com' : 'your@email.com'}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {locale === 'ru' ? 'Пароль' : 'Parol'}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-12 w-full px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                  placeholder={locale === 'ru' ? '••••••••' : '••••••••'}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {loading 
                  ? (locale === 'ru' ? 'Вход...' : 'Kirilmoqda...') 
                  : (locale === 'ru' ? 'Войти' : 'Kirish')
                }
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {locale === 'ru' ? 'Нет аккаунта?' : 'Hisobingiz yo\'qmi?'}{' '}
                <a 
                  href={`/${locale}/signup`} 
                  className="text-brand-600 hover:text-brand-700 font-medium transition-colors"
                >
                  {locale === 'ru' ? 'Зарегистрироваться' : 'Ro\'yxatdan o\'tish'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}