#!/usr/bin/env node

/**
 * Bundle Size Checker
 * 
 * Checks if the Next.js bundle size exceeds defined budgets
 * Fails CI if first load JS exceeds 200KB
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BUILD_DIR = path.join(__dirname, '../.next');
const MAX_FIRST_LOAD_JS = 200 * 1024; // 200KB in bytes

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Parse Next.js build manifest
 */
function parseBuildManifest() {
  const manifestPath = path.join(BUILD_DIR, 'build-manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.error(`${colors.red}✗ Build manifest not found. Run 'npm run build' first.${colors.reset}`);
    process.exit(1);
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    return manifest;
  } catch (error) {
    console.error(`${colors.red}✗ Failed to parse build manifest:${colors.reset}`, error.message);
    process.exit(1);
  }
}

/**
 * Calculate file sizes
 */
function calculateSizes() {
  const manifest = parseBuildManifest();
  const pages = manifest.pages || {};
  
  const pageSizes = {};
  
  for (const [route, files] of Object.entries(pages)) {
    let totalSize = 0;
    
    for (const file of files) {
      const filePath = path.join(BUILD_DIR, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      }
    }
    
    pageSizes[route] = totalSize;
  }
  
  return pageSizes;
}

/**
 * Main function
 */
function main() {
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.cyan}  Bundle Size Check${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  console.log(`${colors.blue}📦 Analyzing bundle sizes...${colors.reset}\n`);

  const pageSizes = calculateSizes();
  
  let hasErrors = false;
  let largestPage = null;
  let largestSize = 0;

  // Check each page
  for (const [route, size] of Object.entries(pageSizes)) {
    const sizeFormatted = formatBytes(size);
    const isOverBudget = size > MAX_FIRST_LOAD_JS;
    
    if (size > largestSize) {
      largestSize = size;
      largestPage = route;
    }

    if (isOverBudget) {
      hasErrors = true;
      const overBy = formatBytes(size - MAX_FIRST_LOAD_JS);
      console.log(`  ${colors.red}✗ ${route}${colors.reset}`);
      console.log(`    Size: ${colors.red}${sizeFormatted}${colors.reset} (over budget by ${overBy})`);
    } else {
      const percentage = Math.round((size / MAX_FIRST_LOAD_JS) * 100);
      const color = percentage > 80 ? colors.yellow : colors.green;
      console.log(`  ${color}✓ ${route}${colors.reset}`);
      console.log(`    Size: ${color}${sizeFormatted}${colors.reset} (${percentage}% of budget)`);
    }
  }

  console.log();
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.cyan}  Summary${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  console.log(`  Budget: ${formatBytes(MAX_FIRST_LOAD_JS)}`);
  console.log(`  Largest page: ${largestPage}`);
  console.log(`  Largest size: ${formatBytes(largestSize)}`);
  console.log(`  Pages checked: ${Object.keys(pageSizes).length}`);
  console.log();

  if (hasErrors) {
    console.log(`${colors.red}✗ Bundle size check failed!${colors.reset}`);
    console.log(`${colors.red}  Some pages exceed the 200KB budget.${colors.reset}`);
    console.log(`${colors.yellow}  Run 'npm run build:analyze' to see what's taking up space.${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}✓ Bundle size check passed!${colors.reset}`);
    console.log(`${colors.green}  All pages are within budget.${colors.reset}\n`);
    process.exit(0);
  }
}

// Run the script
main();

