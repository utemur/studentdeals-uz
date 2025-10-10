import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// Custom metrics
const errorRate = new Rate('error_rate');
const authDuration = new Trend('auth_duration');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 },  // Ramp up to 10 users over 2 minutes
    { duration: '5m', target: 10 }, // Stay at 10 users for 5 minutes
    { duration: '2m', target: 20 }, // Ramp up to 20 users over 2 minutes
    { duration: '5m', target: 20 }, // Stay at 20 users for 5 minutes
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests under 1s
    http_req_failed: ['rate<0.05'],    // Error rate under 5%
    error_rate: ['rate<0.05'],         // Custom error rate under 5%
    auth_duration: ['p(95)<800'],      // 95% of auth operations under 800ms
  },
  ext: {
    loadimpact: {
      name: 'StudentDeals Auth Load Test',
    },
  },
};

// Base URL from environment or default
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

// Test data
const testUsers = [
  { email: 'test1@example.com', password: 'password123' },
  { email: 'test2@example.com', password: 'password123' },
  { email: 'test3@example.com', password: 'password123' },
  { email: 'test4@example.com', password: 'password123' },
  { email: 'test5@example.com', password: 'password123' },
];

export default function () {
  const user = testUsers[Math.floor(Math.random() * testUsers.length)];
  const startTime = Date.now();

  // Test 1: Health check
  const healthResponse = http.get(`${BASE_URL}/health`);
  const healthCheck = check(healthResponse, {
    'health endpoint is up': (r) => r.status === 200,
  });

  // Test 2: Register new user (with random email to avoid conflicts)
  const randomEmail = `loadtest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;
  const registerPayload = JSON.stringify({
    email: randomEmail,
    password: 'password123'
  });

  const registerResponse = http.post(`${BASE_URL}/auth/register`, registerPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  const registerCheck = check(registerResponse, {
    'register endpoint responds': (r) => r.status === 200 || r.status === 400, // 400 for existing user is ok
    'register response time < 2s': (r) => r.timings.duration < 2000,
  });

  // Test 3: Login with test user
  const loginPayload = JSON.stringify({
    email: user.email,
    password: user.password
  });

  const loginResponse = http.post(`${BASE_URL}/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  const loginCheck = check(loginResponse, {
    'login endpoint responds': (r) => r.status === 200 || r.status === 401, // 401 for invalid creds is ok
    'login response time < 1s': (r) => r.timings.duration < 1000,
  });

  // Test 4: Get user info (if login was successful)
  let meResponse = null;
  let meCheck = true;

  if (loginResponse.status === 200) {
    const authToken = JSON.parse(loginResponse.body).accessToken;
    meResponse = http.get(`${BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    meCheck = check(meResponse, {
      'me endpoint responds': (r) => r.status === 200,
      'me response time < 500ms': (r) => r.timings.duration < 500,
    });
  }

  // Test 5: Verify email (with mock token)
  const verifyResponse = http.get(`${BASE_URL}/auth/verify?token=mock-verification-token`);
  const verifyCheck = check(verifyResponse, {
    'verify endpoint responds': (r) => r.status === 200 || r.status === 400, // 400 for invalid token is ok
    'verify response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Calculate total auth duration
  const totalDuration = Date.now() - startTime;
  authDuration.add(totalDuration);

  // Record error rate
  const hasErrors = !healthCheck || !registerCheck || !loginCheck || !meCheck || !verifyCheck;
  errorRate.add(hasErrors);

  // Log results for debugging
  console.log(`User: ${user.email}`);
  console.log(`Health: ${healthResponse.status} (${healthResponse.timings.duration}ms)`);
  console.log(`Register: ${registerResponse.status} (${registerResponse.timings.duration}ms)`);
  console.log(`Login: ${loginResponse.status} (${loginResponse.timings.duration}ms)`);
  if (meResponse) {
    console.log(`Me: ${meResponse.status} (${meResponse.timings.duration}ms)`);
  }
  console.log(`Verify: ${verifyResponse.status} (${verifyResponse.timings.duration}ms)`);
  console.log(`Total Auth Duration: ${totalDuration}ms`);

  // Think time between requests (simulate user behavior)
  sleep(Math.random() * 2 + 1); // Random sleep between 1-3 seconds
}

export function handleSummary(data) {
  return {
    'auth-load-test-results.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
