import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://studentdeals.uz';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/dashboard',
          '/*?token=*', // Disallow verification/reset links
          '/beta', // Beta page should be noindex
        ],
      },
      {
        userAgent: 'GPTBot', // OpenAI bot
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended', // Google AI training
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
