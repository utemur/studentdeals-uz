'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@studentdeals/ui';
import { api } from '@/lib/api';
import { analytics } from '@/lib/analytics-server';
import Toast from '@/components/Toast';
import type { RegisterRequest, RegisterResponse, AuthResponse } from '@studentdeals/types';

export default function SignupPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  // Track signup_start when page loads
  useEffect(() => {
    analytics.signupStart();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToast(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const registerData: RegisterRequest = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };

      // Call our Next.js API route (proxy to Render API + auto-login + sets httpOnly cookie)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Track API error
        analytics.apiError('/api/auth/register', response.status, data.error);
        throw new Error(data.error || 'Registration failed');
      }

      // Track successful signup
      analytics.signupSuccess(data.user?.id);

      setToast({ message: 'Регистрация успешна! Добро пожаловать!', type: 'success' });
      
      // Редирект через 500ms
      setTimeout(() => {
        router.push(`/${locale}`);
        router.refresh();
      }, 500);
    } catch (err: any) {
      let errorMessage = 'Ошибка регистрации';
      
      if (err.message) {
        // Handle specific error messages
        if (err.message.includes('already exists') || err.message.includes('already registered')) {
          errorMessage = 'Пользователь с таким email уже зарегистрирован';
        } else if (err.message.includes('Invalid email')) {
          errorMessage = 'Неверный формат email';
        } else if (err.message.includes('Password too short')) {
          errorMessage = 'Пароль должен содержать минимум 8 символов';
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
              {locale === 'ru' ? 'Создать аккаунт' : 'Hisob yaratish'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {locale === 'ru' 
                ? 'Зарегистрируйтесь, чтобы получить доступ к эксклюзивным предложениям для студентов'
                : 'Talabalar uchun eksklyuziv takliflarga kirish uchun ro\'yxatdan o\'ting'
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
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="h-12 w-full px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                  placeholder={locale === 'ru' ? 'Пароль (минимум 8 символов)' : 'Parol (kamida 8 belgi)'}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {loading 
                  ? (locale === 'ru' ? 'Регистрация...' : 'Ro\'yxatdan o\'tilmoqda...') 
                  : (locale === 'ru' ? 'Зарегистрироваться' : 'Ro\'yxatdan o\'tish')
                }
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {locale === 'ru' ? 'Уже есть аккаунт?' : 'Hisobingiz bormi?'}{' '}
                <a 
                  href={`/${locale}/signin`} 
                  className="text-brand-600 hover:text-brand-700 font-medium transition-colors"
                >
                  {locale === 'ru' ? 'Войти' : 'Kirish'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}