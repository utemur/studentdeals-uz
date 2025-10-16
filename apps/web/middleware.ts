import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DEFAULT_LOCALE = 'ru' // основной язык

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // если путь уже содержит язык, пропускаем
  if (/^\/(ru|en|uz)(\/|$)/.test(pathname)) {
    return NextResponse.next()
  }

  // если корень сайта — редиректим на /ru
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = `/${DEFAULT_LOCALE}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}