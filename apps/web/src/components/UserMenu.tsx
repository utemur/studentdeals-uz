'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@studentdeals/ui';
import { logout } from '@/app/actions/auth';

interface UserMenuProps {
  user: {
    id: string;
    email: string;
    emailVerifiedAt: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  locale: string;
}

export default function UserMenu({ user, locale }: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/${locale}/signin`)}
        >
          Войти
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push(`/${locale}/signup`)}
        >
          Регистрация
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
          {user.email[0].toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {user.email}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {user.emailVerifiedAt ? 'Email подтвержден' : 'Email не подтвержден'}
                </p>
              </div>
              
              <button
                onClick={() => {
                  router.push(`/${locale}/profile`);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Профиль
              </button>
              
              <button
                onClick={handleLogout}
                disabled={loading}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t"
              >
                {loading ? 'Выход...' : 'Выйти'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

