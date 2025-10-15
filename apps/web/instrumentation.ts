export async function register() {
  // Skip Sentry initialization in development to avoid webpack issues
  if (process.env.NODE_ENV === 'development') {
    console.log('Sentry instrumentation disabled in development mode');
    return;
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      // Server-side Sentry initialization
      const { init } = await import('@sentry/nextjs');
      
      init({
        dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'production',
        tracesSampleRate: 0.1,
        debug: false,
        
        // Server-side integrations
        integrations: [
          // HTTP instrumentation for outgoing requests
          (await import('@sentry/nextjs')).httpIntegration({
            breadcrumbs: true,
          }),
        ],
        
        // Ignore specific errors
        ignoreErrors: [
          'ECONNREFUSED',
          'ENOTFOUND',
          'ETIMEDOUT',
        ],
        
        // Before sending events
        beforeSend(event, hint) {
          // Don't send transactions for health checks
          if (event.transaction?.includes('/health')) {
            return null;
          }
          // Don't send transactions for static assets
          if (event.transaction?.includes('/_next/static/')) {
            return null;
          }
          return event;
        },
      });
    } catch (error) {
      console.warn('Sentry server initialization failed:', error);
    }
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    try {
      // Edge runtime Sentry initialization
      const { init } = await import('@sentry/nextjs');
      
      init({
        dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'production',
        tracesSampleRate: 0.1,
        debug: false,
        
        // Before sending events
        beforeSend(event, hint) {
          // Don't send transactions for health checks
          if (event.transaction?.includes('/health')) {
            return null;
          }
          return event;
        },
      });
    } catch (error) {
      console.warn('Sentry edge initialization failed:', error);
    }
  }
}
