'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initGA, trackPageView } from '@/lib/analytics';

/**
 * Analytics Component
 * Initializes Google Analytics and tracks page views
 */
function AnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize GA on mount
  useEffect(() => {
    try {
      initGA();
    } catch (error) {
      console.warn('[Analytics] Failed to initialize:', error);
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    try {
      if (pathname) {
        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
        trackPageView(url);
      }
    } catch (error) {
      console.warn('[Analytics] Failed to track page view:', error);
    }
  }, [pathname, searchParams]);

  return null;
}

export function Analytics() {
  // Skip analytics in development to avoid webpack issues
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
}

