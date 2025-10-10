import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://studentdeals.uz';

interface SEOConfig {
  title: string;
  description: string;
  locale: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Generate SEO metadata with OpenGraph, Twitter Card, and hreflang
 */
export function generateSEOMetadata({
  title,
  description,
  locale,
  path = '',
  image,
  noIndex = false,
}: SEOConfig): Metadata {
  const fullTitle = `${title} | StudentDeals.uz`;
  const canonicalUrl = `${BASE_URL}/${locale}${path}`;
  const ogImage = image || `${BASE_URL}/images/og-default.jpg`;

  // Alternate languages
  const alternateLanguages: Record<string, string> = {
    ru: `${BASE_URL}/ru${path}`,
    uz: `${BASE_URL}/uz${path}`,
  };

  return {
    title: fullTitle,
    description,
    
    // Basic metadata
    applicationName: 'StudentDeals.uz',
    authors: [{ name: 'StudentDeals.uz Team' }],
    generator: 'Next.js',
    keywords: locale === 'ru' 
      ? ['студенческие скидки', 'скидки для студентов', 'студенческие предложения', 'Узбекистан', 'StudentDeals']
      : ['talabalar uchun chegirmalar', 'talaba takliflari', 'O\'zbekiston', 'StudentDeals'],
    
    // Robots
    robots: noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },

    // OpenGraph
    openGraph: {
      type: 'website',
      locale: locale === 'ru' ? 'ru_RU' : 'uz_UZ',
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: 'StudentDeals.uz',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@studentdealsuz',
      site: '@studentdealsuz',
    },

    // Additional metadata
    other: {
      'og:locale:alternate': locale === 'ru' ? 'uz_UZ' : 'ru_RU',
    },
  };
}

/**
 * Get localized page metadata
 */
export const pageMetadata = {
  home: {
    ru: {
      title: 'Лучшие предложения для студентов',
      description: 'Находите эксклюзивные скидки и предложения от местных и международных брендов специально для студентов Узбекистана',
    },
    uz: {
      title: 'Talabalar uchun eng yaxshi takliflar',
      description: 'O\'zbekiston talabalari uchun maxsus mahalliy va xalqaro brendlardan eksklyuziv chegirmalar va takliflarni toping',
    },
  },
  privacy: {
    ru: {
      title: 'Политика конфиденциальности',
      description: 'Политика конфиденциальности StudentDeals.uz - как мы собираем, используем и защищаем ваши данные',
    },
    uz: {
      title: 'Maxfiylik siyosati',
      description: 'StudentDeals.uz maxfiylik siyosati - ma\'lumotlaringizni qanday yig\'amiz, ishlatamiz va himoya qilamiz',
    },
  },
  terms: {
    ru: {
      title: 'Условия использования',
      description: 'Условия использования StudentDeals.uz - правила и требования для пользователей платформы',
    },
    uz: {
      title: 'Foydalanish shartlari',
      description: 'StudentDeals.uz foydalanish shartlari - platforma foydalanuvchilari uchun qoidalar va talablar',
    },
  },
  signin: {
    ru: {
      title: 'Вход в аккаунт',
      description: 'Войдите в свой аккаунт StudentDeals.uz для доступа к эксклюзивным студенческим скидкам',
    },
    uz: {
      title: 'Akkauntga kirish',
      description: 'Eksklyuziv talaba chegirmalariga kirish uchun StudentDeals.uz akkauntingizga kiring',
    },
  },
  signup: {
    ru: {
      title: 'Регистрация',
      description: 'Создайте аккаунт StudentDeals.uz и получите доступ к сотням эксклюзивных скидок для студентов',
    },
    uz: {
      title: 'Ro\'yxatdan o\'tish',
      description: 'StudentDeals.uz akkauntini yarating va yuzlab eksklyuziv talaba chegirmalariga kirish oling',
    },
  },
  dashboard: {
    ru: {
      title: 'Личный кабинет',
      description: 'Управляйте своим профилем, просматривайте сохраненные предложения и отслеживайте использованные скидки',
    },
    uz: {
      title: 'Shaxsiy kabinet',
      description: 'Profilingizni boshqaring, saqlangan takliflarni ko\'ring va ishlatilgan chegirmalarni kuzating',
    },
  },
};

