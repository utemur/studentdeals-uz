import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'development';
const IS_PRODUCTION = ENVIRONMENT === 'production';

// Sample rates: 10% in production, 100% in development
const TRACES_SAMPLE_RATE = IS_PRODUCTION 
  ? parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1')
  : 1.0;

Sentry.init({
  dsn: SENTRY_DSN,
  
  environment: ENVIRONMENT,

  // Performance Monitoring: 10% in production, 100% in development
  tracesSampleRate: TRACES_SAMPLE_RATE,

  // Debug mode (only in development)
  debug: !IS_PRODUCTION && process.env.SENTRY_DEBUG === 'true',

  // Integrations for server-side tracing
  integrations: [
    // HTTP instrumentation for outgoing requests
    Sentry.httpIntegration({
      tracing: true,
      // Track outgoing HTTP requests
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
    // Filter out development errors
    if (!IS_PRODUCTION && event.level === 'warning') {
      return null;
    }
    return event;
  },

  // Transaction naming and filtering
  beforeSendTransaction(event) {
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

