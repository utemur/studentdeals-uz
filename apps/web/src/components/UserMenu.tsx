'use client';

import { Button } from '@studentdeals/ui';
import { UserDTO } from '@studentdeals/types';

interface UserMenuProps {
  user: UserDTO | null;
  locale: string;
}

export default function UserMenu({ user, locale }: UserMenuProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = `/${locale}/signin`}
        >
          Войти
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => window.location.href = `/${locale}/signup`}
        >
          Регистрация
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
        {user?.email && user.email.length > 0 ? user.email[0].toUpperCase() : 'U'}
      </div>
      <span className="text-sm font-medium text-gray-700 hidden sm:block">
        {user?.email || 'Пользователь'}
      </span>
    </div>
  );
}

