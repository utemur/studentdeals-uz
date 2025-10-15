'use client';

import { useEffect } from 'react';

/**
 * Axe Accessibility Checker
 * Only runs in development mode to check for accessibility issues
 */
export function AxeAccessibility() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Dynamically import axe-core to avoid including it in production bundle
    const initAxe = async () => {
      try {
        const [axe, React, ReactDOM] = await Promise.all([
          import('@axe-core/react'),
          import('react'),
          import('react-dom')
        ]);
        
        axe.default(React.default, ReactDOM.default, 1000, {
          // Configuration options
          rules: [
            {
              id: 'color-contrast',
              enabled: true,
            },
            {
              id: 'image-alt',
              enabled: true,
            },
            {
              id: 'label',
              enabled: true,
            },
            {
              id: 'link-name',
              enabled: true,
            },
            {
              id: 'button-name',
              enabled: true,
            },
          ],
        });

        console.log('✅ Axe accessibility checker enabled');
      } catch (error) {
        console.error('Failed to load axe-core:', error);
      }
    };

    initAxe();
  }, []);

  return null;
}

