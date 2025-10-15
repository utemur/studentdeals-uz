// Server-side analytics helpers
// These functions are safe to use in RSC components

export function trackPageView(url: string) {
  // Server-side tracking is not implemented
  // This is a no-op for server components
  console.log('[Analytics Server] Page view:', url);
}

export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  // Server-side tracking is not implemented
  // This is a no-op for server components
  console.log('[Analytics Server] Event:', eventName, eventParams);
}

// Server-side analytics helpers
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
      page_path: page || '',
      timestamp: new Date().toISOString(),
    });
  },

  apiError: (endpoint: string, statusCode: number, errorMessage?: string) => {
    trackEvent('api_error', {
      endpoint,
      status_code: statusCode,
      error_message: errorMessage,
      page_path: '',
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
