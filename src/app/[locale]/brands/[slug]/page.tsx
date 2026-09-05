import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import { DealCard } from '@/components/DealCard';

// Data changes live via Prisma Studio — never prerender this at build time.
export const dynamic = 'force-dynamic';

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await db.brand.findUnique({
    where: { slug },
    include: { deals: { where: { isActive: true }, orderBy: { createdAt: 'desc' } } },
  });

  if (!brand || !brand.isActive) notFound();

  const t = await getTranslations('Categories');

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <span className="w-fit rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-dark">
        {t(brand.category)}
      </span>
      <h1 className="mt-3 text-2xl font-bold text-gray-900">{brand.name}</h1>
      {brand.description && <p className="mt-2 max-w-2xl text-gray-600">{brand.description}</p>}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {brand.deals.map((deal) => (
          <DealCard key={deal.id} deal={{ ...deal, brand }} />
        ))}
      </div>
    </main>
  );
}
