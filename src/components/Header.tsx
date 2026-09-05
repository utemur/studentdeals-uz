import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { getSession } from '@/lib/session';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { LogoutButton } from '@/components/LogoutButton';

export async function Header() {
  const t = await getTranslations('Header');
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-brand">
          StudentDeals<span className="text-gray-900">.uz</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-700 md:flex">
          <Link href="/brands">{t('brands')}</Link>
          <Link href="/deals">{t('deals')}</Link>
        </nav>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          {session ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-gray-600 sm:inline">{session.email}</span>
              <LogoutButton label={t('logout')} />
            </div>
          ) : (
            <Link
              href="/signin"
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              {t('signIn')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
