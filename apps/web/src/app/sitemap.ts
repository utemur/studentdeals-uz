import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://studentdeals.uz';
  const lastModified = new Date();

  // Available locales
  const locales = ['ru', 'uz'];

  // Public pages to include in sitemap
  const pages = [
    { url: '', priority: 1.0, changeFrequency: 'daily' as const },
    { url: 'about', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: 'signin', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: 'signup', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: 'privacy', priority: 0.5, changeFrequency: 'monthly' as const },
    { url: 'terms', priority: 0.5, changeFrequency: 'monthly' as const },
    { url: 'cookies', priority: 0.5, changeFrequency: 'monthly' as const },
  ];

  // Generate sitemap entries for all locales
  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    pages.forEach((page) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page.url ? `/${page.url}` : ''}`,
        lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    });
  });

  return sitemapEntries;
}
