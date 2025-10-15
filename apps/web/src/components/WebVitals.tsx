'use client';
import { useEffect } from 'react';
import { initWebVitals } from '@/lib/web-vitals';

export default function WebVitals() {
  useEffect(() => {
    // Wrap in try-catch to prevent any webpack issues
    try {
      initWebVitals((metric) => {
        // GA4
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', metric.name, {
            value: metric.value,
            event_label: metric.id,
            non_interaction: true,
          });
        }
        
        // Sentry (optional)
        if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
          import('@sentry/nextjs').then(({ captureMessage }) => {
            captureMessage(`WebVital ${metric.name}: ${metric.value} (${metric.id})`);
          }).catch(() => {
            // Silently fail if Sentry is not available
          });
        }
      });
    } catch (error) {
      console.warn('WebVitals component initialization failed:', error);
    }
  }, []);
  
  return null;
}