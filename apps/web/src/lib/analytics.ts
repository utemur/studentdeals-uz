'use client';

// Google Analytics 4 Integration
// Respects Do Not Track and consent mode

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Check if tracking is allowed
function isTrackingAllowed(): boolean {
  // Check Do Not Track
  if (typeof navigator !== 'undefined') {
    const dnt = navigator.doNotTrack || (window as any).doNotTrack || (navigator as any).msDoNotTrack;
    if (dnt === '1' || dnt === 'yes') {
      console.log('[Analytics] Do Not Track is enabled - tracking disabled');
      return false;
    }
  }

  // Check if GA_ID is configured
  if (!GA_ID) {
    console.log('[Analytics] GA_ID not configured - tracking disabled');
    return false;
  }

  // Check consent (from localStorage or cookie)
  if (typeof window !== 'undefined') {
    const consent = localStorage.getItem('analytics_consent');
    if (consent === 'denied') {
      console.log('[Analytics] User denied consent - tracking disabled');
      return false;
    }
  }

  return true;
}

// Initialize Google Analytics
export function initGA() {
  if (!isTrackingAllowed()) {
    return;
  }

  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_ID, {
    page_path: window.location.pathname,
    anonymize_ip: true, // Anonymize IP addresses
    allow_google_signals: false, // Disable Google Signals (remarketing)
    allow_ad_personalization_signals: false, // Disable ad personalization
  });

  // Set consent mode (default to denied, update based on user choice)
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  console.log('[Analytics] Google Analytics initialized');
}

// Track page view
export function trackPageView(url: string) {
  if (!isTrackingAllowed()) return;

  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_ID, {
      page_path: url,
    });
  }
}

// Generic event tracking
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
) {
  if (!isTrackingAllowed()) return;

  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
    console.log('[Analytics] Event tracked:', eventName, eventParams);
  }
}

// Specific event helpers
export const analytics = {
  // Auth events
  signupStart: (method: 'email' = 'email') => {
    trackEvent('signup_start', {
      method,
      timestamp: new Date().toISOString(),
    });
  },

  signupSuccess: (userId?: string) => {
    trackEvent('signup_success', {
      user_id: userId,
      timestamp: new Date().toISOString(),
    });
  },

  signinSuccess: (userId?: string) => {
    trackEvent('signin_success', {
      user_id: userId,
      timestamp: new Date().toISOString(),
    });
  },

  // Language events
  languageSwitch: (from: string, to: string) => {
    trackEvent('language_switch', {
      from_language: from,
      to_language: to,
      timestamp: new Date().toISOString(),
    });
  },

  // Error events
  errorToast: (message: string, page?: string) => {
    trackEvent('error_toast', {
      error_message: message,
      page_path: page || window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  },

  apiError: (endpoint: string, statusCode: number, errorMessage?: string) => {
    trackEvent('api_error', {
      endpoint,
      status_code: statusCode,
      error_message: errorMessage,
      page_path: window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  },

  // User engagement events
  dealView: (dealId: string, dealTitle: string) => {
    trackEvent('deal_view', {
      deal_id: dealId,
      deal_title: dealTitle,
      timestamp: new Date().toISOString(),
    });
  },

  dealClick: (dealId: string, dealTitle: string) => {
    trackEvent('deal_click', {
      deal_id: dealId,
      deal_title: dealTitle,
      timestamp: new Date().toISOString(),
    });
  },

  search: (query: string, resultsCount: number) => {
    trackEvent('search', {
      search_term: query,
      results_count: resultsCount,
      timestamp: new Date().toISOString(),
    });
  },
};

// Consent management
export const consent = {
  // Grant consent
  grant: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics_consent', 'granted');
      
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      }
      
      console.log('[Analytics] Consent granted');
    }
  },

  // Deny consent
  deny: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics_consent', 'denied');
      
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
      
      console.log('[Analytics] Consent denied');
    }
  },

  // Check consent status
  getStatus: (): 'granted' | 'denied' | 'unknown' => {
    if (typeof window !== 'undefined') {
      const status = localStorage.getItem('analytics_consent');
      return (status as 'granted' | 'denied') || 'unknown';
    }
    return 'unknown';
  },
};

