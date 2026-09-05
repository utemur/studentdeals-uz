import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import { db } from '@/lib/db';
import { DealCard } from '@/components/DealCard';

// Data changes live via Prisma Studio — never prerender this at build time.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const t = await getTranslations('Home');

  const deals = await db.deal.findMany({
    where: { isActive: true },
    include: { brand: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-3xl bg-brand-light px-6 py-14 text-center">
        <h1 className="mx-auto max-w-2xl text-3xl font-bold text-gray-900 md:text-4xl">
          {t('heroTitle')}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">{t('heroSubtitle')}</p>
        <Link
          href="/signin"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          {t('cta')}
        </Link>
      </section>

      <section className="mt-14">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{t('featuredTitle')}</h2>
          <Link href="/deals" className="text-sm font-medium text-brand">
            {t('browseAll')}
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>
    </main>
  );
}
