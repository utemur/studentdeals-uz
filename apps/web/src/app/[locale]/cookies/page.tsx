import { Container } from '@studentdeals/ui';
import { getMarkdownContent, markdownToHtml } from '@/lib/markdown';
import { generateSEOMetadata } from '@/lib/seo';

// Enable ISR with 1 hour revalidation (content rarely changes)
export const revalidate = 3600;

interface CookiesPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: CookiesPageProps) {
  const { locale } = params;
  
  const metadata = {
    ru: {
      title: 'Политика использования cookies',
      description: 'Политика использования cookies StudentDeals.uz - какие cookies мы используем и как ими управлять',
    },
    uz: {
      title: 'Cookie fayllaridan foydalanish siyosati',
      description: 'StudentDeals.uz cookie fayllaridan foydalanish siyosati - qanday cookie fayllardan foydalanamiz va ularni qanday boshqarish mumkin',
    },
  };

  const text = metadata[locale as 'ru' | 'uz'];
  
  return generateSEOMetadata({
    title: text.title,
    description: text.description,
    locale,
    path: '/cookies',
  });
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const { locale } = params;
  
  // Read markdown content
  const markdown = await getMarkdownContent('legal', 'cookies', locale);
  const html = markdownToHtml(markdown);
  
  return (
    <Container className="py-12 max-w-4xl">
      <article 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Container>
  );
}

