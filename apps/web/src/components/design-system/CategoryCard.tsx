import Link from 'next/link';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  locale: string;
  className?: string;
}

const categoryIcons: Record<string, string> = {
  food: '🍔',
  entertainment: '🎬',
  education: '📚',
  technology: '💻',
  fashion: '👕',
  travel: '✈️',
  health: '💊',
  beauty: '💄',
  sports: '⚽',
  books: '📖',
};

export function CategoryCard({ category, locale, className = '' }: CategoryCardProps) {
  const icon = categoryIcons[category.slug] || category.icon || '🎁';

  return (
    <Link
      href={`/${locale}/categories/${category.slug}`}
      className={`group block bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 p-6 border border-gray-100 hover:border-brand-200 hover:-translate-y-1 ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <span className="text-3xl">{icon}</span>
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
          {category.name}
        </h3>

        {/* Deals Count */}
        <p className="text-sm text-gray-500">
          {category.dealsCount} {locale === 'ru' ? 'предложений' : 'taklif'}
        </p>
      </div>
    </Link>
  );
}

export function CategoryCardCompact({ category, locale, className = '' }: CategoryCardProps) {
  const icon = categoryIcons[category.slug] || category.icon || '🎁';

  return (
    <Link
      href={`/${locale}/categories/${category.slug}`}
      className={`group flex items-center gap-3 bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 p-4 border border-gray-100 hover:border-brand-200 ${className}`}
    >
      <div className="w-12 h-12 bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-brand-600 transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-gray-500">
          {category.dealsCount} {locale === 'ru' ? 'предложений' : 'taklif'}
        </p>
      </div>
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

