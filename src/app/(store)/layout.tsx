import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { StoreFooter } from "@/components/store/store-footer";

import "./store.css";

/**
 * Layout halaman katalog & detail produk.
 *
 * Header-nya memakai <SiteHeader /> yang sama dengan beranda (nav, pencarian,
 * keranjang, tombol Masuk). Isi halamannya sendiri mengikuti tema template HTML
 * `katalog-plugin-wordpress` — makanya dibungkus `.store` (lihat `store.css`).
 * Header sengaja diletakkan DI LUAR pembungkus itu supaya tidak kena override tema.
 *
 * Tipografi: memakai font situs (Plus Jakarta Sans dari root layout), bukan font
 * display template (Bricolage Grotesque) — satu keluarga font untuk seluruh situs,
 * sekaligus satu permintaan font lebih sedikit.
 */
export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />

      <div className="store flex flex-col">
        <main className="flex-1">{children}</main>
        <StoreFooter />
      </div>
    </>
  );
}
