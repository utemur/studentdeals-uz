import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {icon && (
        <div className="mb-6 text-gray-300">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}

export function NoDealsFound({ locale }: { locale: string }) {
  return (
    <EmptyState
      icon={
        <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      title={locale === 'ru' ? 'Предложения не найдены' : 'Takliflar topilmadi'}
      description={locale === 'ru' 
        ? 'Попробуйте изменить фильтры или поисковый запрос' 
        : 'Filtrlarni yoki qidiruv so\'rovini o\'zgartirib ko\'ring'}
    />
  );
}

export function NoBrandsFound({ locale }: { locale: string }) {
  return (
    <EmptyState
      icon={
        <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      }
      title={locale === 'ru' ? 'Бренды не найдены' : 'Brendlar topilmadi'}
      description={locale === 'ru' 
        ? 'Попробуйте изменить поисковый запрос' 
        : 'Qidiruv so\'rovini o\'zgartirib ko\'ring'}
    />
  );
}

