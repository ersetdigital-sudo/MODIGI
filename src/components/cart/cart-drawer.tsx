"use client";

import { ArrowRight, ShoppingCart, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { CartItemRow } from "@/components/cart/cart-item-row";
import { useCart, useCartDrawer } from "@/components/cart/use-cart";
import { cartCopy } from "@/data/store";
import { formatRupiah } from "@/lib/format";

/**
 * Drawer keranjang — panel yang meluncur dari kanan.
 *
 * Muncul saat produk ditambahkan ("Tambah ke Keranjang") atau saat ikon keranjang
 * di header / FAB di tab bar mobile ditekan. Pembeli bisa mengubah jumlah, menghapus
 * item, atau langsung ke checkout tanpa meninggalkan halaman yang sedang dibaca.
 *
 * A11y:
 * - `role="dialog"` + `aria-modal` + `aria-labelledby` supaya pembaca layar tahu ini
 *   panel, bukan bagian alur halaman.
 * - Saat tertutup, panelnya di-`inert` (bukan cuma transparan) — jadi tidak ada
 *   tombol tersembunyi yang masih bisa di-Tab. Ini yang sering salah di drawer.
 * - `Escape` menutup, fokus dipindah ke tombol tutup saat dibuka, dan dikembalikan
 *   ke elemen yang membukanya saat ditutup.
 * - Scroll halaman dikunci selama panel terbuka.
 *
 * Warna ditulis sebagai nilai langsung (bukan `var(--…)` milik `.store`), karena
 * drawer ini dipasang di root layout dan juga muncul di halaman brand yang bertema
 * emas/cream.
 */
/** Tombol utama drawer — gaya yang sama dengan `.btn-dark` di store.css. */
const tombolUtama =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#151310] px-6 py-3 text-[15px] font-bold text-white transition-colors hover:bg-[#2b2721] focus-visible:ring-2 focus-visible:ring-[#15803d] focus-visible:outline-none";

export function CartDrawer() {
  const { terbuka, tutup } = useCartDrawer();
  const { lines, count, total, savings, ready, clear } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  const pemicu = useRef<HTMLElement | null>(null);

  // Kunci scroll + kembalikan fokus ke elemen yang membuka drawer.
  useEffect(() => {
    if (!terbuka) return;

    pemicu.current = document.activeElement as HTMLElement | null;
    const overflowSebelumnya = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Fokuskan panel (bukan langsung tombol tutup) supaya pembaca layar membacakan
    // judul & jumlah item dulu.
    panel.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") tutup();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflowSebelumnya;
      pemicu.current?.focus();
    };
  }, [terbuka, tutup]);

  return (
    <div
      // `inert` menahan panel beserta isinya dari Tab & pembaca layar saat tertutup.
      inert={!terbuka}
      aria-hidden={!terbuka}
      className="fixed inset-0 z-[60]"
      style={{ pointerEvents: terbuka ? "auto" : "none" }}
    >
      {/* Lapisan gelap + blur di belakang panel. Tombol, bukan <div onClick>, supaya
          bisa ditutup dengan keyboard juga. */}
      <button
        type="button"
        onClick={tutup}
        aria-label={cartCopy.drawer.closeLabel}
        className={`absolute inset-0 cursor-default bg-[#151310]/45 backdrop-blur-[2px] transition-opacity duration-300 ${
          terbuka ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-drawer-keranjang"
        tabIndex={-1}
        className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-white shadow-[-24px_0_60px_-30px_rgb(21_19_16_/_0.45)] outline-none transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          terbuka ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#e7e1d7] px-5 py-4">
          <h2 id="judul-drawer-keranjang" className="text-[19px] font-extrabold text-[#151310]">
            {cartCopy.drawer.title}
            <span className="tabular"> ({ready ? count : "…"})</span>
          </h2>

          <div className="flex items-center gap-1">
            {lines.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-semibold text-[#b42318] transition-colors hover:bg-[#fdf2f2] focus-visible:ring-2 focus-visible:ring-[#15803d] focus-visible:outline-none"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
                {cartCopy.drawer.clearLabel}
              </button>
            )}

            <button
              type="button"
              onClick={tutup}
              aria-label={cartCopy.drawer.closeLabel}
              className="grid size-9 place-items-center rounded-lg text-[#151310] transition-colors hover:bg-[#f1eee7] focus-visible:ring-2 focus-visible:ring-[#15803d] focus-visible:outline-none"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {!ready ? (
          <div className="flex-1 animate-pulse space-y-4 p-5" aria-busy="true">
            {[0, 1].map((n) => (
              <div key={n} className="h-[92px] rounded-2xl bg-[#f5f2ec]" />
            ))}
            <span className="sr-only">Memuat keranjang…</span>
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#f1eee7] text-[#6f6a61]">
              <ShoppingCart className="size-5" aria-hidden="true" />
            </span>

            <p className="mt-4 text-[17px] font-extrabold text-[#151310]">
              {cartCopy.drawer.emptyTitle}
            </p>
            <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-[#6f6a61]">
              {cartCopy.drawer.emptyDescription}
            </p>

            {/* Tombol ditulis dengan utilitas Tailwind, bukan kelas `.btn` milik
                store.css — drawer ini hidup di luar scope `.store`. */}
            <Link href={cartCopy.drawer.emptyAction.href} onClick={tutup} className={tombolUtama}>
              {cartCopy.drawer.emptyAction.label}
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {lines.map((line) => (
              <li
                key={line.slug}
                className="rounded-2xl border border-[#e7e1d7] bg-white p-3"
              >
                <CartItemRow line={line} />
              </li>
            ))}
          </ul>
        )}

        {ready && lines.length > 0 && (
          <div className="border-t border-[#e7e1d7] px-5 py-4">
            <dl className="space-y-2 text-[14px]">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[#6f6a61]">{cartCopy.drawer.totalItemLabel}</dt>
                <dd className="tabular font-semibold text-[#151310]">
                  {count} {cartCopy.drawer.itemSuffix}
                </dd>
              </div>

              {savings > 0 && (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[#6f6a61]">{cartCopy.summary.savingsLabel}</dt>
                  <dd className="tabular font-semibold text-[#15803d]">−{formatRupiah(savings)}</dd>
                </div>
              )}

              <div className="flex items-baseline justify-between gap-4 pt-1">
                <dt className="font-bold text-[#151310]">{cartCopy.drawer.totalPriceLabel}</dt>
                <dd className="tabular text-[20px] font-extrabold leading-none text-[#151310]">
                  {formatRupiah(total)}
                </dd>
              </div>
            </dl>

            <Link href="/checkout" onClick={tutup} className={`${tombolUtama} mt-4 w-full`}>
              {cartCopy.drawer.checkoutLabel}
            </Link>

            <Link
              href="/keranjang"
              onClick={tutup}
              className="mt-2 inline-flex h-9 w-full items-center justify-center text-[13px] font-semibold text-[#6f6a61] transition-colors hover:text-[#151310]"
            >
              {cartCopy.drawer.pageLabel}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
