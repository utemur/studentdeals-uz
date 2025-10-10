import { Container } from '@studentdeals/ui';
import { getMarkdownContent, markdownToHtml } from '@/lib/markdown';

// Enable ISR with 1 hour revalidation (content rarely changes)
export const revalidate = 3600;

interface TermsPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: TermsPageProps) {
  const { locale } = params;
  
  return {
    title: locale === 'ru' ? 'Условия использования - StudentDeals.uz' : 'Foydalanish shartlari - StudentDeals.uz',
    description: locale === 'ru' 
      ? 'Условия использования StudentDeals.uz - правила и требования для пользователей платформы'
      : 'StudentDeals.uz foydalanish shartlari - platforma foydalanuvchilari uchun qoidalar va talablar',
    other: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = params;
  
  // Read markdown content
  const markdown = await getMarkdownContent('legal', 'terms', locale);
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

