import { Metadata } from 'next';
import { BrandCard } from '@/components/design-system/BrandCard';
import { generateSEOMetadata } from '@/lib/seo';

interface Brand {
  id: number;
  slug: string;
  name: string;
  description?: string;
  logoUrl?: string | null;
  category: {
    id: number;
    slug: string;
    nameRu: string;
    nameUz: string;
  };
}

interface BrandsPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    category?: string;
  };
}

// Fetch brands from API
async function fetchBrands(category?: string): Promise<Brand[]> {
  // Use /api/brands for Vercel deployment, or localhost for development
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
  const baseUrl = isProduction 
    ? (process.env.NEXT_PUBLIC_API_URL || '/api')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
  
  const url = category 
    ? `${baseUrl}/brands?category=${category}`
    : `${baseUrl}/brands`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('[DEBUG] Fetched brands:', data.data?.slice(0, 3).map((b: any) => ({ name: b.name, logoUrl: b.logoUrl })));
    return data.data || [];
  } catch (error) {
    console.error('Error fetching brands:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

export async function generateMetadata({ params }: BrandsPageProps): Promise<Metadata> {
  const { locale } = params;
  
  return generateSEOMetadata({
    title: locale === 'ru' ? 'Бренды - StudentDeals.uz' : 'Brendlar - StudentDeals.uz',
    description: locale === 'ru' 
      ? 'Все бренды-партнеры с эксклюзивными скидками для студентов'
      : 'Talabalar uchun eksklyuziv chegirmalar bilan barcha hamkor brendlar',
    locale,
    path: '/brands',
  });
}

export default async function BrandsPage({ params, searchParams }: BrandsPageProps) {
  const { locale } = params;
  const { category } = searchParams;

  // Fetch brands from API
  const brands = await fetchBrands(category);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {locale === 'ru' ? 'Бренды-партнеры' : 'Hamkor brendlar'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === 'ru' 
                ? 'Эксклюзивные скидки от ведущих брендов для студентов Узбекистана'
                : 'O\'zbekiston talabalari uchun yetakchi brendlardan eksklyuziv chegirmalar'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        {category && brands.length > 0 && (
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <span>
                {locale === 'ru' ? 'Категория:' : 'Kategoriya:'}
              </span>
              <span>
                {brands[0]?.category[locale === 'ru' ? 'nameRu' : 'nameUz']}
              </span>
            </div>
          </div>
        )}

        {/* Brands Grid */}
        {brands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <BrandCard
                key={brand.id}
                brand={brand}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {locale === 'ru' ? 'Бренды не найдены' : 'Brendlar topilmadi'}
            </h3>
            <p className="text-gray-500">
              {locale === 'ru' 
                ? 'Попробуйте изменить фильтры или вернуться позже'
                : 'Filtrlarni o\'zgartiring yoki keyinroq qaytib keling'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}