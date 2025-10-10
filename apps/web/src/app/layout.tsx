import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AxeAccessibility } from "@/components/AxeAccessibility";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://studentdeals.uz';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "StudentDeals.uz - Лучшие предложения для студентов",
    template: "%s | StudentDeals.uz",
  },
  description: "Находите эксклюзивные скидки и предложения от местных и международных брендов специально для студентов Узбекистана",
  applicationName: "StudentDeals.uz",
  authors: [{ name: "StudentDeals.uz Team" }],
  generator: "Next.js",
  keywords: ["студенческие скидки", "скидки для студентов", "Узбекистан", "StudentDeals", "talabalar uchun chegirmalar"],
  
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/apple-touch-icon.png",
  },

  // OpenGraph
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: BASE_URL,
    siteName: "StudentDeals.uz",
    title: "StudentDeals.uz - Лучшие предложения для студентов",
    description: "Находите эксклюзивные скидки и предложения от местных и международных брендов специально для студентов Узбекистана",
    images: [
      {
        url: `${BASE_URL}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "StudentDeals.uz",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@studentdealsuz",
    creator: "@studentdealsuz",
  },

  // Verification
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {process.env.NODE_ENV === 'development' && <AxeAccessibility />}
        {children}
      </body>
    </html>
  );
}
