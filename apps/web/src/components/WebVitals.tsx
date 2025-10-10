'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/web-vitals';

/**
 * Web Vitals Component
 * Initializes Web Vitals reporting on mount
 */
export function WebVitals() {
  useEffect(() => {
    initWebVitals();
  }, []);

  return null;
}

