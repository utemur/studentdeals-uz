import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { prismaIntegration } from '@sentry/nestjs';

const ENVIRONMENT = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = ENVIRONMENT === 'production';

// Sample rates: 10% in production, 100% in development
const TRACES_SAMPLE_RATE = IS_PRODUCTION 
  ? parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1')
  : 1.0;

const PROFILES_SAMPLE_RATE = IS_PRODUCTION 
  ? parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE || '0.1')
  : 1.0;

// Ensure to call this before requiring any other modules!
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: ENVIRONMENT,
  
  // Release tracking (optional, set via CI/CD)
  release: process.env.SENTRY_RELEASE,

  integrations: [
    // Node.js Profiling integration
    nodeProfilingIntegration(),
    
    // Prisma integration for database query tracing
    prismaIntegration({
      // Track Prisma queries
      // This will create spans for each Prisma query
    }),
    
    // HTTP integration for incoming/outgoing requests
    Sentry.httpIntegration(),
    
    // NestJS-specific integrations are automatically added by @sentry/nestjs
  ],

  // Performance Monitoring: 10% in production, 100% in development
  tracesSampleRate: TRACES_SAMPLE_RATE,

  // Profiling: 10% in production, 100% in development
  // This is relative to tracesSampleRate
  profilesSampleRate: PROFILES_SAMPLE_RATE,

  // Enable debug mode in development
  debug: !IS_PRODUCTION && process.env.SENTRY_DEBUG === 'true',

  // Ignore specific errors
  ignoreErrors: [
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',
    'ECONNRESET',
    'P2002', // Prisma unique constraint violation
  ],

  // Before sending events
  beforeSend(event, hint) {
    // Filter out development warnings
    if (!IS_PRODUCTION && event.level === 'warning') {
      return null;
    }

    // Add custom context
    if (event.request) {
      // Remove sensitive headers
      if (event.request.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }
    }

    return event;
  },

  // Transaction naming and filtering
  beforeSendTransaction(event) {
    // Don't send transactions for health checks
    if (event.transaction?.includes('/health')) {
      return null;
    }

    // Don't send transactions for OPTIONS requests
    if (event.request?.method === 'OPTIONS') {
      return null;
    }

    return event;
  },

  // Custom tags
  initialScope: {
    tags: {
      service: 'api',
      runtime: 'nodejs',
    },
  },
});

