'use client';

import { Container } from "@studentdeals/ui";
import { NextIntlClientProvider } from "next-intl";
import { useParams } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useMemo } from "react";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const locale = params.locale as string;

  const messages = useMemo(async () => {
    return (await import(`../../messages/${locale}.json`)).default;
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <Container>
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-bold text-gray-900">
                Student Deals Uzbekistan
              </h1>
              <LanguageSwitcher />
            </div>
          </Container>
        </header>
        <main>
          {children}
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
