import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["ru", "uz"],
  defaultLocale: "ru",
});

export default function middleware(request: NextRequest) {
  // Run next-intl middleware first
  const response = intlMiddleware(request);
  
  // Add Cache-Control headers based on route type
  const { pathname } = request.nextUrl;
  
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
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
