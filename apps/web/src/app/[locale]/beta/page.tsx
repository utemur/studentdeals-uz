import { generateSEOMetadata } from '@/lib/seo';
import BetaPageClient from './BetaPageClient';

interface BetaPageProps {
  params: {
    locale: string;
  };
}

// Generate SEO metadata
export async function generateMetadata({ params }: BetaPageProps) {
  const { locale } = params;
  
  return generateSEOMetadata({
    title: locale === 'ru' 
      ? 'Бета-версия | StudentDeals.uz' 
      : 'Beta versiya | StudentDeals.uz',
    description: locale === 'ru'
      ? 'StudentDeals.uz находится в закрытой бета-версии. Оставьте отзыв и помогите нам улучшить платформу!'
      : 'StudentDeals.uz yopiq beta versiyada. Fikr-mulohaza qoldiring va platformani yaxshilashga yordam bering!',
    locale,
    path: '/beta',
  });
}

export default function BetaPage({ params }: BetaPageProps) {
  return <BetaPageClient params={params} />;
}