import Link from 'next/link';
import { generateSEOMetadata, pageMetadata } from '@/lib/seo';
import { SearchBar } from '@/components/design-system/SearchBar';
import { CategoryCard } from '@/components/design-system/CategoryCard';
import { DealCard, DealCardSkeleton } from '@/components/design-system/DealCard';
import { Category, Offer } from '@/types';

// Enable ISR with 60 second revalidation
export const revalidate = 60;

interface HomePageProps {
  params: {
    locale: string;
  };
}

// Generate SEO metadata
export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = params;
  const metadata = pageMetadata.home[locale as 'ru' | 'uz'];
  
  if (!metadata) {
    return generateSEOMetadata({
      title: 'StudentDeals.uz - Лучшие предложения для студентов',
      description: 'Находите эксклюзивные скидки и предложения для студентов Узбекистана',
      locale,
      path: '',
    });
  }
  
  return generateSEOMetadata({
    title: metadata.title,
    description: metadata.description,
    locale,
    path: '',
  });
}

// Mock data - will be replaced with API calls
const mockCategories: Category[] = [
  { id: '1', slug: 'food', name: 'Еда и напитки', icon: '🍔', dealsCount: 150, order: 1 },
  { id: '2', slug: 'entertainment', name: 'Развлечения', icon: '🎬', dealsCount: 89, order: 2 },
  { id: '3', slug: 'education', name: 'Образование', icon: '📚', dealsCount: 67, order: 3 },
  { id: '4', slug: 'technology', name: 'Технологии', icon: '💻', dealsCount: 124, order: 4 },
  { id: '5', slug: 'fashion', name: 'Мода', icon: '👕', dealsCount: 98, order: 5 },
  { id: '6', slug: 'travel', name: 'Путешествия', icon: '✈️', dealsCount: 45, order: 6 },
];

export default function HomePage({ params }: HomePageProps) {
  const { locale } = params;

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="text-center text-white max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                {locale === 'ru' ? '10,000+ студентов уже экономят' : '10,000+ talaba tejayapti'}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-slide-up">
              {locale === 'ru' 
                ? 'Эксклюзивные скидки для студентов' 
                : 'Talabalar uchun eksklyuziv chegirmalar'}
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl mb-8 text-brand-50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {locale === 'ru' 
                ? 'Экономьте до 70% в лучших заведениях Узбекистана' 
                : 'O\'zbekistonning eng yaxshi joylarida 70% gacha tejang'}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <SearchBar 
                locale={locale}
                placeholder={locale === 'ru' 
                  ? 'Поиск скидок, брендов, категорий...' 
                  : 'Chegirmalar, brendlar, kategoriyalarni qidirish...'}
              />
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1">500+</div>
                <div className="text-sm text-brand-100">
                  {locale === 'ru' ? 'Брендов' : 'Brendlar'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1">1,200+</div>
                <div className="text-sm text-brand-100">
                  {locale === 'ru' ? 'Предложений' : 'Takliflar'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1">70%</div>
                <div className="text-sm text-brand-100">
                  {locale === 'ru' ? 'Макс. скидка' : 'Maks. chegirma'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              {locale === 'ru' ? 'Популярные категории' : 'Mashhur kategoriyalar'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === 'ru' 
                ? 'Найдите скидки в категориях, которые вам интересны' 
                : 'Sizni qiziqtirgan kategoriyalarda chegirmalarni toping'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {mockCategories.map((category) => (
              <CategoryCard key={category.id} category={category} locale={locale} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href={`/${locale}/categories`}
              className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium transition-colors"
            >
              {locale === 'ru' ? 'Все категории' : 'Barcha kategoriyalar'}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                {locale === 'ru' ? 'Горячие предложения' : 'Issiq takliflar'}
              </h2>
              <p className="text-lg text-gray-600">
                {locale === 'ru' ? 'Лучшие скидки этой недели' : 'Bu haftaning eng yaxshi takliflari'}
              </p>
            </div>
            <Link
              href={`/${locale}/deals`}
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors font-medium shadow-soft hover:shadow-medium"
            >
              {locale === 'ru' ? 'Все предложения' : 'Barcha takliflar'}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Deals Grid - Placeholder for now */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <DealCardSkeleton key={i} />
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="text-center mt-8 md:hidden">
            <Link
              href={`/${locale}/deals`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors font-medium shadow-soft"
            >
              {locale === 'ru' ? 'Все предложения' : 'Barcha takliflar'}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              {locale === 'ru' ? 'Как это работает?' : 'Qanday ishlaydi?'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === 'ru' 
                ? 'Всего 3 простых шага до экономии' 
                : 'Tejashgacha atigi 3 ta oddiy qadam'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-soft p-8 text-center hover:shadow-medium transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {locale === 'ru' ? 'Регистрация' : 'Ro\'yxatdan o\'tish'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'ru' 
                    ? 'Создайте бесплатный аккаунт и подтвердите свой студенческий статус' 
                    : 'Bepul akkaunt yarating va talaba maqomingizni tasdiqlang'}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-soft p-8 text-center hover:shadow-medium transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {locale === 'ru' ? 'Найдите скидку' : 'Chegirmani toping'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'ru' 
                    ? 'Ищите предложения по категориям, брендам или используйте поиск' 
                    : 'Kategoriyalar, brendlar bo\'yicha yoki qidiruvdan foydalaning'}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-soft p-8 text-center hover:shadow-medium transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {locale === 'ru' ? 'Экономьте!' : 'Tejang!'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'ru' 
                    ? 'Покажите QR-код или промокод и получите скидку' 
                    : 'QR-kod yoki promokodni ko\'rsating va chegirmani oling'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              {locale === 'ru' ? 'Популярные категории' : 'Mashhur kategoriyalar'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === 'ru' 
                ? 'Найдите скидки в категориях, которые вам интересны' 
                : 'Sizni qiziqtirgan kategoriyalarda chegirmalarni toping'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {mockCategories.map((category) => (
              <CategoryCard key={category.id} category={category} locale={locale} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href={`/${locale}/categories`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-brand-500 text-brand-600 rounded-xl hover:bg-brand-50 transition-all duration-200 font-medium shadow-soft hover:shadow-medium"
            >
              {locale === 'ru' ? 'Все категории' : 'Barcha kategoriyalar'}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-brand-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
            {locale === 'ru' ? 'Готовы начать экономить?' : 'Tejashni boshlashga tayyormisiz?'}
          </h2>
          <p className="text-xl text-brand-50 mb-8">
            {locale === 'ru' 
              ? 'Присоединяйтесь к тысячам студентов, которые уже экономят с нами!' 
              : 'Biz bilan tejayotgan minglab talabalarga qo\'shiling!'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/signup`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-600 rounded-xl hover:bg-brand-50 transition-all duration-200 font-bold text-lg shadow-hard hover:shadow-medium"
            >
              {locale === 'ru' ? 'Зарегистрироваться бесплатно' : 'Bepul ro\'yxatdan o\'tish'}
            </Link>
            <Link
              href={`/${locale}/deals`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white hover:text-brand-600 transition-all duration-200 font-bold text-lg"
            >
              {locale === 'ru' ? 'Смотреть предложения' : 'Takliflarni ko\'rish'}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              {locale === 'ru' ? 'Почему StudentDeals.uz?' : 'Nega StudentDeals.uz?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {locale === 'ru' ? 'Проверенные предложения' : 'Tekshirilgan takliflar'}
              </h3>
              <p className="text-gray-600">
                {locale === 'ru' 
                  ? 'Все скидки проверены нашей командой перед публикацией' 
                  : 'Barcha chegirmalar nashr etilishidan oldin tekshiriladi'}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {locale === 'ru' ? 'Экономия времени' : 'Vaqtni tejash'}
              </h3>
              <p className="text-gray-600">
                {locale === 'ru' 
                  ? 'Все лучшие предложения в одном месте - не нужно искать по всему интернету' 
                  : 'Barcha eng yaxshi takliflar bir joyda - butun internetda qidirishga hojat yo\'q'}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {locale === 'ru' ? 'Сообщество' : 'Jamiyat'}
              </h3>
              <p className="text-gray-600">
                {locale === 'ru' 
                  ? 'Присоединяйтесь к 10,000+ студентов, которые уже экономят' 
                  : '10,000+ tejayotgan talabalarga qo\'shiling'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl shadow-hard p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {locale === 'ru' ? 'Начните экономить сегодня!' : 'Bugun tejashni boshlang!'}
            </h2>
            <p className="text-lg text-brand-50 mb-8 max-w-2xl mx-auto">
              {locale === 'ru' 
                ? 'Получите доступ к эксклюзивным скидкам от 500+ брендов' 
                : '500+ brendlardan eksklyuziv chegirmalarga kirish huquqini oling'}
            </p>
            <Link
              href={`/${locale}/signup`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-600 rounded-xl hover:bg-brand-50 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105"
            >
              {locale === 'ru' ? 'Зарегистрироваться' : 'Ro\'yxatdan o\'tish'}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

