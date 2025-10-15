'use client';

import { useState } from 'react';
import { Logo } from '@/components/design-system/Logo';
import { SearchBarCompact } from '@/components/design-system/SearchBar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ClientUserMenu from '@/components/ClientUserMenu';
import { UserDTO } from '@studentdeals/types';
import Link from 'next/link';

interface HeaderProps {
  locale: string;
  initialUser: UserDTO | null;
}

export function Header({ locale, initialUser }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { 
      name: locale === 'ru' ? 'Предложения' : 'Takliflar', 
      href: `/${locale}/deals` 
    },
    { 
      name: locale === 'ru' ? 'Бренды' : 'Brendlar', 
      href: `/${locale}/brands` 
    },
    { 
      name: locale === 'ru' ? 'Категории' : 'Kategoriyalar', 
      href: `/${locale}/categories` 
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo locale={locale} size="md" showText={true} />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            {/* Desktop User Menu */}
            <div className="hidden md:block">
              <ClientUserMenu initialUser={initialUser} locale={locale} />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:block pb-4">
          <SearchBarCompact locale={locale} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-4">
            {/* Search Bar - Mobile */}
            <SearchBarCompact locale={locale} />

            {/* Navigation Links */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-600 rounded-lg transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Menu - Mobile */}
            <div className="pt-4 border-t border-gray-200">
              <ClientUserMenu initialUser={initialUser} locale={locale} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

