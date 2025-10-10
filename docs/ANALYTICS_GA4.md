# Google Analytics 4 Integration

Complete guide to Google Analytics 4 integration for StudentDeals.uz with privacy-first approach.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Event Tracking](#event-tracking)
- [Privacy & Consent](#privacy--consent)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Overview

Our GA4 integration includes:
- ✅ **Automatic page view tracking**
- ✅ **Custom event tracking** (signup, signin, errors, etc.)
- ✅ **Do Not Track respect** - Automatically disabled if DNT is enabled
- ✅ **Consent mode** - User must accept before tracking
- ✅ **Privacy-first** - IP anonymization, no ad personalization
- ✅ **No-op fallback** - Graceful degradation if GA is disabled

## Setup

### 1. Get GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Set Environment Variable

```bash
# .env.local (development)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Vercel (production)
# Add to environment variables in Vercel dashboard
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Verify Integration

```bash
# Start dev server
pnpm --filter web dev

# Open browser to http://localhost:3000
# Open DevTools → Console
# Look for: [Analytics] Google Analytics initialized
```

## Event Tracking

### Tracked Events

| Event | When | Parameters |
|-------|------|------------|
| `signup_start` | User visits signup page | `method`, `timestamp` |
| `signup_success` | User completes signup | `user_id`, `timestamp` |
| `signin_success` | User logs in | `user_id`, `timestamp` |
| `language_switch` | User changes language | `from_language`, `to_language` |
| `error_toast` | Error message shown | `error_message`, `page_path` |
| `api_error` | API request fails | `endpoint`, `status_code`, `error_message` |
| `deal_view` | User views a deal | `deal_id`, `deal_title` |
| `deal_click` | User clicks on deal | `deal_id`, `deal_title` |
| `search` | User searches | `search_term`, `results_count` |

### Usage Examples

#### Track Auth Events

```typescript
import { analytics } from '@/lib/analytics';

// Signup start (automatic on page load)
useEffect(() => {
  analytics.signupStart();
}, []);

// Signup success
analytics.signupSuccess(userId);

// Signin success
analytics.signinSuccess(userId);
```

#### Track User Actions

```typescript
// Language switch (automatic in LanguageSwitcher)
analytics.languageSwitch('ru', 'uz');

// Error toast (automatic in Toast component)
analytics.errorToast('Invalid email format');

// API error (in catch blocks)
analytics.apiError('/api/auth/login', 401, 'Invalid credentials');
```

#### Track Custom Events

```typescript
import { trackEvent } from '@/lib/analytics';

// Custom event
trackEvent('button_click', {
  button_name: 'subscribe',
  location: 'homepage',
});
```

### Event Parameters

All events include:
- `timestamp` - ISO 8601 timestamp
- `page_path` - Current page URL (when applicable)
- Custom parameters specific to each event

## Privacy & Consent

### Do Not Track (DNT)

Analytics automatically respects the browser's Do Not Track setting:

```typescript
// Automatically checked in isTrackingAllowed()
const dnt = navigator.doNotTrack;
if (dnt === '1' || dnt === 'yes') {
  // Tracking disabled
  return false;
}
```

**Browsers that support DNT:**
- Firefox
- Safari
- Edge
- Opera

### Consent Mode

We use Google's Consent Mode v2:

```typescript
// Default: denied
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
});

// After user accepts
gtag('consent', 'update', {
  analytics_storage: 'granted',
});
```

### Cookie Consent Banner

A banner appears on first visit asking for consent:

```typescript
// User accepts → tracking enabled
consent.grant();

// User denies → tracking disabled
consent.deny();

// Check status
const status = consent.getStatus(); // 'granted' | 'denied' | 'unknown'
```

### Privacy Features

1. ✅ **IP Anonymization** - IPs are anonymized
2. ✅ **No Google Signals** - Remarketing disabled
3. ✅ **No Ad Personalization** - Ad tracking disabled
4. ✅ **Consent Required** - User must opt-in
5. ✅ **Do Not Track** - Automatically respected
6. ✅ **No-op Fallback** - Graceful degradation

### Data Collected

**With consent:**
- Page views
- Custom events (signup, signin, etc.)
- User interactions
- Anonymized IP address
- Browser and device info

**Without consent:**
- Nothing (complete no-op)

## Testing

### 1. Test Do Not Track

```bash
# Enable DNT in browser
# Firefox: about:preferences#privacy → Enable "Tell websites not to track"
# Chrome: Not supported (deprecated)

# Visit site
# Open DevTools Console
# Should see: [Analytics] Do Not Track is enabled - tracking disabled
```

### 2. Test Consent Banner

```bash
# Clear localStorage
localStorage.clear();

# Reload page
# Should see consent banner

# Click "Accept"
# Should see: [Analytics] Consent granted
# Should see: [Analytics] Google Analytics initialized
```

### 3. Test Event Tracking

```bash
# Open DevTools → Console
# Enable verbose logging

# Perform actions:
# - Visit /signup → Should see: signup_start
# - Complete signup → Should see: signup_success
# - Switch language → Should see: language_switch
# - Trigger error → Should see: error_toast
```

### 4. Test in GA4 Dashboard

```bash
# Go to GA4 Dashboard
# Reports → Realtime

# Perform actions on site
# Should see events appear in realtime (within 30 seconds)
```

### 5. Test No-op Fallback

```bash
# Don't set NEXT_PUBLIC_GA_ID
# Or enable Do Not Track
# Or deny consent

# Perform actions
# Should see: [Analytics] ... tracking disabled
# No errors in console
# Everything works normally
```

## Troubleshooting

### Events not showing in GA4

**Problem:** Events tracked but not appearing in dashboard

**Solutions:**
1. Wait 24-48 hours for data to process
2. Check Realtime reports (shows within 30 seconds)
3. Verify GA_ID is correct
4. Check consent is granted
5. Check Do Not Track is disabled

### Consent banner not showing

**Problem:** Banner doesn't appear

**Solutions:**
1. Clear localStorage: `localStorage.clear()`
2. Check DNT is not enabled
3. Check consent status: `consent.getStatus()`
4. Reload page

### Tracking disabled

**Problem:** Console shows "tracking disabled"

**Solutions:**
1. Check `NEXT_PUBLIC_GA_ID` is set
2. Disable Do Not Track in browser
3. Grant consent via banner
4. Check localStorage: `localStorage.getItem('analytics_consent')`

### Too many events

**Problem:** Events firing multiple times

**Solutions:**
1. Check useEffect dependencies
2. Ensure events are not in render loops
3. Add debouncing for frequent events
4. Review event tracking code

## Best Practices

### 1. Track Meaningful Events

```typescript
// ✅ Good - Meaningful business events
analytics.signupSuccess(userId);
analytics.dealClick(dealId, dealTitle);

// ❌ Bad - Too granular or meaningless
analytics.trackEvent('button_hover');
analytics.trackEvent('scroll_1px');
```

### 2. Include Context

```typescript
// ✅ Good - Rich context
analytics.apiError('/api/auth/login', 401, 'Invalid credentials');

// ❌ Bad - No context
analytics.apiError('error');
```

### 3. Respect Privacy

```typescript
// ✅ Good - Check tracking allowed
if (isTrackingAllowed()) {
  trackEvent('event_name');
}

// ❌ Bad - Track without checking
trackEvent('event_name');
```

### 4. Use Event Helpers

```typescript
// ✅ Good - Use provided helpers
analytics.signupSuccess(userId);

// ❌ Bad - Manual tracking
trackEvent('signup_success', { user_id: userId });
```

### 5. Handle Errors Gracefully

```typescript
// ✅ Good - Try-catch for tracking
try {
  analytics.trackEvent('event');
} catch (error) {
  console.error('Analytics error:', error);
}

// ❌ Bad - No error handling
analytics.trackEvent('event');
```

## GDPR Compliance

Our implementation is GDPR compliant:

1. ✅ **Consent required** - User must opt-in
2. ✅ **Clear information** - Banner explains what we track
3. ✅ **Easy opt-out** - User can deny consent
4. ✅ **Data minimization** - Only essential data collected
5. ✅ **IP anonymization** - IPs are anonymized
6. ✅ **No third-party sharing** - Data stays with Google Analytics

## Resources

- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Consent Mode](https://developers.google.com/tag-platform/security/guides/consent)
- [GDPR Compliance](https://support.google.com/analytics/answer/9019185)
- [Event Tracking Best Practices](https://support.google.com/analytics/answer/9267735)

## Support

For issues with analytics:
1. Check this documentation
2. Review browser console logs
3. Check GA4 dashboard
4. Verify environment variables
5. Contact team lead or analytics specialist

