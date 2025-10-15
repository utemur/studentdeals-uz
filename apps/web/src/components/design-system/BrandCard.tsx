import Link from 'next/link';
import Image from 'next/image';
import { Brand } from '@/types';
import { VerifiedBadge } from './Badge';

interface BrandCardProps {
  brand: Brand;
  locale: string;
  className?: string;
}

export function BrandCard({ brand, locale, className = '' }: BrandCardProps) {
  return (
    <Link
      href={`/${locale}/brands/${brand.slug}`}
      className={`group block bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden border border-gray-100 hover:border-brand-200 hover:-translate-y-1 ${className}`}
    >
      {/* Logo Container */}
      <div className="relative aspect-[3/2] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        {brand.logo ? (
          <Image
            src={brand.logo}
            alt={brand.name}
            width={200}
            height={100}
            className="object-contain max-h-20 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-4xl font-bold text-gray-300">
            {brand.name.charAt(0)}
          </div>
        )}
        
        {brand.isVerified && (
          <div className="absolute top-3 right-3">
            <VerifiedBadge locale={locale} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
          {brand.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {brand.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {brand.dealsCount} {locale === 'ru' ? 'предложений' : 'taklif'}
          </span>
          <span className="text-brand-600 font-medium group-hover:text-brand-700">
            {locale === 'ru' ? 'Смотреть →' : 'Ko\'rish →'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function BrandCardCompact({ brand, locale, className = '' }: BrandCardProps) {
  return (
    <Link
      href={`/${locale}/brands/${brand.slug}`}
      className={`group flex items-center gap-4 bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 p-4 border border-gray-100 hover:border-brand-200 ${className}`}
    >
      {/* Logo */}
      <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        {brand.logo ? (
          <Image
            src={brand.logo}
            alt={brand.name}
            width={64}
            height={64}
            className="object-contain max-h-12 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-2xl font-bold text-gray-300">
            {brand.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-brand-600 transition-colors">
            {brand.name}
          </h3>
          {brand.isVerified && (
            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {brand.dealsCount} {locale === 'ru' ? 'предложений' : 'taklif'}
        </p>
      </div>

      {/* Arrow */}
      <svg 
        className="w-5 h-5 text-gray-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all flex-shrink-0" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

