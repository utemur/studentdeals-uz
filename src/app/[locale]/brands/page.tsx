import { getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import { BrandCard } from '@/components/BrandCard';

// Data changes live via Prisma Studio — never prerender this at build time.
export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
  const t = await getTranslations('Brands');

  const brands = await db.brand.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
      {brands.length === 0 ? (
        <p className="mt-6 text-gray-500">{t('empty')}</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}
    </main>
  );
}
