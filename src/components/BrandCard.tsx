import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export type BrandForCard = {
  slug: string;
  name: string;
  category: string;
  description?: string | null;
};

export function BrandCard({ brand }: { brand: BrandForCard }) {
  const t = useTranslations('Categories');

  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="flex flex-col gap-2 rounded-2xl border border-gray-200 p-5 shadow-sm transition hover:shadow-md"
    >
      <span className="w-fit rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-dark">
        {t(brand.category)}
      </span>
      <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
      {brand.description && <p className="text-sm text-gray-500">{brand.description}</p>}
    </Link>
  );
}
