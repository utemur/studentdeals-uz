# Accessibility & Internationalization Guide

This document describes the accessibility (a11y) and internationalization (i18n) setup for StudentDeals.uz.

## Table of Contents

- [Accessibility (A11y)](#accessibility-a11y)
  - [Axe-core Runtime Checks](#axe-core-runtime-checks)
  - [ESLint jsx-a11y Rules](#eslint-jsx-a11y-rules)
  - [Best Practices](#best-practices)
- [Internationalization (I18n)](#internationalization-i18n)
  - [Translation Files](#translation-files)
  - [Coverage Checker](#coverage-checker)
  - [CI Integration](#ci-integration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Accessibility (A11y)

### Axe-core Runtime Checks

**What is it?**
Axe-core automatically checks for accessibility issues in the browser during development.

**How it works:**
- Runs only in development mode
- Automatically logs accessibility violations to browser console
- Checks for color contrast, image alt text, labels, ARIA attributes, etc.

**Setup:**
```typescript
// Already configured in apps/web/src/app/layout.tsx
import { AxeAccessibility } from "@/components/AxeAccessibility";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {process.env.NODE_ENV === 'development' && <AxeAccessibility />}
        {children}
      </body>
    </html>
  );
}
```

**What it checks:**
- ✅ Color contrast ratios
- ✅ Image alt text
- ✅ Form labels
- ✅ Link text
- ✅ Button names
- ✅ ARIA attributes
- ✅ Semantic HTML

**Viewing results:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for axe-core violations
4. Each violation includes:
   - Description of the issue
   - Affected elements
   - How to fix it
   - WCAG reference

### ESLint jsx-a11y Rules

**What is it?**
ESLint plugin that enforces accessibility best practices at build time.

**Configuration:**
```json
// apps/web/.eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:jsx-a11y/recommended"
  ],
  "plugins": ["jsx-a11y"],
  "rules": {
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/label-has-associated-control": "error",
    // ... more rules
  }
}
```

**What it checks:**
- ✅ Anchors have valid href
- ✅ Images have alt text
- ✅ ARIA props are valid
- ✅ Form inputs have labels
- ✅ Interactive elements are keyboard accessible
- ✅ Semantic HTML is used correctly

**Running checks:**
```bash
# Lint all files
pnpm --filter web run lint

# Lint specific file
pnpm --filter web run lint src/app/page.tsx

# Auto-fix issues
pnpm --filter web run lint --fix
```

### Best Practices

#### Images
```tsx
// ✅ Good
<img src="/logo.png" alt="StudentDeals logo" />

// ❌ Bad
<img src="/logo.png" />
```

#### Buttons
```tsx
// ✅ Good
<button onClick={handleClick}>Submit</button>

// ❌ Bad
<div onClick={handleClick}>Submit</div>
```

#### Links
```tsx
// ✅ Good
<a href="/about">About Us</a>

// ❌ Bad
<a>Click here</a>
```

#### Form Labels
```tsx
// ✅ Good
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ❌ Bad
<input type="email" placeholder="Email" />
```

#### Semantic HTML
```tsx
// ✅ Good
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// ❌ Bad
<div>
  <div>
    <div><a href="/">Home</a></div>
  </div>
</div>
```

#### ARIA Attributes
```tsx
// ✅ Good
<button aria-label="Close dialog" onClick={close}>
  <X />
</button>

// ❌ Bad
<button onClick={close}>
  <X />
</button>
```

## Internationalization (I18n)

### Translation Files

**Location:**
- `apps/web/src/messages/ru.json` - Russian translations
- `apps/web/src/messages/uz.json` - Uzbek translations

**Structure:**
```json
{
  "HomePage": {
    "title": "Лучшие предложения для студентов",
    "description": "Находите эксклюзивные скидки...",
    "features": {
      "students": {
        "title": "Для студентов",
        "description": "Получайте скидки до 50%",
        "cta": "Найти предложения"
      }
    }
  }
}
```

**Usage in code:**
```tsx
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <button>{t('features.students.cta')}</button>
    </div>
  );
}
```

### Coverage Checker

**What is it?**
A script that scans the codebase for translation keys and ensures all keys exist in both language files.

**What it checks:**
1. ✅ All locales have the same keys
2. ✅ All used keys exist in translations
3. ⚠️  Unused keys (warning only)

**Running the checker:**
```bash
# Check i18n coverage
pnpm --filter web run check:i18n
```

**Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  I18n Coverage Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 Loading translation files...
  ✓ Loaded ru.json (15 keys)
  ✓ Loaded uz.json (15 keys)

🔍 Scanning source files for translation keys...
  ✓ Found 12 unique translation keys in code

🔄 Checking consistency between locales...
  ✓ uz matches ru

🔍 Checking if all used keys exist in translations...
  ✓ All used keys exist in translations

📊 Checking for unused translation keys...
  ⚠ Keys in translations but not used in code (3):
    - HomePage.features.merchants.title
    - HomePage.features.merchants.description
    - HomePage.features.merchants.cta

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Locales checked: ru, uz
  Translation keys: 15
  Keys used in code: 12
  Unused keys: 3 (warning only)

✓ I18n coverage check passed!
```

**Failure scenarios:**

1. **Missing key in one locale:**
```
✗ Keys in ru but missing in uz:
  - HomePage.newFeature.title
  - HomePage.newFeature.description
```

2. **Key used in code but missing in translations:**
```
✗ Keys used in code but missing in translations:
  - DashboardPage.title
  - DashboardPage.description
```

### CI Integration

**GitHub Action:**
The i18n coverage check runs automatically on PRs that modify:
- `apps/web/src/**`
- `apps/web/messages/**`

**Configuration:**
```yaml
# .github/workflows/accessibility-i18n.yml
name: Accessibility & I18n Checks

on:
  pull_request:
    paths:
      - 'apps/web/src/**'
      - 'apps/web/messages/**'

jobs:
  i18n-coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check i18n coverage
        run: node scripts/check-i18n-coverage.js
```

**What happens on failure:**
1. CI check fails
2. PR cannot be merged
3. Bot comments on PR with instructions
4. Developer must fix missing translations

## Testing

### Testing Accessibility

**1. Manual Testing:**
```bash
# Start dev server
pnpm --filter web dev

# Open browser to http://localhost:3000
# Open DevTools Console
# Look for axe-core violations
```

**2. Automated Testing:**
```bash
# Run ESLint checks
pnpm --filter web run lint

# Run E2E tests (includes accessibility checks)
pnpm --filter web run test:e2e
```

**3. Browser Extensions:**
- [axe DevTools](https://www.deque.com/axe/devtools/) - Chrome/Firefox
- [WAVE](https://wave.webaim.org/extension/) - Chrome/Firefox
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Chrome DevTools

### Testing I18n

**1. Check coverage:**
```bash
pnpm --filter web run check:i18n
```

**2. Test in browser:**
```bash
# Start dev server
pnpm --filter web dev

# Visit http://localhost:3000/ru
# Visit http://localhost:3000/uz
# Verify all text is translated
```

**3. Add new translations:**
```bash
# 1. Add key to ru.json
{
  "NewPage": {
    "title": "Новая страница"
  }
}

# 2. Add same key to uz.json
{
  "NewPage": {
    "title": "Yangi sahifa"
  }
}

# 3. Check coverage
pnpm --filter web run check:i18n

# 4. Use in code
const t = useTranslations('NewPage');
return <h1>{t('title')}</h1>;
```

## Troubleshooting

### Axe-core not showing violations

**Problem:** No violations appear in console

**Solutions:**
1. Check `NODE_ENV` is set to `development`
2. Check browser console for errors
3. Verify `@axe-core/react` is installed
4. Clear browser cache and reload

### ESLint a11y errors

**Problem:** Too many a11y errors after adding plugin

**Solutions:**
1. Fix errors one by one
2. Use `--fix` flag for auto-fixable issues
3. Temporarily disable specific rules if needed:
```json
{
  "rules": {
    "jsx-a11y/no-autofocus": "warn"
  }
}
```

### I18n coverage check failing

**Problem:** Check fails but translations look correct

**Solutions:**
1. Check for typos in translation keys
2. Verify JSON structure matches between locales
3. Check for trailing commas in JSON
4. Ensure UTF-8 encoding
5. Run script locally to see detailed output

### Missing translation keys

**Problem:** Key exists in code but not in translations

**Solutions:**
1. Add key to both `ru.json` and `uz.json`
2. Use same structure in both files
3. Run `check:i18n` to verify
4. Commit both files together

### Unused translation keys

**Problem:** Many unused keys warning

**Solutions:**
1. Review if keys are actually unused
2. Remove unused keys from both files
3. Keep keys if they'll be used soon
4. Warnings don't fail CI (errors only)

## Best Practices

### Accessibility

1. ✅ **Use semantic HTML** - `<nav>`, `<main>`, `<article>`, etc.
2. ✅ **Provide alt text** - All images must have descriptive alt text
3. ✅ **Label form inputs** - Use `<label>` with `htmlFor`
4. ✅ **Keyboard navigation** - All interactive elements must be keyboard accessible
5. ✅ **Color contrast** - Minimum 4.5:1 for normal text, 3:1 for large text
6. ✅ **ARIA when needed** - Use ARIA attributes for complex components
7. ✅ **Test with screen readers** - Test with NVDA, JAWS, or VoiceOver

### Internationalization

1. ✅ **Consistent structure** - Same keys in all language files
2. ✅ **Descriptive keys** - Use meaningful key names
3. ✅ **Nested structure** - Group related translations
4. ✅ **No hardcoded text** - All UI text must be translated
5. ✅ **Run coverage check** - Before every commit
6. ✅ **Test both languages** - Verify translations in browser
7. ✅ **Cultural sensitivity** - Consider cultural differences

## Resources

### Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)

### Internationalization
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [i18n Best Practices](https://phrase.com/blog/posts/i18n-best-practices/)
- [Unicode CLDR](http://cldr.unicode.org/)

## Support

For issues with accessibility or i18n:
1. Check this documentation
2. Run checks locally
3. Review console errors
4. Contact team lead or accessibility specialist

