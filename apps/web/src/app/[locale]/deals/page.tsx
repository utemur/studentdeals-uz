'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DealCard, DealCardSkeleton } from '@/components/design-system/DealCard';
import { NoDealsFound } from '@/components/design-system/EmptyState';
import { Pagination } from '@/components/design-system/Pagination';
import { SearchBar } from '@/components/design-system/SearchBar';

function DealsPageContent({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  // Mock data - will be replaced with API
  const mockDeals = [];
  const totalPages = 0;

  return (
    <>
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            {locale === 'ru' ? 'Все предложения' : 'Barcha takliflar'}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {locale === 'ru' 
              ? 'Найдите лучшие скидки для студентов' 
              : 'Talabalar uchun eng yaxshi chegirmalarni toping'}
          </p>
          
          {/* Search */}
          <SearchBar locale={locale} />
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Category Filter */}
                <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {locale === 'ru' ? 'Категории' : 'Kategoriyalar'}
                  </h3>
                  <div className="space-y-2">
                    {['Еда', 'Развлечения', 'Образование', 'Технологии', 'Мода', 'Путешествия'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-brand-600 transition-colors">
                        <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                        <span className="text-sm">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Format Filter */}
                <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {locale === 'ru' ? 'Формат' : 'Format'}
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-brand-600 transition-colors">
                      <input type="radio" name="format" className="border-gray-300 text-brand-600 focus:ring-brand-500" />
                      <span className="text-sm">{locale === 'ru' ? 'Все' : 'Hammasi'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-brand-600 transition-colors">
                      <input type="radio" name="format" className="border-gray-300 text-brand-600 focus:ring-brand-500" />
                      <span className="text-sm">{locale === 'ru' ? 'Онлайн' : 'Onlayn'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-brand-600 transition-colors">
                      <input type="radio" name="format" className="border-gray-300 text-brand-600 focus:ring-brand-500" />
                      <span className="text-sm">{locale === 'ru' ? 'Оффлайн' : 'Oflayn'}</span>
                    </label>
                  </div>
                </div>

                {/* Discount Filter */}
                <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {locale === 'ru' ? 'Размер скидки' : 'Chegirma hajmi'}
                  </h3>
                  <div className="space-y-2">
                    {['10%+', '25%+', '50%+', '70%+'].map((discount) => (
                      <label key={discount} className="flex items-center gap-2 cursor-pointer hover:text-brand-600 transition-colors">
                        <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                        <span className="text-sm">{discount}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Sort & Filter Bar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-600">
                  {locale === 'ru' ? 'Найдено' : 'Topildi'}: <span className="font-semibold">0</span> {locale === 'ru' ? 'предложений' : 'taklif'}
                </p>
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option>{locale === 'ru' ? 'Сначала новые' : 'Avval yangilari'}</option>
                  <option>{locale === 'ru' ? 'Популярные' : 'Mashhur'}</option>
                  <option>{locale === 'ru' ? 'Скидка (по убыванию)' : 'Chegirma (kamayish)'}</option>
                  <option>{locale === 'ru' ? 'Скоро истекают' : 'Tez tugaydi'}</option>
                </select>
              </div>

              {/* Deals Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <DealCardSkeleton key={i} />
                  ))}
                </div>
              ) : mockDeals.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Deals will be rendered here */}
                  </div>
                  <div className="mt-12">
                    <Pagination currentPage={currentPage} totalPages={totalPages} locale={locale} />
                  </div>
                </>
              ) : (
                <NoDealsFound locale={locale} />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function DealsPage({ params }: { params: { locale: string } }) {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <DealCardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <DealsPageContent locale={params.locale} />
    </Suspense>
  );
}

