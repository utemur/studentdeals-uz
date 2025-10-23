import { Metadata } from 'next';
import { BrandCard } from '@/components/design-system/BrandCard';
import { generateSEOMetadata } from '@/lib/seo';

interface Brand {
  id: number;
  slug: string;
  name: string;
  description?: string;
  logoUrl?: string;
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

// Mock data - will be replaced with API calls
const mockBrands: Brand[] = [
  {
    id: 1,
    slug: 'mcdonalds',
    name: 'McDonald\'s',
    description: 'Всемирно известная сеть ресторанов быстрого питания',
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
    description: 'Сеть ресторанов быстрого питания, специализирующаяся на курице',
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
    description: 'Стриминговая платформа для фильмов и сериалов',
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
    description: 'Музыкальная стриминговая платформа',
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
    description: 'Компания, создающая программное обеспечение для творчества',
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
    description: 'Технологическая корпорация, разработчик Windows и Office',
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
    description: 'Технологическая компания, создатель iPhone и Mac',
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
    description: 'Американская компания, производящая спортивную одежду и обувь',
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
    description: 'Немецкая компания, производитель спортивной одежды и обуви',
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
    description: 'Онлайн-платформа для обучения с курсами от ведущих университетов',
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
    description: 'Онлайн-платформа для обучения с тысячами курсов',
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
    description: 'Онлайн-сервис для бронирования отелей и жилья',
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
    description: 'Сервис заказа такси и доставки',
    logoUrl: null,
    category: {
      id: 6,
      slug: 'travel',
      nameRu: 'Путешествия',
      nameUz: 'Sayohat'
    }
  }
];

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

export default function BrandsPage({ params, searchParams }: BrandsPageProps) {
  const { locale } = params;
  const { category } = searchParams;

  // Filter brands by category if specified
  const filteredBrands = category 
    ? mockBrands.filter(brand => brand.category.slug === category)
    : mockBrands;

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
        {category && (
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <span>
                {locale === 'ru' ? 'Категория:' : 'Kategoriya:'}
              </span>
              <span>
                {filteredBrands[0]?.category[locale === 'ru' ? 'nameRu' : 'nameUz']}
              </span>
            </div>
          </div>
        )}

        {/* Brands Grid */}
        {filteredBrands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBrands.map((brand) => (
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