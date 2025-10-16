// apps/web/middleware.ts
import createMiddleware from 'next-intl/middleware';

// Используем встроенное middleware из next-intl
export default createMiddleware({
  // Доступные языки на сайте
  locales: ['ru', 'en', 'uz'],

  // Язык по умолчанию (редиректит с / → /ru)
  defaultLocale: 'ru',
});

// Конфигурация: на какие маршруты распространяется middleware
export const config = {
  matcher: [
    '/',                 // корень сайта
    '/(ru|en|uz)/:path*' // все локализованные маршруты
  ],
};