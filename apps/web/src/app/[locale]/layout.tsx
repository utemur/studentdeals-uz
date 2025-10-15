import { Header } from "@/components/layout/Header";
import { FooterMain } from "@/components/layout/FooterMain";
import { getCurrentUser } from "@/lib/auth-server";

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
      <Header locale={locale} initialUser={user} />
      <main className="flex-grow">
        {children}
      </main>
      <FooterMain locale={locale} />
    </div>
  );
}
