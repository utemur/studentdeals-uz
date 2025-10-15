import React from 'react';
import { EmptyState } from './EmptyState';

interface NoBrandsFoundProps {
  locale: string;
}

export const NoBrandsFound: React.FC<NoBrandsFoundProps> = ({ locale }) => {
  return (
    <EmptyState
      title={locale === 'ru' ? 'Бренды не найдены' : 'Brendlar topilmadi'}
      description={locale === 'ru' 
        ? 'Попробуйте изменить поисковый запрос или фильтры' 
        : 'Qidiruv so\'rovini yoki filtrlarni o\'zgartirishga harakat qiling'
      }
      icon={
        <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      }
    />
  );
};
