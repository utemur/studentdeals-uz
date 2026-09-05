import { getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import { DealCard } from '@/components/DealCard';
import { CategoryNav } from '@/components/CategoryNav';
import { Category } from '@prisma/client';

// Data changes live via Prisma Studio — never prerender this at build time.
export const dynamic = 'force-dynamic';

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const t = await getTranslations('Deals');

  const { category: requested } = await searchParams;
  const category =
    requested && (Object.values(Category) as string[]).includes(requested)
      ? (requested as Category)
      : undefined;

  const deals = await db.deal.findMany({
    where: {
      isActive: true,
      ...(category ? { brand: { category } } : {}),
    },
    include: { brand: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
      <div className="mt-4">
        <CategoryNav active={category} />
      </div>
      {deals.length === 0 ? (
        <p className="mt-6 text-gray-500">{t('empty')}</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </main>
  );
}
