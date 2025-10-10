'use client';

import { useState, useEffect } from 'react';
import { consent as consentManager } from '@/lib/analytics';

type ConsentStatus = 'granted' | 'denied' | 'unknown';

/**
 * Hook for managing analytics consent
 * 
 * Usage:
 * const { status, grant, deny } = useConsent();
 */
export function useConsent() {
  const [status, setStatus] = useState<ConsentStatus>('unknown');

  useEffect(() => {
    // Get initial consent status
    const initialStatus = consentManager.getStatus();
    setStatus(initialStatus);

    // Listen for storage changes (if user changes consent in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'analytics_consent') {
        const newStatus = (e.newValue as ConsentStatus) || 'unknown';
        setStatus(newStatus);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const grant = () => {
    consentManager.grant();
    setStatus('granted');
  };

  const deny = () => {
    consentManager.deny();
    setStatus('denied');
  };

  const reset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('analytics_consent');
      setStatus('unknown');
    }
  };

  return {
    status,
    grant,
    deny,
    reset,
    isGranted: status === 'granted',
    isDenied: status === 'denied',
    isUnknown: status === 'unknown',
  };
}

