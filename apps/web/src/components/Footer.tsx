import Link from 'next/link';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: {
      title: locale === 'ru' ? 'Компания' : 'Kompaniya',
      links: [
        { href: `/${locale}`, label: locale === 'ru' ? 'Главная' : 'Bosh sahifa' },
        { href: `/${locale}/about`, label: locale === 'ru' ? 'О нас' : 'Biz haqimizda' },
        { href: `/${locale}/contact`, label: locale === 'ru' ? 'Контакты' : 'Aloqa' },
      ],
    },
    legal: {
      title: locale === 'ru' ? 'Юридическая информация' : 'Yuridik ma\'lumot',
      links: [
        { href: `/${locale}/privacy`, label: locale === 'ru' ? 'Конфиденциальность' : 'Maxfiylik' },
        { href: `/${locale}/terms`, label: locale === 'ru' ? 'Условия использования' : 'Foydalanish shartlari' },
        { href: `/${locale}/cookies`, label: locale === 'ru' ? 'Cookies' : 'Cookie fayllari' },
      ],
    },
    support: {
      title: locale === 'ru' ? 'Поддержка' : 'Yordam',
      links: [
        { href: `/${locale}/help`, label: locale === 'ru' ? 'Помощь' : 'Yordam' },
        { href: `/${locale}/faq`, label: locale === 'ru' ? 'FAQ' : 'Savol-javob' },
        { href: 'mailto:support@studentdeals.uz', label: locale === 'ru' ? 'Связаться с нами' : 'Biz bilan bog\'laning' },
      ],
    },
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-gray-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎓</span>
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  StudentDeals.uz
                </h3>
                <p className="text-xs text-gray-400">Экономьте вместе с нами</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {locale === 'ru' 
                ? 'Лучшие предложения для студентов Узбекистана. Скидки до 70% на еду, развлечения, образование и многое другое!'
                : 'O\'zbekiston talabalari uchun eng yaxshi takliflar. Ovqat, o\'yin-kulgi, ta\'lim va boshqalar uchun 70% gacha chegirmalar!'}
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{footerLinks.company.title}</h4>
            <ul className="space-y-2">
              {footerLinks.company.links.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{footerLinks.legal.title}</h4>
            <ul className="space-y-2">
              {footerLinks.legal.links.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{footerLinks.support.title}</h4>
            <ul className="space-y-2">
              {footerLinks.support.links.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('mailto:') ? (
                    <a 
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link 
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} StudentDeals.uz. {locale === 'ru' ? 'Все права защищены' : 'Barcha huquqlar himoyalangan'}.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {/* Social Links */}
              <a 
                href="https://t.me/studentdealsuz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/studentdealsuz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

