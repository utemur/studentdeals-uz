import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beta Feedback | StudentDeals.uz',
  description: 'Share your feedback and help us improve StudentDeals.uz',
  robots: 'noindex, nofollow', // Don't index beta page
};

export default function BetaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

