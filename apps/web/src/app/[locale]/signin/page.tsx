'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@studentdeals/ui';
import { api } from '@/lib/api';
import { analytics } from '@/lib/analytics-server';
import Toast from '@/components/Toast';
import type { LoginRequest, AuthResponse } from '@studentdeals/types';

const TELEGRAM_BOT_URL = 'https://t.me/studentdeals_uz_bot';

export default function SigninPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);
  const [telegramRequired, setTelegramRequired] = useState(false);

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
        
        // Check if it's TELEGRAM_REGISTRATION_REQUIRED error
        if (data.error === 'TELEGRAM_REGISTRATION_REQUIRED' || response.status === 403) {
          // Show special message with Telegram bot link
          setToast({ 
            message: locale === 'ru' 
              ? 'Сначала завершите регистрацию в нашем Telegram-боте.' 
              : 'Avval bizning Telegram-botimizda ro\'yxatdan o\'ting.',
            type: 'error' 
          });
          
          // Store error type to show Telegram bot link
          setTelegramRequired(true);
          setLoading(false);
          return;
        }
        
        throw new Error(data.error || 'Login failed');
      }

      // Track successful signin
      analytics.signinSuccess(data.user?.id);
      
      setToast({ message: locale === 'ru' ? 'Вход выполнен успешно!' : 'Muvaffaqiyatli kirildi!', type: 'success' });
      
      // Редирект через 500ms
      setTimeout(() => {
        router.push(`/${locale}`);
        router.refresh();
      }, 500);
    } catch (err: any) {
      let errorMessage = locale === 'ru' ? 'Ошибка входа' : 'Kirish xatosi';
      
      if (err.message) {
        // Handle specific error messages
        if (err.message.includes('Invalid credentials')) {
          errorMessage = locale === 'ru' ? 'Неверный email или пароль' : 'Noto\'g\'ri email yoki parol';
        } else if (err.message.includes('User not found')) {
          errorMessage = locale === 'ru' ? 'Пользователь не найден' : 'Foydalanuvchi topilmadi';
        } else if (err.message.includes('Network')) {
          errorMessage = locale === 'ru' 
            ? 'Ошибка сети. Проверьте подключение к интернету' 
            : 'Tarmoq xatosi. Internet ulanishini tekshiring';
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

            {telegramRequired && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-900 mb-3">
                  {locale === 'ru' 
                    ? 'Для входа на сайт необходимо сначала зарегистрироваться через наш Telegram-бот.' 
                    : 'Saytga kirish uchun avval Telegram-botimiz orqali ro\'yxatdan o\'tishingiz kerak.'
                  }
                </p>
                <a
                  href={TELEGRAM_BOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.696.064-1.226-.461-1.901-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212-.07-.062-.174-.041-.249-.024-.106.024-1.793 1.14-5.061 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.118.095.151.223.167.312.017.09.038.297.021.459z"/>
                  </svg>
                  {locale === 'ru' ? 'Перейти в Telegram-бот' : 'Telegram-botga o\'tish'}
                </a>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {locale === 'ru' ? 'Нет аккаунта?' : 'Hisobingiz yo\'qmi?'}{' '}
                <a 
                  href={TELEGRAM_BOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 hover:text-brand-700 font-medium transition-colors"
                >
                  {locale === 'ru' ? 'Зарегистрироваться через Telegram' : 'Telegram orqali ro\'yxatdan o\'tish'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}