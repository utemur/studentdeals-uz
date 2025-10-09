#!/usr/bin/env node

/**
 * Security Headers Checker
 * Validates that all required security headers are present
 */

const https = require('https');
const http = require('http');

const REQUIRED_HEADERS = [
  'content-security-policy',
  'referrer-policy',
  'x-content-type-options',
  'x-frame-options',
  'permissions-policy',
  'cross-origin-opener-policy',
  'cross-origin-resource-policy',
];

const PROD_ONLY_HEADERS = [
  'strict-transport-security',
];

async function checkHeaders(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      const headers = {};
      for (const [key, value] of Object.entries(res.headers)) {
        headers[key.toLowerCase()] = value;
      }
      resolve(headers);
    }).on('error', reject);
  });
}

async function main() {
  const url = process.env.CHECK_URL || 'http://localhost:3000';
  const isProd = url.startsWith('https://');
  
  console.log(`🔍 Checking security headers for: ${url}\n`);
  
  try {
    const headers = await checkHeaders(url);
    
    let passed = 0;
    let failed = 0;
    
    // Check required headers
    for (const header of REQUIRED_HEADERS) {
      if (headers[header]) {
        console.log(`✅ ${header}: ${headers[header].substring(0, 60)}...`);
        passed++;
      } else {
        console.log(`❌ ${header}: MISSING`);
        failed++;
      }
    }
    
    // Check prod-only headers
    if (isProd) {
      for (const header of PROD_ONLY_HEADERS) {
        if (headers[header]) {
          console.log(`✅ ${header}: ${headers[header]}`);
          passed++;
        } else {
          console.log(`❌ ${header}: MISSING (required in production)`);
          failed++;
        }
      }
    }
    
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
    
    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error checking headers: ${error.message}`);
    process.exit(1);
  }
}

main();

