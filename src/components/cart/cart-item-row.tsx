"use client";

import { Trash2 } from "lucide-react";

import { QtyStepper } from "@/components/cart/qty-stepper";
import { useCart } from "@/components/cart/use-cart";
import { PluginBoxArt } from "@/components/ui/plugin-box-art";
import { cartCopy } from "@/data/store";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CartLine } from "@/types";

/**
 * Satu baris produk di keranjang: artwork, nama, harga, pengatur jumlah, hapus.
 *
 * Satu komponen untuk tiga tempat (drawer, ringkasan checkout, halaman keranjang),
 * jadi tombolnya selalu di posisi yang sama. Seperti `QtyStepper`, warnanya ditulis
 * langsung karena drawer hidup di luar scope `.store` di `store.css`.
 */
export function CartItemRow({
  line,
  /** `sm` dipakai drawer & ringkasan checkout, `md` di halaman keranjang. */
  size = "sm",
  showLineTotal = false,
  className,
}: {
  line: CartLine;
  size?: "sm" | "md";
  /** Tampilkan subtotal baris (harga × jumlah). */
  showLineTotal?: boolean;
  className?: string;
}) {
  const { remove } = useCart();
  const besar = size === "md";

  return (
    <div
      className={cn(
        "flex gap-3",
        besar && "card p-4",
        className,
      )}
    >
      <div
        className={cn(
          "cover-box shrink-0 rounded-2xl bg-gradient-to-b from-[#fbf9f5] to-[#efeae1] ring-1 ring-black/[0.05]",
          besar ? "size-[76px]" : "size-[56px]",
        )}
      >
        <PluginBoxArt art={line.product.art} sizes={besar ? "76px" : "56px"} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={cn("font-bold leading-snug text-[#151310]", besar ? "text-[16.5px]" : "text-[14.5px]")}>
              {line.product.name}
            </p>

            <p className="tabular mt-0.5 text-[13px] text-[#6f6a61]">
              {formatRupiah(line.product.price)}
              {besar ? " / lisensi" : ` × ${line.qty}`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => remove(line.slug)}
            aria-label={`${cartCopy.removeLabel} ${line.product.name}`}
            className="grid size-7 shrink-0 place-items-center rounded-lg text-[#6f6a61] transition-colors hover:bg-[#fdf2f2] hover:text-[#b42318] focus-visible:ring-2 focus-visible:ring-[#15803d] focus-visible:outline-none"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <QtyStepper slug={line.slug} productName={line.product.name} />

          {showLineTotal && (
            <p className="tabular text-[15px] font-extrabold text-[#151310]">
              {formatRupiah(line.subtotal)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
