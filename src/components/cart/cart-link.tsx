"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/components/cart/use-cart";
import { cn } from "@/lib/utils";

type CartLinkProps = {
  /** `header` = ikon kecil di bilah atas (≥ lg). `fab` = tombol bulat di tab bar mobile. */
  variant?: "header" | "fab";
  className?: string;
};

/**
 * Ikon keranjang dengan jumlah dari state keranjang asli (dulu angka tetap 0).
 *
 * Angka di badge di-`aria-hidden` (murni visual) dan jumlahnya diumumkan lewat
 * `aria-label`, jadi pembaca layar mendengar "Keranjang belanja, 3 produk" sekali
 * — bukan angka yang melayang tanpa konteks.
 */
export function CartLink({ variant = "header", className }: CartLinkProps) {
  const { count, ready } = useCart();
  const label = ready && count > 0 ? `Keranjang belanja, ${count} produk` : "Keranjang belanja";

  const isFab = variant === "fab";

  return (
    <Link
      href="/keranjang"
      aria-label={label}
      className={cn(
        isFab
          ? "relative grid size-14 place-items-center rounded-full border-4 border-white bg-ink text-gold shadow-lift transition-colors hover:bg-ink-700 focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:outline-none"
          : "relative hidden size-10 place-items-center rounded-lg text-white/85 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:outline-none lg:grid",
        className,
      )}
    >
      <ShoppingCart className={isFab ? "size-6" : "size-5"} aria-hidden="true" />

      {/* Angka baru muncul setelah keranjang dibaca — jadi tidak ada kedipan
          "0" lalu berubah jadi "3" saat halaman dimuat. */}
      {ready && count > 0 && (
        <span
          aria-hidden="true"
          className={cn(
            "tabular absolute grid place-items-center rounded-full bg-gold font-bold text-ink",
            isFab
              ? "-right-1 -top-1 size-5 border-2 border-white text-[10px]"
              : "right-1 top-1 size-4 text-[10px]",
          )}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
