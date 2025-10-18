// apps/web/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Редиректим только корень, чтобы не было циклов
  if (pathname === '/' || pathname === '') {
    const url = req.nextUrl.clone();
    url.pathname = '/ru';
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

// Исключаем служебные пути, api и файлы с расширением
export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};