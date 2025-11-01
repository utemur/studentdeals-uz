import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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

interface BrandDetailPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// Fetch brand from API
async function fetchBrand(slug: string): Promise<Brand | null> {
  // Use /api/brands for Vercel deployment, or localhost for development
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
  const baseUrl = isProduction 
    ? (process.env.NEXT_PUBLIC_API_URL || '/api')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
  
  try {
    const response = await fetch(`${baseUrl}/brands/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching brand:', error);
    return null;
  }
}

export async function generateMetadata({ params }: BrandDetailPageProps): Promise<Metadata> {
  const { locale, slug } = params;
  
  const brand = await fetchBrand(slug);
  
  if (!brand) {
    return {
      title: locale === 'ru' ? 'Бренд не найден' : 'Brend topilmadi',
    };
  }
  
  return generateSEOMetadata({
    title: `${brand.name} - StudentDeals.uz`,
    description: brand.description || `${brand.name} - эксклюзивные скидки для студентов`,
    locale,
    path: `/brands/${slug}`,
  });
}

export default async function BrandDetailPage({ params }: BrandDetailPageProps) {
  const { locale, slug } = params;
  
  const brand = await fetchBrand(slug);
  
  if (!brand) {
    notFound();
  }

  const categoryName = locale === 'ru' ? brand.category.nameRu : brand.category.nameUz;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link 
              href={`/${locale}`}
              className="text-gray-500 hover:text-gray-700"
            >
              {locale === 'ru' ? 'Главная' : 'Bosh sahifa'}
            </Link>
            <span className="text-gray-400">/</span>
            <Link 
              href={`/${locale}/brands`}
              className="text-gray-500 hover:text-gray-700"
            >
              {locale === 'ru' ? 'Бренды' : 'Brendlar'}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{brand.name}</span>
          </nav>
        </div>
      </div>

      {/* Brand Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {brand.logoUrl ? (
                <Image
                  src={brand.logoUrl}
                  alt={`${brand.name} logo`}
                  width={120}
                  height={120}
                  className="rounded-xl"
                />
              ) : (
                <div className="w-30 h-30 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-400">
                    {brand.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Brand Info */}
            <div className="flex-1">
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-100 text-brand-800">
                  {categoryName}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {brand.name}
              </h1>
              
              {brand.description && (
                <p className="text-lg text-gray-600 leading-relaxed">
                  {brand.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Current Offers */}
            <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'ru' ? 'Текущие предложения' : 'Joriy takliflar'}
              </h2>
              
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {locale === 'ru' ? 'Предложения скоро появятся' : 'Takliflar tez orada paydo bo\'ladi'}
                </h3>
                <p className="text-gray-500">
                  {locale === 'ru' 
                    ? 'Мы работаем над добавлением эксклюзивных предложений от этого бренда'
                    : 'Ushbu brenddan eksklyuziv takliflarni qo\'shish ustida ishlayapmiz'
                  }
                </p>
              </div>
            </div>

            {/* About Brand */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'ru' ? 'О бренде' : 'Brend haqida'}
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {locale === 'ru' 
                    ? 'Этот бренд является нашим партнером и предоставляет эксклюзивные скидки для студентов. Следите за обновлениями, чтобы не пропустить новые предложения!'
                    : 'Ushbu brend bizning hamkorimiz bo\'lib, talabalar uchun eksklyuziv chegirmalar taqdim etadi. Yangi takliflarni o\'tkazib yubormaslik uchun yangilanishlarni kuzatib boring!'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Category Info */}
            <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'ru' ? 'Категория' : 'Kategoriya'}
              </h3>
              
              <Link 
                href={`/${locale}/brands?category=${brand.category.slug}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <span className="text-brand-600 font-semibold">
                    {brand.category.nameRu.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {categoryName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {locale === 'ru' ? 'Посмотреть все бренды' : 'Barcha brendlarni ko\'rish'}
                  </div>
                </div>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'ru' ? 'Как получить скидку' : 'Chegirmani qanday olish mumkin'}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-brand-600 text-xs font-bold">1</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {locale === 'ru' 
                      ? 'Зарегистрируйтесь на платформе'
                      : 'Platformada ro\'yxatdan o\'ting'
                    }
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-brand-600 text-xs font-bold">2</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {locale === 'ru' 
                      ? 'Подтвердите статус студента'
                      : 'Talaba maqomini tasdiqlang'
                    }
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-brand-600 text-xs font-bold">3</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {locale === 'ru' 
                      ? 'Получите доступ к эксклюзивным предложениям'
                      : 'Eksklyuziv takliflarga kirish oling'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
