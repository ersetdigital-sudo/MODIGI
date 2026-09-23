import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { CartDrawer } from "@/components/cart/cart-drawer";
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
 * - `(store)` → chrome halaman katalog, detail produk, keranjang & checkout
 *
 * Isi keranjang tidak butuh provider di sini: sumbernya `localStorage` dan dibaca
 * lewat `useCart()` (`components/cart/use-cart.ts`), jadi header, tab bar mobile,
 * halaman keranjang, dan checkout otomatis membaca angka yang sama.
 *
 * `<CartDrawer />` dipasang di akar karena panelnya harus bisa dibuka dari halaman
 * mana pun (katalog, detail produk, beranda) tanpa ikut unmount saat pindah rute.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
