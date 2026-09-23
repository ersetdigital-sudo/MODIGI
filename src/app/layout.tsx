import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { CatalogSync } from "@/components/cart/catalog-sync";
import { siteConfig } from "@/data/site";
import { ambilProdukRingkas } from "@/lib/catalog";

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
 *
 * `<CatalogSync />` juga di akar: ia hanya menitipkan ringkasan katalog ke memori
 * tab (tidak merender apa pun), dan keranjang di halaman mana pun memakainya.
 */
export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Ringkasan katalog (harga & artwork) dititipkan ke browser supaya keranjang
  // memakai harga terbaru dari database, bukan harga statis.
  const ringkasanKatalog = await ambilProdukRingkas();

  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <CartDrawer />
        <CatalogSync products={ringkasanKatalog} />
      </body>
    </html>
  );
}
