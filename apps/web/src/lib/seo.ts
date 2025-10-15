import type { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
}

export const pageMetadata: Record<string, Record<string, SEOConfig>> = {
  home: {
    ru: {
      title: 'StudentDeals.uz - Лучшие предложения для студентов',
      description: 'Находите эксклюзивные скидки и предложения от местных и международных брендов специально для студентов Узбекистана',
      keywords: ['студенческие скидки', 'скидки для студентов', 'Узбекистан', 'StudentDeals', 'talabalar uchun chegirmalar']
    },
    uz: {
      title: 'StudentDeals.uz - Talabalar uchun eng yaxshi takliflar',
      description: 'O\'zbekiston talabalari uchun mahalliy va xalqaro brendlardan eksklyuziv chegirmalar va takliflarni toping',
      keywords: ['talabalar uchun chegirmalar', 'chegirmalar', 'O\'zbekiston', 'StudentDeals', 'student discounts']
    }
  },
  deals: {
    ru: {
      title: 'Все предложения - StudentDeals.uz',
      description: 'Просматривайте все доступные предложения и скидки для студентов',
      keywords: ['предложения', 'скидки', 'студенты', 'каталог']
    },
    uz: {
      title: 'Barcha takliflar - StudentDeals.uz',
      description: 'Talabalar uchun barcha mavjud takliflar va chegirmalarni ko\'ring',
      keywords: ['takliflar', 'chegirmalar', 'talabalar', 'katalog']
    }
  },
  brands: {
    ru: {
      title: 'Бренды-партнеры - StudentDeals.uz',
      description: 'Ознакомьтесь с нашими партнерскими брендами и их предложениями',
      keywords: ['бренды', 'партнеры', 'компании', 'скидки']
    },
    uz: {
      title: 'Brend hamkorlar - StudentDeals.uz',
      description: 'Bizning hamkor brendlarimiz va ularning takliflarini o\'rganing',
      keywords: ['brendlar', 'hamkorlar', 'kompaniyalar', 'chegirmalar']
    }
  },
  categories: {
    ru: {
      title: 'Категории - StudentDeals.uz',
      description: 'Выберите интересующую вас категорию предложений',
      keywords: ['категории', 'еда', 'развлечения', 'образование', 'технологии']
    },
    uz: {
      title: 'Kategoriyalar - StudentDeals.uz',
      description: 'Sizni qiziqtirgan takliflar kategoriyasini tanlang',
      keywords: ['kategoriyalar', 'ovqat', 'ko\'ngilochar', 'ta\'lim', 'texnologiya']
    }
  }
};

export function generateSEOMetadata({
  title,
  description,
  locale,
  path = '',
  keywords = [],
  image = '/images/og-default.jpg'
}: {
  title: string;
  description: string;
  locale: string;
  path?: string;
  keywords?: string[];
  image?: string;
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://studentdeals.uz';
  const url = `${baseUrl}/${locale}${path}`;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      url,
      siteName: 'StudentDeals.uz',
      locale: locale === 'ru' ? 'ru_RU' : 'uz_UZ',
      type: 'website',
      images: [
        {
          url: `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}${image}`],
    },
    alternates: {
      canonical: url,
      languages: {
        'ru': `${baseUrl}/ru${path}`,
        'uz': `${baseUrl}/uz${path}`,
      },
    },
  };
}