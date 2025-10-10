'use client';

import { useState, useEffect } from 'react';
import { Button } from '@studentdeals/ui';
import { consent } from '@/lib/analytics';

/**
 * Cookie Consent Banner
 * Shows a banner asking for analytics consent
 * Respects Do Not Track
 */
export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has already been given/denied
    const consentStatus = consent.getStatus();
    
    // Check Do Not Track
    const dnt = navigator.doNotTrack || (window as any).doNotTrack || (navigator as any).msDoNotTrack;
    const isDNT = dnt === '1' || dnt === 'yes';
    
    // Show banner only if:
    // - Consent is unknown
    // - Do Not Track is not enabled
    if (consentStatus === 'unknown' && !isDNT) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    consent.grant();
    setShowBanner(false);
    
    // Reload to initialize analytics
    window.location.reload();
  };

  const handleDeny = () => {
    consent.deny();
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-sm text-gray-700">
            <p>
              <strong>Мы используем cookies</strong> для улучшения вашего опыта и анализа использования сайта. 
              Мы уважаем вашу приватность и не передаем данные третьим лицам.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeny}
            >
              Отклонить
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAccept}
            >
              Принять
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

