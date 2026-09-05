import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Category } from '@prisma/client';

const CATEGORIES = Object.values(Category);

export function CategoryNav({ active }: { active?: Category }) {
  const t = useTranslations('Categories');

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/deals"
        className={`rounded-full border px-3 py-1 text-sm ${
          !active ? 'border-brand bg-brand-light text-brand-dark' : 'border-gray-200 text-gray-600'
        }`}
      >
        {t('ALL')}
      </Link>
      {CATEGORIES.map((c) => (
        <Link
          key={c}
          href={`/deals?category=${c}`}
          className={`rounded-full border px-3 py-1 text-sm ${
            active === c ? 'border-brand bg-brand-light text-brand-dark' : 'border-gray-200 text-gray-600'
          }`}
        >
          {t(c)}
        </Link>
      ))}
    </div>
  );
}
