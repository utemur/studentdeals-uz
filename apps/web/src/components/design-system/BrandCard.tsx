import Link from 'next/link';
import Image from 'next/image';

interface Brand {
  id: number;
  slug: string;
  name: string;
  description?: string;
  logoUrl?: string;
  category: {
    id: number;
    slug: string;
    nameRu: string;
    nameUz: string;
  };
}

interface BrandCardProps {
  brand: Brand;
  locale: string;
}

export function BrandCard({ brand, locale }: BrandCardProps) {
  const categoryName = locale === 'ru' ? brand.category.nameRu : brand.category.nameUz;

  return (
    <Link 
      href={`/${locale}/brands/${brand.slug}`}
      className="group block bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 overflow-hidden border border-gray-100 hover:border-brand-200"
    >
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4 h-16">
          {brand.logoUrl ? (
            <Image
              src={brand.logoUrl}
              alt={`${brand.name} logo`}
              width={64}
              height={64}
              className="max-h-16 max-w-16 object-contain"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-400">
                {brand.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Brand Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
          {brand.name}
        </h3>

        {/* Category */}
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
            {categoryName}
          </span>
        </div>

        {/* Description */}
        {brand.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {brand.description}
          </p>
        )}

        {/* View Details Link */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm font-medium text-brand-600 group-hover:text-brand-700 flex items-center gap-1">
            {locale === 'ru' ? 'Подробнее' : 'Batafsil'}
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}