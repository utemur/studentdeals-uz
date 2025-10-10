import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// Custom metrics
const errorRate = new Rate('error_rate');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 1 }, // Ramp up to 1 user
    { duration: '1m', target: 1 },  // Stay at 1 user
    { duration: '30s', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.1'],    // Error rate under 10%
    error_rate: ['rate<0.1'],         // Custom error rate under 10%
  },
  ext: {
    loadimpact: {
      name: 'StudentDeals API Smoke Test',
    },
  },
};

// Base URL from environment or default
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export default function () {
  // Test health endpoints
  const healthResponse = http.get(`${BASE_URL}/health`);
  const healthDbResponse = http.get(`${BASE_URL}/health/db`);
  
  // Test auth login endpoint (with invalid credentials to avoid side effects)
  const loginPayload = JSON.stringify({
    email: 'smoke-test@example.com',
    password: 'invalid-password'
  });
  
  const loginResponse = http.post(`${BASE_URL}/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  // Check health endpoints
  const healthCheck = check(healthResponse, {
    'health endpoint status is 200': (r) => r.status === 200,
    'health endpoint response time < 200ms': (r) => r.timings.duration < 200,
    'health endpoint has ok: true': (r) => JSON.parse(r.body).ok === true,
  });

  const healthDbCheck = check(healthDbResponse, {
    'health/db endpoint status is 200': (r) => r.status === 200,
    'health/db endpoint response time < 300ms': (r) => r.timings.duration < 300,
    'health/db endpoint has ok: true': (r) => JSON.parse(r.body).ok === true,
  });

  // Check login endpoint (expecting 401 for invalid credentials)
  const loginCheck = check(loginResponse, {
    'login endpoint status is 401': (r) => r.status === 401,
    'login endpoint response time < 500ms': (r) => r.timings.duration < 500,
    'login endpoint has error message': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.error && (body.error.includes('Invalid credentials') || body.error.includes('error'));
      } catch (e) {
        return false;
      }
    },
  });

  // Record error rate
  errorRate.add(!healthCheck || !healthDbCheck || !loginCheck);

  // Log results for debugging
  console.log(`Health: ${healthResponse.status} (${healthResponse.timings.duration}ms)`);
  console.log(`Health/DB: ${healthDbResponse.status} (${healthDbResponse.timings.duration}ms)`);
  console.log(`Login: ${loginResponse.status} (${loginResponse.timings.duration}ms)`);

  // Think time between requests
  sleep(1);
}

export function handleSummary(data) {
  return {
    'smoke-test-results.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
