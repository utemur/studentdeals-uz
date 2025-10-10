import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AxeAccessibility } from "@/components/AxeAccessibility";

export const metadata: Metadata = {
  title: "Student Deals Uzbekistan",
  description: "Лучшие предложения для студентов в Узбекистане",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/apple-touch-icon.png",
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
