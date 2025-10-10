import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://studentdeals.uz';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/ru/',
          '/uz/',
          '/ru/privacy',
          '/uz/privacy',
          '/ru/terms',
          '/uz/terms',
        ],
        disallow: [
          '/api/',
          '/_next/',
          '/dashboard',
          '/signin',
          '/signup',
          '/verify',
          '/admin',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Yandexbot',
        allow: '/',
        crawlDelay: 0,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

