'use client';

import { useParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@studentdeals/ui";
import { analytics } from "@/lib/analytics";

export default function LanguageSwitcher() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = params.locale as string;

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;
    
    // Track language switch
    analytics.languageSwitch(locale, newLocale);
    
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={locale === "ru" ? "primary" : "outline"}
        size="sm"
        onClick={() => switchLanguage("ru")}
      >
        RU
      </Button>
      <Button
        variant={locale === "uz" ? "primary" : "outline"}
        size="sm"
        onClick={() => switchLanguage("uz")}
      >
        UZ
      </Button>
    </div>
  );
}
