#!/usr/bin/env node

/**
 * Sentry Release Script
 * 
 * Usage:
 *   pnpm release              # Use current commit SHA
 *   pnpm release v1.0.0       # Use specific version
 *   pnpm release --tag        # Use latest git tag
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    }).trim();
  } catch (error) {
    if (!options.silent) {
      log(`✗ Command failed: ${command}`, 'red');
    }
    if (options.throwOnError !== false) {
      throw error;
    }
    return null;
  }
}

async function main() {
  console.log('');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('  🚀 Sentry Release Creation', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  console.log('');

  // Check if sentry-cli is installed
  const hasSentryCli = exec('command -v sentry-cli', { silent: true, throwOnError: false });
  if (!hasSentryCli) {
    log('✗ sentry-cli not found!', 'red');
    console.log('');
    console.log('Install with:');
    console.log('  npm install -g @sentry/cli');
    console.log('');
    process.exit(1);
  }

  // Check if .sentryclirc exists
  const sentryRcPath = path.join(process.cwd(), '.sentryclirc');
  if (!fs.existsSync(sentryRcPath)) {
    log('✗ .sentryclirc not found!', 'red');
    console.log('');
    console.log('Please create .sentryclirc with your Sentry auth token.');
    console.log('See: docs/SENTRY_GITHUB_INTEGRATION.md');
    console.log('');
    process.exit(1);
  }

  // Read Sentry config
  const sentryRc = fs.readFileSync(sentryRcPath, 'utf8');
  const orgMatch = sentryRc.match(/org\s*=\s*(.+)/);
  const projectMatch = sentryRc.match(/project\s*=\s*(.+)/);

  if (!orgMatch || !projectMatch) {
    log('✗ Could not read Sentry org/project from .sentryclirc', 'red');
    process.exit(1);
  }

  const SENTRY_ORG = orgMatch[1].trim();
  const SENTRY_PROJECT = projectMatch[1].trim();

  log(`Organization: ${SENTRY_ORG}`, 'blue');
  log(`Project: ${SENTRY_PROJECT}`, 'blue');
  console.log('');

  // Determine version
  let version = '';
  const args = process.argv.slice(2);

  if (args.length > 0 && args[0] !== '--tag') {
    // Use provided version
    version = args[0];
    log(`Using provided version: ${version}`, 'blue');
  } else if (args.includes('--tag')) {
    // Use latest git tag
    version = exec('git describe --tags --exact-match HEAD', { silent: true, throwOnError: false });
    if (version) {
      log(`Using git tag: ${version}`, 'blue');
    } else {
      log('✗ No git tag found on HEAD', 'red');
      log('Create a tag first: git tag v1.0.0 && git push --tags', 'yellow');
      process.exit(1);
    }
  } else {
    // Use current commit SHA
    version = exec('git rev-parse HEAD', { silent: true });
    log(`Using commit SHA: ${version}`, 'blue');
  }

  console.log('');

  // Create release
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('  Creating Sentry Release', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  console.log('');

  // Step 1: Create release
  log('1/3 Creating release...', 'blue');
  exec(`sentry-cli releases new "${version}" --org "${SENTRY_ORG}" --project "${SENTRY_PROJECT}"`);
  log('✓ Release created', 'green');
  console.log('');

  // Step 2: Associate commits
  log('2/3 Associating commits...', 'blue');
  try {
    exec(`sentry-cli releases set-commits "${version}" --auto --org "${SENTRY_ORG}" --project "${SENTRY_PROJECT}"`);
    log('✓ Commits associated', 'green');
  } catch (error) {
    log('⚠ Warning: Failed to associate commits', 'yellow');
    log('Continuing anyway...', 'yellow');
  }
  console.log('');

  // Step 3: Finalize release
  log('3/3 Finalizing release...', 'blue');
  exec(`sentry-cli releases finalize "${version}" --org "${SENTRY_ORG}" --project "${SENTRY_PROJECT}"`);
  log('✓ Release finalized', 'green');
  console.log('');

  // Optional: Upload source maps
  const webNextDir = path.join(process.cwd(), 'apps/web/.next');
  const apiDistDir = path.join(process.cwd(), 'apps/api/dist');

  if (fs.existsSync(webNextDir)) {
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    log('  Uploading Source Maps (Web)', 'blue');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    console.log('');

    log('Uploading Next.js source maps...', 'blue');
    try {
      exec(`sentry-cli releases files "${version}" upload-sourcemaps apps/web/.next --url-prefix '~/_next' --org "${SENTRY_ORG}" --project "${SENTRY_PROJECT}"`);
      log('✓ Source maps uploaded', 'green');
    } catch (error) {
      log('⚠ Warning: Failed to upload source maps', 'yellow');
    }
    console.log('');
  }

  if (fs.existsSync(apiDistDir)) {
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    log('  Uploading Source Maps (API)', 'blue');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    console.log('');

    log('Uploading API source maps...', 'blue');
    try {
      exec(`sentry-cli releases files "${version}" upload-sourcemaps apps/api/dist --url-prefix '~/dist' --org "${SENTRY_ORG}" --project "${SENTRY_PROJECT}"`);
      log('✓ Source maps uploaded', 'green');
    } catch (error) {
      log('⚠ Warning: Failed to upload source maps', 'yellow');
    }
    console.log('');
  }

  // Output release URL
  const releaseUrl = `https://sentry.io/organizations/${SENTRY_ORG}/releases/${version}/?project=${SENTRY_PROJECT}`;

  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green');
  log('  ✅ Release Created Successfully!', 'green');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green');
  console.log('');
  log(`Release: ${version}`, 'green');
  log(`URL: ${releaseUrl}`, 'green');
  console.log('');

  // Output to file for CI/CD
  const outputFile = path.join(process.cwd(), '.sentry-release');
  fs.writeFileSync(outputFile, JSON.stringify({
    version,
    url: releaseUrl,
    org: SENTRY_ORG,
    project: SENTRY_PROJECT,
    timestamp: new Date().toISOString(),
  }, null, 2));

  log('📝 Release info saved to .sentry-release', 'blue');
  console.log('');
  log('Done! 🎉', 'green');
  console.log('');
}

main().catch((error) => {
  console.error('');
  log(`✗ Error: ${error.message}`, 'red');
  console.error('');
  process.exit(1);
});

