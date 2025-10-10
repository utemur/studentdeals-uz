import { Container } from '@studentdeals/ui';
import { getMarkdownContent, markdownToHtml } from '@/lib/markdown';
import { generateSEOMetadata, pageMetadata } from '@/lib/seo';

// Enable ISR with 1 hour revalidation (content rarely changes)
export const revalidate = 3600;

interface PrivacyPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: PrivacyPageProps) {
  const { locale } = params;
  const metadata = pageMetadata.privacy[locale as 'ru' | 'uz'];
  
  return generateSEOMetadata({
    title: metadata.title,
    description: metadata.description,
    locale,
    path: '/privacy',
  });
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

