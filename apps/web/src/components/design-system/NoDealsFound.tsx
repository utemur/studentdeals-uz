import React from 'react';
import { EmptyState } from './EmptyState';

interface NoDealsFoundProps {
  locale: string;
}

export const NoDealsFound: React.FC<NoDealsFoundProps> = ({ locale }) => {
  return (
    <EmptyState
      title={locale === 'ru' ? 'Предложения не найдены' : 'Takliflar topilmadi'}
      description={locale === 'ru' 
        ? 'Попробуйте изменить фильтры или поисковый запрос' 
        : 'Filtrlar yoki qidiruv so\'rovini o\'zgartirishga harakat qiling'
      }
      icon={
        <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      }
    />
  );
};
