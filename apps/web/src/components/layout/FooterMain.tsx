import Link from 'next/link';
import { LogoIcon } from '@/components/design-system/Logo';

interface FooterMainProps {
  locale: string;
}

export function FooterMain({ locale }: FooterMainProps) {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: locale === 'ru' ? 'Компания' : 'Kompaniya',
      links: [
        { name: locale === 'ru' ? 'О нас' : 'Biz haqimizda', href: `/${locale}/about` },
        { name: locale === 'ru' ? 'Как это работает' : 'Qanday ishlaydi', href: `/${locale}/how-it-works` },
        { name: locale === 'ru' ? 'Для бизнеса' : 'Biznes uchun', href: `/${locale}/business` },
        { name: locale === 'ru' ? 'Контакты' : 'Aloqa', href: `/${locale}/contact` },
      ],
    },
    {
      title: locale === 'ru' ? 'Студентам' : 'Talabalar',
      links: [
        { name: locale === 'ru' ? 'Верификация' : 'Tekshirish', href: `/${locale}/verify` },
        { name: locale === 'ru' ? 'Все предложения' : 'Barcha takliflar', href: `/${locale}/deals` },
        { name: locale === 'ru' ? 'Бренды' : 'Brendlar', href: `/${locale}/brands` },
        { name: locale === 'ru' ? 'Категории' : 'Kategoriyalar', href: `/${locale}/categories` },
      ],
    },
    {
      title: locale === 'ru' ? 'Поддержка' : 'Yordam',
      links: [
        { name: locale === 'ru' ? 'Помощь' : 'Yordam markazi', href: `/${locale}/help` },
        { name: locale === 'ru' ? 'FAQ' : 'Savol-javob', href: `/${locale}/faq` },
        { name: locale === 'ru' ? 'Обратная связь' : 'Fikr-mulohaza', href: `/${locale}/beta` },
        { name: 'Email', href: 'mailto:support@studentdeals.uz' },
      ],
    },
    {
      title: locale === 'ru' ? 'Правовая информация' : 'Huquqiy',
      links: [
        { name: locale === 'ru' ? 'Конфиденциальность' : 'Maxfiylik', href: `/${locale}/privacy` },
        { name: locale === 'ru' ? 'Условия использования' : 'Shartlar', href: `/${locale}/terms` },
        { name: 'Cookies', href: `/${locale}/cookies` },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'Telegram',
      href: 'https://t.me/studentdealsuz',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/studentdealsuz',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/studentdealsuz',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <LogoIcon size="md" />
              <div>
                <h3 className="text-white text-xl font-bold">StudentDeals.uz</h3>
                <p className="text-xs text-gray-400">
                  {locale === 'ru' ? 'Экономьте вместе с нами' : 'Biz bilan tejang'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {locale === 'ru' 
                ? 'Лучшие предложения для студентов Узбекистана. Скидки до 70%!' 
                : 'O\'zbekiston talabalari uchun eng yaxshi takliflar. 70% gacha chegirmalar!'}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-600 transition-all duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} StudentDeals.uz. {locale === 'ru' ? 'Все права защищены' : 'Barcha huquqlar himoyalangan'}.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">
                {locale === 'ru' ? 'Конфиденциальность' : 'Maxfiylik'}
              </Link>
              <Link href={`/${locale}/terms`} className="hover:text-white transition-colors">
                {locale === 'ru' ? 'Условия' : 'Shartlar'}
              </Link>
              <Link href={`/${locale}/cookies`} className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

