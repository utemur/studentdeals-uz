'use client';

import { useState, useEffect } from 'react';
import { Container } from '@studentdeals/ui';
import { Button } from '@studentdeals/ui';
import { UserDTO } from '@studentdeals/types';

export default function ProfilePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data
    // In real app, this would come from API
    setTimeout(() => {
      setUser({
        id: '1',
        email: 'student@example.com',
        firstName: 'Али',
        lastName: 'Алиев',
        role: 'USER',
        emailVerifiedAt: new Date().toISOString(),
        // studentVerifiedAt: new Date().toISOString(), // This field doesn't exist in UserDTO
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Container className="py-16">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            {locale === 'ru' ? 'Необходима авторизация' : 'Avtorizatsiya kerak'}
          </h1>
          <p className="text-gray-600 mb-6">
            {locale === 'ru' 
              ? 'Войдите в аккаунт, чтобы просмотреть профиль'
              : 'Profilni ko\'rish uchun hisobingizga kiring'
            }
          </p>
          <a 
            href={`/${locale}/signin`}
            className="inline-flex items-center justify-center rounded-xl font-medium transition-colors bg-brand-500 text-white hover:bg-brand-600 h-12 px-6"
          >
            {locale === 'ru' ? 'Войти' : 'Kirish'}
          </a>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            {locale === 'ru' ? 'Мой профиль' : 'Mening profilim'}
          </h1>
          <p className="text-gray-600">
            {locale === 'ru' 
              ? 'Управляйте своим аккаунтом и настройками'
              : 'Hisobingiz va sozlamalarni boshqaring'
            }
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'ru' ? 'Имя' : 'Ism'}
              </label>
              <input
                type="text"
                value={user.firstName || ''}
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'ru' ? 'Фамилия' : 'Familiya'}
              </label>
              <input
                type="text"
                value={user.lastName || ''}
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                readOnly
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user.email}
                className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                readOnly
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <p className="font-medium text-green-800">
                    {locale === 'ru' ? 'Email подтвержден' : 'Email tasdiqlangan'}
                  </p>
                  <p className="text-sm text-green-600">
                    {user.emailVerifiedAt 
                      ? new Date(user.emailVerifiedAt).toLocaleDateString(locale)
                      : ''
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-brand-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🎓</span>
                </div>
                <div>
                  <p className="font-medium text-brand-800">
                    {locale === 'ru' ? 'Статус студента подтвержден' : 'Talaba maqomi tasdiqlangan'}
                  </p>
                  <p className="text-sm text-brand-600">
                    {/* Student verification date - field doesn't exist in UserDTO */}
                    {user.emailVerifiedAt 
                      ? new Date(user.emailVerifiedAt).toLocaleDateString(locale)
                      : ''
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex space-x-4">
              <Button className="flex-1 bg-brand-500 hover:bg-brand-600 text-white">
                {locale === 'ru' ? 'Редактировать профиль' : 'Profilni tahrirlash'}
              </Button>
              <Button variant="outline" className="flex-1">
                {locale === 'ru' ? 'Изменить пароль' : 'Parolni o\'zgartirish'}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {locale === 'ru' ? 'Статистика' : 'Statistika'}
          </h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-600">0</div>
              <div className="text-sm text-gray-600">
                {locale === 'ru' ? 'Использованных скидок' : 'Ishlatilgan chegirmalar'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-600">0 UZS</div>
              <div className="text-sm text-gray-600">
                {locale === 'ru' ? 'Сэкономлено' : 'Tejash'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
