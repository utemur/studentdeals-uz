import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude assets from locale handling
  if (pathname.match(/^\/_next|favicon\.ico|robots\.txt|sitemap\.xml|sw\.js/)) {
    return NextResponse.next();
  }
  
  // Handle root path redirect to default locale
  // This is needed for Vercel root domain to properly redirect to the default locale
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
  
  // Handle paths without locale prefix (e.g., "/about" -> "/ru/about")
  if (!pathname.startsWith("/ru") && !pathname.startsWith("/uz")) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }
  
  // Run next-intl middleware for locale-prefixed paths
  const response = intlMiddleware(request);
  
  // Add Cache-Control headers based on route type
  // Dynamic pages (auth, dashboard) - short cache with stale-while-revalidate
  if (
    pathname.includes('/signin') ||
    pathname.includes('/signup') ||
    pathname.includes('/dashboard') ||
    pathname.includes('/verify')
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=0, s-maxage=10, stale-while-revalidate=60'
    );
  }
  // Static pages (homepage) - longer cache
  else if (pathname === '/' || pathname.match(/^\/(ru|uz)\/?$/)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=60, s-maxage=60, stale-while-revalidate=300'
    );
  }
  // Default for other pages
  else {
    response.headers.set(
      'Cache-Control',
      'public, max-age=30, s-maxage=30, stale-while-revalidate=120'
    );
  }
  
  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - _next (Next.js internals)
    // - _vercel (Vercel internals)
    // - Static files (images, etc.)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
