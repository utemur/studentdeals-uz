import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["ru", "uz"] as const;
export const defaultLocale = "ru" as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = requestLocale || defaultLocale;
  
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
