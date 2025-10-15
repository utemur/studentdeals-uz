'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@studentdeals/ui';
import { UserDTO } from '@studentdeals/types';

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
          Привет, {user.firstName || user.email}!
        </span>
        <Link href={`/${locale}/profile`}>
          <Button variant="outline" size="sm">
            Профиль
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
          Выйти
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/${locale}/signin`}>
        <Button variant="outline" size="sm">
          Войти
        </Button>
      </Link>
      <Link href={`/${locale}/signup`}>
        <Button size="sm">
          Регистрация
        </Button>
      </Link>
    </div>
  );
}