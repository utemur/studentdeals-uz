import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://studentdeals.uz';
  const locales = ['ru', 'uz'];
  
  // Static pages that should be in sitemap
  const staticPages = [
    '', // homepage
    'privacy',
    'terms',
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // Add homepage with language alternates
  sitemap.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
    alternates: {
      languages: {
        ru: `${baseUrl}/ru`,
        uz: `${baseUrl}/uz`,
      },
    },
  });

  // Add localized static pages
  for (const locale of locales) {
    for (const page of staticPages) {
      const url = page ? `${baseUrl}/${locale}/${page}` : `${baseUrl}/${locale}`;
      
      // Determine priority and change frequency
      let priority = 0.8;
      let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly';
      
      if (page === '') {
        // Homepage
        priority = 1.0;
        changeFrequency = 'daily';
      } else if (page === 'privacy' || page === 'terms') {
        // Legal pages
        priority = 0.5;
        changeFrequency = 'monthly';
      }

      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: {
          languages: {
            ru: page ? `${baseUrl}/ru/${page}` : `${baseUrl}/ru`,
            uz: page ? `${baseUrl}/uz/${page}` : `${baseUrl}/uz`,
          },
        },
      });
    }
  }

  return sitemap;
}

