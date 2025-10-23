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

// Mock data - will be replaced with API calls
const mockBrands: Brand[] = [
  {
    id: 1,
    slug: 'mcdonalds',
    name: 'McDonald\'s',
    description: 'Всемирно известная сеть ресторанов быстрого питания с более чем 40,000 ресторанами в 100+ странах. McDonald\'s предлагает студентам эксклюзивные скидки на популярные блюда.',
    logoUrl: null,
    category: {
      id: 1,
      slug: 'food',
      nameRu: 'Еда и напитки',
      nameUz: 'Ovqat va ichimliklar'
    }
  },
  {
    id: 2,
    slug: 'kfc',
    name: 'KFC',
    description: 'Сеть ресторанов быстрого питания, специализирующаяся на курице. KFC предлагает студентам специальные цены на свои знаменитые блюда.',
    logoUrl: null,
    category: {
      id: 1,
      slug: 'food',
      nameRu: 'Еда и напитки',
      nameUz: 'Ovqat va ichimliklar'
    }
  },
  {
    id: 3,
    slug: 'netflix',
    name: 'Netflix',
    description: 'Стриминговая платформа для фильмов и сериалов с миллионами подписчиков по всему миру. Netflix предлагает студентам специальные тарифы на подписку.',
    logoUrl: null,
    category: {
      id: 2,
      slug: 'entertainment',
      nameRu: 'Развлечения',
      nameUz: 'O\'yin-kulgi'
    }
  },
  {
    id: 4,
    slug: 'spotify',
    name: 'Spotify',
    description: 'Музыкальная стриминговая платформа с более чем 100 миллионами треков. Spotify предоставляет студентам скидки на премиум подписку.',
    logoUrl: null,
    category: {
      id: 2,
      slug: 'entertainment',
      nameRu: 'Развлечения',
      nameUz: 'O\'yin-kulgi'
    }
  },
  {
    id: 5,
    slug: 'adobe',
    name: 'Adobe',
    description: 'Компания, создающая программное обеспечение для творчества. Adobe Creative Cloud предлагает студентам значительные скидки на свои продукты.',
    logoUrl: null,
    category: {
      id: 4,
      slug: 'technology',
      nameRu: 'Технологии',
      nameUz: 'Texnologiya'
    }
  },
  {
    id: 6,
    slug: 'microsoft',
    name: 'Microsoft',
    description: 'Технологическая корпорация, разработчик Windows и Office. Microsoft предоставляет студентам бесплатный доступ к Office 365 и другим продуктам.',
    logoUrl: null,
    category: {
      id: 4,
      slug: 'technology',
      nameRu: 'Технологии',
      nameUz: 'Texnologiya'
    }
  },
  {
    id: 7,
    slug: 'apple',
    name: 'Apple',
    description: 'Технологическая компания, создатель iPhone и Mac. Apple предлагает студентам образовательные скидки на свои устройства.',
    logoUrl: null,
    category: {
      id: 4,
      slug: 'technology',
      nameRu: 'Технологии',
      nameUz: 'Texnologiya'
    }
  },
  {
    id: 8,
    slug: 'nike',
    name: 'Nike',
    description: 'Американская компания, производящая спортивную одежду и обувь. Nike предоставляет студентам скидки на спортивную экипировку.',
    logoUrl: null,
    category: {
      id: 5,
      slug: 'fashion',
      nameRu: 'Мода',
      nameUz: 'Moda'
    }
  },
  {
    id: 9,
    slug: 'adidas',
    name: 'Adidas',
    description: 'Немецкая компания, производитель спортивной одежды и обуви. Adidas предлагает студентам специальные цены на спортивные товары.',
    logoUrl: null,
    category: {
      id: 5,
      slug: 'fashion',
      nameRu: 'Мода',
      nameUz: 'Moda'
    }
  },
  {
    id: 10,
    slug: 'coursera',
    name: 'Coursera',
    description: 'Онлайн-платформа для обучения с курсами от ведущих университетов. Coursera предоставляет студентам бесплатный доступ к тысячам курсов.',
    logoUrl: null,
    category: {
      id: 3,
      slug: 'education',
      nameRu: 'Образование',
      nameUz: 'Ta\'lim'
    }
  },
  {
    id: 11,
    slug: 'udemy',
    name: 'Udemy',
    description: 'Онлайн-платформа для обучения с тысячами курсов. Udemy предлагает студентам скидки на курсы по программированию, дизайну и другим навыкам.',
    logoUrl: null,
    category: {
      id: 3,
      slug: 'education',
      nameRu: 'Образование',
      nameUz: 'Ta\'lim'
    }
  },
  {
    id: 12,
    slug: 'booking-com',
    name: 'Booking.com',
    description: 'Онлайн-сервис для бронирования отелей и жилья. Booking.com предоставляет студентам специальные тарифы на путешествия.',
    logoUrl: null,
    category: {
      id: 6,
      slug: 'travel',
      nameRu: 'Путешествия',
      nameUz: 'Sayohat'
    }
  },
  {
    id: 13,
    slug: 'uber',
    name: 'Uber',
    description: 'Сервис заказа такси и доставки. Uber предлагает студентам скидки на поездки и доставку еды.',
    logoUrl: null,
    category: {
      id: 6,
      slug: 'travel',
      nameRu: 'Путешествия',
      nameUz: 'Sayohat'
    }
  }
];

export async function generateMetadata({ params }: BrandDetailPageProps): Promise<Metadata> {
  const { locale, slug } = params;
  
  const brand = mockBrands.find(b => b.slug === slug);
  
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

export default function BrandDetailPage({ params }: BrandDetailPageProps) {
  const { locale, slug } = params;
  
  const brand = mockBrands.find(b => b.slug === slug);
  
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
