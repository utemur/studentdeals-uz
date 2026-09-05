'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { locales, type Locale } from '@/i18n';

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-300">/</span>}
          <button
            onClick={() => router.replace(pathname, { locale: l as Locale })}
            className={l === locale ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
