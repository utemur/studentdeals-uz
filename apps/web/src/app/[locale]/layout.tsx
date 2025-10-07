import { Container } from "@studentdeals/ui";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}
