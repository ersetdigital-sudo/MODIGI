"use client";

import { Minus, Plus } from "lucide-react";

import { cartCopy } from "@/data/store";
import { useCart } from "@/components/cart/use-cart";
import { MAX_QTY } from "@/lib/cart";
import { cn } from "@/lib/utils";

/**
 * Stepper jumlah lisensi (− / nilai / +).
 *
 * Dipakai di drawer, ringkasan checkout, dan halaman keranjang — jadi perilakunya
 * pasti sama di ketiganya. Tombolnya 28px (di atas ambang 24px WCAG 2.2) dan yang
 * dinonaktifkan bukan `hidden`, supaya tata letaknya tidak bergeser saat jumlah
 * menyentuh batas.
 *
 * Warna ditulis sebagai nilai langsung, bukan variabel tema store: komponen ini juga
 * dipakai drawer yang hidup di luar scope `.store` (lihat cart-item-row.tsx).
 */
export function QtyStepper({
  slug,
  productName,
  className,
}: {
  slug: string;
  productName: string;
  className?: string;
}) {
  const { lines, setQty } = useCart();
  const baris = lines.find((line) => line.slug === slug);
  const qty = baris?.qty ?? 1;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-[#e7e1d7] bg-white p-0.5",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setQty(slug, qty - 1)}
        disabled={qty <= 1}
        aria-label={`${cartCopy.decreaseLabel} ${productName}`}
        className="grid size-7 place-items-center rounded-full text-[#151310] transition hover:bg-[#f1eee7] disabled:opacity-40"
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>

      <span className="tabular w-7 text-center text-[14px] font-bold">
        <span className="sr-only">{cartCopy.qtyLabel}: </span>
        {qty}
      </span>

      <button
        type="button"
        onClick={() => setQty(slug, qty + 1)}
        disabled={qty >= MAX_QTY}
        aria-label={`${cartCopy.increaseLabel} ${productName}`}
        className="grid size-7 place-items-center rounded-full text-[#151310] transition hover:bg-[#f1eee7] disabled:opacity-40"
      >
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
