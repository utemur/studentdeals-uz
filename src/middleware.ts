import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // default locale (ru) has no URL prefix; uz is served at /uz
});

export const config = {
  // Skip API routes, static files, and anything with a file extension.
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
