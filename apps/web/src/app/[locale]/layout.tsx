import { Container } from "@studentdeals/ui";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import UserMenu from "@/components/UserMenu";
import { Footer } from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth-server";
import Link from "next/link";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const user = await getCurrentUser();
  const locale = params.locale;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <Container>
          <div className="flex items-center justify-between h-16">
            <Link href={`/${locale}`}>
              <h1 className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600">
                Student Deals Uzbekistan
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <UserMenu user={user} locale={locale} />
            </div>
          </div>
        </Container>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
