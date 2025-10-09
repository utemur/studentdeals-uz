import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

const locales = ["ru", "uz"];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = requestLocale || "ru";
  
  if (!locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
