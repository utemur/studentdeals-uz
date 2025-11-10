'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@studentdeals/ui';

const TELEGRAM_BOT_URL = 'https://t.me/studentdeals_uz_bot';

export default function SignupPage() {
  const params = useParams();
  const locale = params.locale as string;

  // Track signup_start when page loads (user clicked registration)
  useEffect(() => {
    // Optional: track that user visited signup page
    // analytics.signupStart();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-display font-bold text-gray-900">
            {locale === 'ru' ? 'Регистрация студентов' : 'Talabalar ro\'yxatdan o\'tishi'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {locale === 'ru' 
              ? 'Регистрация студентов проходит через наш Telegram-бот'
              : 'Talabalar ro\'yxatdan o\'tishi bizning Telegram-botimiz orqali amalga oshiriladi'
            }
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border-0 p-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <svg className="w-16 h-16 text-brand-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.696.064-1.226-.461-1.901-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212-.07-.062-.174-.041-.249-.024-.106.024-1.793 1.14-5.061 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.118.095.151.223.167.312.017.09.038.297.021.459z"/>
                </svg>
              </div>
              
              <p className="text-gray-700">
                {locale === 'ru' 
                  ? 'Для регистрации на платформе StudentDeals.uz необходимо пройти регистрацию через наш Telegram-бот. Это гарантирует безопасность и подтверждение вашего статуса студента.'
                  : 'StudentDeals.uz platformasida ro\'yxatdan o\'tish uchun bizning Telegram-botimiz orqali ro\'yxatdan o\'tishingiz kerak. Bu xavfsizlikni va talaba maqomingizni tasdiqlashni ta\'minlaydi.'
                }
              </p>
            </div>

            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.696.064-1.226-.461-1.901-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212-.07-.062-.174-.041-.249-.024-.106.024-1.793 1.14-5.061 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.118.095.151.223.167.312.017.09.038.297.021.459z"/>
                </svg>
                {locale === 'ru' ? 'Перейти в Telegram-бот' : 'Telegram-botga o\'tish'}
              </Button>
            </a>

            <div className="text-center">
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
    </div>
  );
}