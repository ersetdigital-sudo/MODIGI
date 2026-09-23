import { ShoppingCart } from "lucide-react";

import { WhatsappIcon } from "@/components/store/whatsapp-icon";
import { formatRupiah } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import type { Product } from "@/types";

/**
 * Bar beli yang menempel di bawah layar (hanya < lg) — harga + tombol WhatsApp,
 * supaya pembeli tidak perlu menggulir balik ke kotak pembelian.
 */
export function MobileBuyBar({ product }: { product: Product }) {
  const orderMessage = `Halo, saya mau order ${product.name} (${formatRupiah(product.price)}).`;
  const askMessage = `Halo, saya mau tanya soal ${product.name}.`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-[var(--line)] bg-white/95 px-5 py-3 backdrop-blur lg:hidden">
      <div className="flex-1">
        <p className="text-[11px] leading-none text-[var(--muted)] line-through">
          {formatRupiah(product.compareAt)}
        </p>
        <p className="text-[18px] font-extrabold leading-tight">{formatRupiah(product.price)}</p>
      </div>

      <a
        className="btn btn-wa btn-sm"
        href={whatsappLink(askMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Tanya via WhatsApp"
      >
        <WhatsappIcon className="size-[18px]" />
      </a>

      <a
        className="btn btn-dark btn-sm"
        href={whatsappLink(orderMessage)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ShoppingCart className="size-[18px]" aria-hidden="true" />
        Beli
      </a>
    </div>
  );
}
