import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: ['/', '/((?!_next|api|static|.*\\..*).*)'],
};

// 💡 Используем try/catch, чтобы middleware не падал на Vercel Edge
export default function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    // редиректим только корень
    if (pathname === '/' || pathname === '') {
      const url = req.nextUrl.clone();
      url.pathname = '/ru';
      return NextResponse.redirect(url, 308);
    }

    // если это не корень — пропускаем дальше
    return NextResponse.next();
  } catch (err) {
    console.error('Safe middleware error:', err);
    // Не даём Edge Runtime падать
    return NextResponse.next();
  }
}