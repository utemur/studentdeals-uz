import Link from 'next/link';
import Image from 'next/image';
import { Offer } from '@/types';
import { formatUZS, calculateDiscount } from '@/lib/currency';
import { DiscountBadge, StudentOnlyBadge, VerifiedBadge, OnlineBadge, OfflineBadge } from './Badge';

interface DealCardProps {
  offer: Offer;
  locale: string;
  className?: string;
}

export function DealCard({ offer, locale, className = '' }: DealCardProps) {
  const discount = offer.discountPercentage || 
    (offer.originalPrice && offer.discountedPrice 
      ? calculateDiscount(offer.originalPrice, offer.discountedPrice) 
      : 0);

  return (
    <Link 
      href={`/${locale}/deals/${offer.slug}`}
      className={`group block bg-white rounded-2xl shadow-soft hover:shadow-hard transition-all duration-300 overflow-hidden border border-gray-100 hover:border-brand-200 ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {offer.image ? (
          <Image
            src={offer.image}
            alt={offer.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
            <svg className="w-16 h-16 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3">
            <DiscountBadge percentage={discount} className="shadow-lg" />
          </div>
        )}
        
        {/* Brand Logo */}
        {offer.brand.logo && (
          <div className="absolute top-3 right-3 w-12 h-12 bg-white rounded-lg shadow-lg p-1.5">
            <Image
              src={offer.brand.logo}
              alt={offer.brand.name}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {offer.isStudentOnly && <StudentOnlyBadge locale={locale} />}
          {offer.brand.isVerified && <VerifiedBadge locale={locale} />}
          {offer.format === 'online' && <OnlineBadge locale={locale} />}
          {offer.format === 'offline' && <OfflineBadge locale={locale} />}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
          {offer.title}
        </h3>

        {/* Brand */}
        <p className="text-sm text-gray-600 mb-3">
          {offer.brand.name}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {offer.description}
        </p>

        {/* Price */}
        {offer.originalPrice && offer.discountedPrice && (
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-brand-600">
              {formatUZS(offer.discountedPrice, locale as 'ru' | 'uz')}
            </span>
            <span className="text-sm text-gray-400 line-through">
              {formatUZS(offer.originalPrice, locale as 'ru' | 'uz')}
            </span>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm font-medium text-brand-600 group-hover:text-brand-700">
            {locale === 'ru' ? 'Получить скидку' : 'Chegirmani olish'}
          </span>
          <svg 
            className="w-5 h-5 text-brand-600 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export function DealCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-[16/9] bg-gray-200" />
      <div className="p-5">
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-20 bg-gray-200 rounded-lg" />
          <div className="h-6 w-16 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="h-4 bg-gray-200 rounded mb-3 w-1/2" />
        <div className="h-4 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded mb-4 w-5/6" />
        <div className="h-8 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

