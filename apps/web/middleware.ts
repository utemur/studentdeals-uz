// apps/web/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Безопасный редирект с корня на /ru
  try {
    const { pathname } = req.nextUrl;

    if (pathname === '/' || pathname === '') {
      const url = req.nextUrl.clone();
      url.pathname = '/ru';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    console.error('Middleware error:', err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};