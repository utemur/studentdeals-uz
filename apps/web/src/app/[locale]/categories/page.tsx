import { CategoryCard } from '@/components/design-system/CategoryCard';
import { Category } from '@/types';

export default function CategoriesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  // Mock categories
  const categories: Category[] = [
    { id: '1', slug: 'food', name: locale === 'ru' ? 'Еда и напитки' : 'Ovqat va ichimliklar', icon: '🍔', dealsCount: 150, order: 1, description: locale === 'ru' ? 'Рестораны, кафе, доставка еды' : 'Restoranlar, kafeler, ovqat yetkazib berish' },
    { id: '2', slug: 'entertainment', name: locale === 'ru' ? 'Развлечения' : 'Ko\'ngilochar', icon: '🎬', dealsCount: 89, order: 2, description: locale === 'ru' ? 'Кино, концерты, мероприятия' : 'Kino, konsertlar, tadbirlar' },
    { id: '3', slug: 'education', name: locale === 'ru' ? 'Образование' : 'Ta\'lim', icon: '📚', dealsCount: 67, order: 3, description: locale === 'ru' ? 'Курсы, книги, обучение' : 'Kurslar, kitoblar, o\'qitish' },
    { id: '4', slug: 'technology', name: locale === 'ru' ? 'Технологии' : 'Texnologiya', icon: '💻', dealsCount: 124, order: 4, description: locale === 'ru' ? 'Гаджеты, ПО, аксессуары' : 'Gadjetlar, dasturlar, aksessuarlar' },
    { id: '5', slug: 'fashion', name: locale === 'ru' ? 'Мода' : 'Moda', icon: '👕', dealsCount: 98, order: 5, description: locale === 'ru' ? 'Одежда, обувь, аксессуары' : 'Kiyim, poyafzal, aksessuarlar' },
    { id: '6', slug: 'travel', name: locale === 'ru' ? 'Путешествия' : 'Sayohat', icon: '✈️', dealsCount: 45, order: 6, description: locale === 'ru' ? 'Отели, билеты, туры' : 'Mehmonxonalar, chiptalar, turlar' },
    { id: '7', slug: 'health', name: locale === 'ru' ? 'Здоровье' : 'Salomatlik', icon: '💊', dealsCount: 34, order: 7, description: locale === 'ru' ? 'Фитнес, спорт, медицина' : 'Fitnes, sport, tibbiyot' },
    { id: '8', slug: 'beauty', name: locale === 'ru' ? 'Красота' : 'Go\'zallik', icon: '💄', dealsCount: 56, order: 8, description: locale === 'ru' ? 'Салоны, косметика, уход' : 'Salonlar, kosmetika, parvarish' },
  ];

  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-brand-500 to-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
            {locale === 'ru' ? 'Категории' : 'Kategoriyalar'}
          </h1>
          <p className="text-xl text-brand-50 max-w-2xl">
            {locale === 'ru' 
              ? 'Выберите категорию и найдите лучшие предложения для студентов' 
              : 'Kategoriyani tanlang va talabalar uchun eng yaxshi takliflarni toping'}
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden border border-gray-100 hover:border-brand-200">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-4xl">{category.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.dealsCount} {locale === 'ru' ? 'предложений' : 'taklif'}
                      </p>
                    </div>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-4">
                      {category.description}
                    </p>
                  )}
                  <a
                    href={`/${locale}/categories/${category.slug}`}
                    className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors"
                  >
                    {locale === 'ru' ? 'Смотреть предложения' : 'Takliflarni ko\'rish'}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

