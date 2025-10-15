'use client';

import { useState } from 'react';
import { BrandCard } from '@/components/design-system/BrandCard';
import { NoBrandsFound } from '@/components/design-system/EmptyState';
import { SearchBarCompact } from '@/components/design-system/SearchBar';

export default function BrandsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const mockBrands = [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // API call will go here
  };

  return (
    <>
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            {locale === 'ru' ? 'Бренды-партнеры' : 'Brend hamkorlar'}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {locale === 'ru' 
              ? 'Более 500 брендов предлагают скидки для студентов' 
              : '500+ brend talabalar uchun chegirmalar taklif qiladi'}
          </p>
          
          {/* Search */}
          <div className="max-w-2xl">
            <SearchBarCompact 
              locale={locale} 
              placeholder={locale === 'ru' ? 'Поиск брендов...' : 'Brendlarni qidirish...'}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Alphabet Filter */}
          <div className="bg-white rounded-xl shadow-soft p-4 mb-8 border border-gray-100">
            <div className="flex flex-wrap gap-2">
              {['Все', 'A-D', 'E-H', 'I-L', 'M-P', 'Q-T', 'U-Z', '0-9'].map((letter) => (
                <button
                  key={letter}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 animate-pulse">
                  <div className="aspect-[3/2] bg-gray-200" />
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : mockBrands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Brands will be rendered here */}
            </div>
          ) : (
            <NoBrandsFound locale={locale} />
          )}
        </div>
      </section>
    </>
  );
}

