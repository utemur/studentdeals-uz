'use client';

import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB, Metric } from 'web-vitals';
import * as Sentry from '@sentry/nextjs';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Send Web Vitals metrics to API endpoint
 */
async function sendToAPI(metric: Metric) {
  try {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      url: window.location.href,
      timestamp: Date.now(),
    });

    // Send to API (mock endpoint)
    await fetch(`${API_URL}/metrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      // Don't wait for response
      keepalive: true,
    }).catch((error) => {
      console.warn('[Web Vitals] Failed to send to API:', error);
    });
  } catch (error) {
    console.warn('[Web Vitals] Error sending metric:', error);
  }
}

/**
 * Send Web Vitals metrics to Sentry
 */
function sendToSentry(metric: Metric) {
  try {
    // Create a measurement in Sentry
    const measurement = {
      [`web-vitals.${metric.name}`]: {
        value: metric.value,
        unit: metric.name === 'CLS' ? 'ratio' : 'millisecond',
      },
    };

    // Add to current transaction or create a new one
    const transaction = Sentry.getCurrentScope().getTransaction();
    if (transaction) {
      transaction.setMeasurement(metric.name, metric.value, metric.name === 'CLS' ? '' : 'millisecond');
    }

    // Also send as a standalone event
    Sentry.captureMessage(`Web Vital: ${metric.name}`, {
      level: metric.rating === 'good' ? 'info' : metric.rating === 'needs-improvement' ? 'warning' : 'error',
      tags: {
        'web-vital': metric.name,
        'web-vital.rating': metric.rating,
        'web-vital.navigation-type': metric.navigationType,
      },
      contexts: {
        'web-vitals': {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
        },
      },
    });
  } catch (error) {
    console.warn('[Web Vitals] Error sending to Sentry:', error);
  }
}

/**
 * Report Web Vitals metric
 */
function reportMetric(metric: Metric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // Send to API
  sendToAPI(metric);

  // Send to Sentry
  sendToSentry(metric);
}

/**
 * Initialize Web Vitals reporting
 */
export function initWebVitals() {
  try {
    // Core Web Vitals
    onCLS(reportMetric); // Cumulative Layout Shift
    onFID(reportMetric); // First Input Delay (deprecated, use INP)
    onLCP(reportMetric); // Largest Contentful Paint

    // Additional metrics
    onFCP(reportMetric); // First Contentful Paint
    onINP(reportMetric); // Interaction to Next Paint (new)
    onTTFB(reportMetric); // Time to First Byte

    console.log('[Web Vitals] Reporter initialized');
  } catch (error) {
    console.error('[Web Vitals] Failed to initialize:', error);
  }
}

/**
 * Web Vitals thresholds
 */
export const WEB_VITALS_THRESHOLDS = {
  // Core Web Vitals
  LCP: {
    good: 2500, // < 2.5s
    needsImprovement: 4000, // 2.5s - 4s
    // > 4s is poor
  },
  FID: {
    good: 100, // < 100ms
    needsImprovement: 300, // 100ms - 300ms
    // > 300ms is poor
  },
  CLS: {
    good: 0.1, // < 0.1
    needsImprovement: 0.25, // 0.1 - 0.25
    // > 0.25 is poor
  },
  // Additional metrics
  INP: {
    good: 200, // < 200ms
    needsImprovement: 500, // 200ms - 500ms
    // > 500ms is poor
  },
  FCP: {
    good: 1800, // < 1.8s
    needsImprovement: 3000, // 1.8s - 3s
    // > 3s is poor
  },
  TTFB: {
    good: 800, // < 800ms
    needsImprovement: 1800, // 800ms - 1.8s
    // > 1.8s is poor
  },
};

