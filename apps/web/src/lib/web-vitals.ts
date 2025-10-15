// никакого top-level импорта web-vitals!
export type OnPerfEntry = (metric: { id: string; name: string; value: number; rating?: string }) => void;

export async function initWebVitals(onPerfEntry?: OnPerfEntry) {
  if (typeof window === 'undefined' || !onPerfEntry) return;
  
  // Skip web vitals in development to avoid webpack issues
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals disabled in development mode');
    return;
  }
  
  try {
    // Use dynamic import with error handling
    const webVitals = await import('web-vitals');
    
    if (webVitals.onCLS) webVitals.onCLS(onPerfEntry);
    if (webVitals.onFID) webVitals.onFID(onPerfEntry);
    if (webVitals.onFCP) webVitals.onFCP(onPerfEntry);
    if (webVitals.onLCP) webVitals.onLCP(onPerfEntry);
    if (webVitals.onTTFB) webVitals.onTTFB(onPerfEntry);
    if (webVitals.onINP) webVitals.onINP(onPerfEntry);
  } catch (error) {
    console.warn('Web Vitals initialization failed:', error);
  }
}