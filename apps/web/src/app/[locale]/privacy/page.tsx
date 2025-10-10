import { Container } from '@studentdeals/ui';
import { getMarkdownContent, markdownToHtml } from '@/lib/markdown';

// Enable ISR with 1 hour revalidation (content rarely changes)
export const revalidate = 3600;

interface PrivacyPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: PrivacyPageProps) {
  const { locale } = params;
  
  return {
    title: locale === 'ru' ? 'Политика конфиденциальности - StudentDeals.uz' : 'Maxfiylik siyosati - StudentDeals.uz',
    description: locale === 'ru' 
      ? 'Политика конфиденциальности StudentDeals.uz - как мы собираем, используем и защищаем ваши данные'
      : 'StudentDeals.uz maxfiylik siyosati - ma\'lumotlaringizni qanday yig\'amiz, ishlatamiz va himoya qilamiz',
    other: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = params;
  
  // Read markdown content
  const markdown = await getMarkdownContent('legal', 'privacy', locale);
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

