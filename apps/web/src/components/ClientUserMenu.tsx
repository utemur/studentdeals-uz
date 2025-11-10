'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@studentdeals/ui';
import { UserDTO } from '@studentdeals/types';

const TELEGRAM_BOT_URL = 'https://t.me/studentdeals_uz_bot';

interface ClientUserMenuProps {
  initialUser: UserDTO | null;
  locale: string;
}

export default function ClientUserMenu({ initialUser, locale }: ClientUserMenuProps) {
  const [user, setUser] = useState(initialUser);

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">
          {locale === 'ru' ? 'Привет' : 'Salom'}, {user.firstName || user.email}!
        </span>
        <Link href={`/${locale}/profile`}>
          <Button variant="outline" size="sm">
            {locale === 'ru' ? 'Профиль' : 'Profil'}
          </Button>
        </Link>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            // Handle logout
            setUser(null);
          }}
        >
          {locale === 'ru' ? 'Выйти' : 'Chiqish'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/${locale}/signin`}>
        <Button variant="outline" size="sm">
          {locale === 'ru' ? 'Войти' : 'Kirish'}
        </Button>
      </Link>
      <a 
        href={TELEGRAM_BOT_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button size="sm">
          {locale === 'ru' ? 'Регистрация' : 'Ro\'yxatdan o\'tish'}
        </Button>
      </a>
    </div>
  );
}