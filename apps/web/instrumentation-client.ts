// Skip Sentry client initialization in development to avoid webpack issues
if (process.env.NODE_ENV === 'development') {
  console.log('Sentry client instrumentation disabled in development mode');
} else {
  import("@sentry/nextjs").then((Sentry) => {
    const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
    const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'production';
    const IS_PRODUCTION = ENVIRONMENT === 'production';

    // Sample rates: 10% in production
    const TRACES_SAMPLE_RATE = IS_PRODUCTION 
      ? parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || '0.1')
      : 1.0;

    const REPLAYS_SESSION_SAMPLE_RATE = IS_PRODUCTION ? 0.1 : 0.5;
    const REPLAYS_ON_ERROR_SAMPLE_RATE = IS_PRODUCTION ? 1.0 : 1.0;

    Sentry.init({
  dsn: SENTRY_DSN,
  
  environment: ENVIRONMENT,

  // Performance Monitoring: 10% in production, 100% in development
  tracesSampleRate: TRACES_SAMPLE_RATE,

  // Session Replay
  replaysOnErrorSampleRate: REPLAYS_ON_ERROR_SAMPLE_RATE,
  replaysSessionSampleRate: REPLAYS_SESSION_SAMPLE_RATE,

  // Debug mode (only in development)
  debug: !IS_PRODUCTION && process.env.NEXT_PUBLIC_SENTRY_DEBUG === 'true',

  // Integrations
  integrations: [
    // Browser Tracing with Next.js App Router instrumentation
    Sentry.browserTracingIntegration({
      // Trace navigation and route changes
      enableInp: true, // Enable Interaction to Next Paint tracking
      enableLongTask: true, // Track long tasks that block the main thread
    }),
    
    // Session Replay
    Sentry.replayIntegration({
      maskAllText: IS_PRODUCTION,
      blockAllMedia: IS_PRODUCTION,
      // Network details
      networkDetailAllowUrls: [
        // Allow API calls to be recorded
        /^https?:\/\/(api\.)?studentdeals\.uz/,
        /^http:\/\/localhost:3001/,
      ],
      networkCaptureBodies: true,
      networkRequestHeaders: ['X-Request-ID', 'Authorization'],
      networkResponseHeaders: ['X-Request-ID', 'X-Response-Time'],
    }),
  ],

  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    // Network errors
    'NetworkError',
    'Failed to fetch',
  ],

  // Before sending events
  beforeSend(event, hint) {
    // Filter out development errors
    if (!IS_PRODUCTION && event.level === 'warning') {
      return null;
    }
    return event;
  },

      // Transaction naming and filtering
      beforeSendTransaction(event) {
        // Don't send transactions for static assets
        if (event.transaction?.includes('/_next/static/')) {
          return null;
        }
        return event;
      },
    });
  }).catch((error) => {
    console.warn('Sentry client initialization failed:', error);
  });
}
