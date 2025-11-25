'use client';

import { useEffect } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': {
        url: string;
        style?: React.CSSProperties;
        [key: string]: any;
      };
    }
  }
}

interface SplineViewerProps {
  url: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SplineViewer({ url, className, style }: SplineViewerProps) {
  useEffect(() => {
    // Динамически загружаем скрипт spline-viewer
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@splinetool/viewer@1.12.3/build/spline-viewer.js';
    script.type = 'module';
    script.async = true;
    
    // Проверяем, не загружен ли скрипт уже
    const existingScript = document.querySelector(
      'script[src="https://unpkg.com/@splinetool/viewer@1.12.3/build/spline-viewer.js"]'
    );
    
    if (!existingScript) {
      document.head.appendChild(script);
    }

    return () => {
      // Очистка при размонтировании компонента не требуется,
      // так как скрипт должен оставаться для повторного использования
    };
  }, []);

  return (
    <spline-viewer 
      url={url}
      className={className}
      style={style}
    />
  );
}

