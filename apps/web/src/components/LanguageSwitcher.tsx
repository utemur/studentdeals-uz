'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@studentdeals/ui';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const currentLocale = pathname.split('/')[1] || 'ru';

  return (
    <div className="flex gap-2">
      <Button
        variant={currentLocale === 'ru' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('ru')}
        className={currentLocale === 'ru' ? 'bg-black text-white hover:bg-black/90' : ''}
      >
        RU
      </Button>
      <Button
        variant={currentLocale === 'uz' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('uz')}
        className={currentLocale === 'uz' ? 'bg-black text-white hover:bg-black/90' : ''}
      >
        UZ
      </Button>
    </div>
  );
}