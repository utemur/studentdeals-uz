'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { Container, Card, CardHeader, CardContent } from '@studentdeals/ui';
import { api } from '@/lib/api';

const TELEGRAM_BOT_URL = 'https://t.me/studentdeals_uz_bot';

type VerificationStatus = 'loading' | 'success' | 'expired' | 'invalid' | 'error';

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      setMessage(locale === 'ru' ? 'Токен верификации не найден' : 'Tekshiruv tokeni topilmadi');
      return;
    }

    verifyEmail(token);
  }, [token, locale]);

  const verifyEmail = async (token: string) => {
    try {
      setStatus('loading');
      
      const response = await api(`/auth/verify?token=${token}`);
      
      if (response.success) {
        setStatus('success');
        setMessage(response.message || (locale === 'ru' ? 'Email успешно подтверждён!' : 'Email muvaffaqiyatli tasdiqlandi!'));
      }
    } catch (error: any) {
      const errorMessage = error.message || (locale === 'ru' ? 'Ошибка верификации' : 'Tekshiruv xatosi');
      
      if (errorMessage.includes('expired')) {
        setStatus('expired');
        setMessage(locale === 'ru' 
          ? 'Срок действия токена истёк. Пожалуйста, запросите новое письмо.' 
          : 'Token muddati tugadi. Iltimos, yangi xat so\'rang.');
      } else if (errorMessage.includes('Invalid') || errorMessage.includes('already used')) {
        setStatus('invalid');
        setMessage(locale === 'ru' 
          ? 'Недействительный токен или токен уже использован.' 
          : 'Noto\'g\'ri token yoki token allaqachon ishlatilgan.');
      } else {
        setStatus('error');
        setMessage(errorMessage);
      }
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        );
      case 'success':
        return (
          <svg className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'expired':
        return (
          <svg className="h-16 w-16 text-yellow-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'invalid':
      case 'error':
        return (
          <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return 'bg-blue-50 border-blue-200';
      case 'success': return 'bg-green-50 border-green-200';
      case 'expired': return 'bg-yellow-50 border-yellow-200';
      case 'invalid':
      case 'error': return 'bg-red-50 border-red-200';
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'loading': return locale === 'ru' ? 'Проверка токена...' : 'Token tekshirilmoqda...';
      case 'success': return locale === 'ru' ? 'Email подтверждён!' : 'Email tasdiqlandi!';
      case 'expired': return locale === 'ru' ? 'Токен истёк' : 'Token muddati tugadi';
      case 'invalid': return locale === 'ru' ? 'Недействительный токен' : 'Noto\'g\'ri token';
      case 'error': return locale === 'ru' ? 'Ошибка верификации' : 'Tekshiruv xatosi';
    }
  };

  return (
    <Container className="py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              {locale === 'ru' ? 'Подтверждение email' : 'Email tasdiqlash'}
            </h1>
          </CardHeader>
          <CardContent>
            <div className={`border rounded-lg p-8 ${getStatusColor()}`}>
              <div className="mb-6">
                {getStatusIcon()}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
                {getStatusTitle()}
              </h2>
              
              <p className="text-center text-gray-700 mb-6">
                {message}
              </p>

              {status === 'success' && (
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">
                    {locale === 'ru' ? 'Теперь вы можете войти в свой аккаунт' : 'Endi hisobingizga kirishingiz mumkin'}
                  </p>
                  <a
                    href={`/${locale}/signin`}
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {locale === 'ru' ? 'Войти в аккаунт' : 'Hisobga kirish'}
                  </a>
                </div>
              )}

              {status === 'expired' && (
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">
                    {locale === 'ru' 
                      ? 'Вы можете запросить новое письмо для подтверждения' 
                      : 'Tasdiqlash uchun yangi xat so\'rashingiz mumkin'}
                  </p>
                  <a
                    href={`/${locale}/signin`}
                    className="inline-block px-6 py-3 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    {locale === 'ru' ? 'Войти и запросить новое письмо' : 'Kirish va yangi xat so\'rash'}
                  </a>
                </div>
              )}

              {(status === 'invalid' || status === 'error') && (
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">
                    {locale === 'ru' 
                      ? 'Пожалуйста, свяжитесь с поддержкой или попробуйте зарегистрироваться снова' 
                      : 'Iltimos, qo\'llab-quvvatlash bilan bog\'laning yoki qayta ro\'yxatdan o\'tishni sinab ko\'ring'}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <a
                      href={`/${locale}`}
                      className="inline-block px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
                    >
                      {locale === 'ru' ? 'На главную' : 'Bosh sahifaga'}
                    </a>
                    <a
                      href={TELEGRAM_BOT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {locale === 'ru' ? 'Зарегистрироваться через Telegram' : 'Telegram orqali ro\'yxatdan o\'tish'}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Debug info (only in development) */}
            {process.env.NODE_ENV === 'development' && token && (
              <div className="mt-6 p-4 bg-gray-100 rounded-md">
                <p className="text-xs font-mono text-gray-600 break-all">
                  Token: {token}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPageContent />
    </Suspense>
  );
}

