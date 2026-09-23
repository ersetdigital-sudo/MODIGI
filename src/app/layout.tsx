import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { siteConfig } from "@/data/site";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Plugin & Tools WordPress Original`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

/**
 * Layout akar: hanya `<html>`, font global, dan metadata.
 *
 * Header/footer dipisah ke layout per-route-group:
 * - `(main)`  → chrome MODIGI (header gelap, footer lengkap, tab bar mobile)
 * - `(store)` → chrome halaman katalog & detail produk (gaya template)
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
