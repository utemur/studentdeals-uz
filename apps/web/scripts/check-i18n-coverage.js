#!/usr/bin/env node

/**
 * I18n Coverage Checker
 * 
 * This script scans the codebase for translation keys used in the UI
 * and compares them against the translation files (ru.json, uz.json).
 * 
 * It will fail if:
 * - A key is used in the code but missing from translation files
 * - A key exists in one language but not in another
 * - Translation files have different structures
 */

const fs = require('fs');
const path = require('path');

// Configuration
const LOCALES = ['ru', 'uz'];
const MESSAGES_DIR = path.join(__dirname, '../src/messages');
const SRC_DIR = path.join(__dirname, '../src');

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
 * Load translation file
 */
function loadTranslations(locale) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`${colors.red}✗ Failed to load ${locale}.json:${colors.reset}`, error.message);
    process.exit(1);
  }
}

/**
 * Flatten nested object to dot notation
 * Example: { a: { b: { c: 'value' } } } => { 'a.b.c': 'value' }
 */
function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  }
  
  return flattened;
}

/**
 * Extract translation keys from source files
 */
function extractKeysFromCode() {
  const keys = new Set();
  
  // Patterns to match:
  // - t('key')
  // - t("key")
  // - t(`key`)
  // - useTranslations('namespace')
  const patterns = [
    /\bt\(['"`]([^'"`]+)['"`]\)/g,
    /useTranslations\(['"`]([^'"`]+)['"`]\)/g,
  ];
  
  // Patterns to ignore (paths, variables, etc.)
  const ignorePatterns = [
    /^\//, // Starts with / (paths)
    /^\$/, // Starts with $ (variables)
    /^@/, // Starts with @ (imports)
    /\.json$/, // Ends with .json (file paths)
    /\.ts$/, // Ends with .ts (file paths)
    /\.tsx$/, // Ends with .tsx (file paths)
    /\.js$/, // Ends with .js (file paths)
    /^[a-z_]+$/, // Single word lowercase (likely variables)
    /\//,  // Contains slash (likely path)
  ];
  
  function shouldIgnore(key) {
    return ignorePatterns.some(pattern => pattern.test(key));
  }
  
  function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const key = match[1];
        if (!shouldIgnore(key)) {
          keys.add(key);
        }
      }
    }
  }
  
  function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip node_modules, .next, etc.
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
        scanFile(fullPath);
      }
    }
  }
  
  scanDirectory(SRC_DIR);
  return Array.from(keys);
}

/**
 * Compare two sets of keys
 */
function compareKeys(keys1, keys2, label1, label2) {
  const missing = keys1.filter(key => !keys2.includes(key));
  const extra = keys2.filter(key => !keys1.includes(key));
  
  return { missing, extra };
}

/**
 * Main function
 */
function main() {
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.cyan}  I18n Coverage Check${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  
  // Load translations
  console.log(`${colors.blue}📚 Loading translation files...${colors.reset}`);
  const translations = {};
  const flatTranslations = {};
  
  for (const locale of LOCALES) {
    translations[locale] = loadTranslations(locale);
    flatTranslations[locale] = flattenObject(translations[locale]);
    console.log(`  ${colors.green}✓${colors.reset} Loaded ${locale}.json (${Object.keys(flatTranslations[locale]).length} keys)`);
  }
  
  console.log();
  
  // Extract keys from code
  console.log(`${colors.blue}🔍 Scanning source files for translation keys...${colors.reset}`);
  const usedKeys = extractKeysFromCode();
  console.log(`  ${colors.green}✓${colors.reset} Found ${usedKeys.length} unique translation keys in code\n`);
  
  // Check for issues
  let hasErrors = false;
  
  // 1. Check if all locales have the same keys
  console.log(`${colors.blue}🔄 Checking consistency between locales...${colors.reset}`);
  const [firstLocale, ...otherLocales] = LOCALES;
  const firstKeys = Object.keys(flatTranslations[firstLocale]);
  
  for (const locale of otherLocales) {
    const localeKeys = Object.keys(flatTranslations[locale]);
    const { missing, extra } = compareKeys(firstKeys, localeKeys, firstLocale, locale);
    
    if (missing.length > 0) {
      hasErrors = true;
      console.log(`  ${colors.red}✗ Keys in ${firstLocale} but missing in ${locale}:${colors.reset}`);
      missing.forEach(key => console.log(`    - ${key}`));
    }
    
    if (extra.length > 0) {
      hasErrors = true;
      console.log(`  ${colors.red}✗ Keys in ${locale} but missing in ${firstLocale}:${colors.reset}`);
      extra.forEach(key => console.log(`    - ${key}`));
    }
    
    if (missing.length === 0 && extra.length === 0) {
      console.log(`  ${colors.green}✓${colors.reset} ${locale} matches ${firstLocale}`);
    }
  }
  
  console.log();
  
  // 2. Check if all used keys exist in translations
  console.log(`${colors.blue}🔍 Checking if all used keys exist in translations...${colors.reset}`);
  const allTranslationKeys = Object.keys(flatTranslations[firstLocale]);
  const missingInTranslations = usedKeys.filter(key => {
    // Check if key or any parent namespace exists
    return !allTranslationKeys.some(translationKey => 
      translationKey === key || translationKey.startsWith(key + '.')
    );
  });
  
  if (missingInTranslations.length > 0) {
    hasErrors = true;
    console.log(`  ${colors.red}✗ Keys used in code but missing in translations:${colors.reset}`);
    missingInTranslations.forEach(key => console.log(`    - ${key}`));
  } else {
    console.log(`  ${colors.green}✓${colors.reset} All used keys exist in translations`);
  }
  
  console.log();
  
  // 3. Check for unused keys (warning only)
  console.log(`${colors.blue}📊 Checking for unused translation keys...${colors.reset}`);
  const unusedKeys = allTranslationKeys.filter(key => {
    // Check if key or any parent namespace is used
    return !usedKeys.some(usedKey => 
      usedKey === key || key.startsWith(usedKey + '.')
    );
  });
  
  if (unusedKeys.length > 0) {
    console.log(`  ${colors.yellow}⚠ Keys in translations but not used in code (${unusedKeys.length}):${colors.reset}`);
    if (unusedKeys.length <= 10) {
      unusedKeys.forEach(key => console.log(`    - ${key}`));
    } else {
      unusedKeys.slice(0, 10).forEach(key => console.log(`    - ${key}`));
      console.log(`    ... and ${unusedKeys.length - 10} more`);
    }
  } else {
    console.log(`  ${colors.green}✓${colors.reset} No unused translation keys`);
  }
  
  console.log();
  
  // Summary
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.cyan}  Summary${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  
  console.log(`  Locales checked: ${LOCALES.join(', ')}`);
  console.log(`  Translation keys: ${allTranslationKeys.length}`);
  console.log(`  Keys used in code: ${usedKeys.length}`);
  console.log(`  Unused keys: ${unusedKeys.length} (warning only)`);
  console.log();
  
  if (hasErrors) {
    console.log(`${colors.red}✗ I18n coverage check failed!${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}✓ I18n coverage check passed!${colors.reset}\n`);
    process.exit(0);
  }
}

// Run the script
main();

