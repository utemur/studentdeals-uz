// apps/web/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // редиректим ТОЛЬКО корень на /ru
  if (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "") {
    const url = req.nextUrl.clone();
    url.pathname = "/ru";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// Запускаем middleware только на "/"
export const config = {
  matcher: ["/"],
};