import { BuyNowButton } from "@/components/cart/add-to-cart";
import { WhatsappIcon } from "@/components/store/whatsapp-icon";
import { formatRupiah } from "@/lib/format";
import { ambilWhatsappNumber, whatsappLink } from "@/lib/whatsapp";
import type { Product } from "@/types";

/**
 * Bar beli yang menempel di bawah layar (hanya < lg) — harga + tombol tanya
 * (WhatsApp) dan tombol beli yang langsung masuk keranjang & ke checkout.
 */
export async function MobileBuyBar({ product }: { product: Product }) {
  const waNumber = await ambilWhatsappNumber();
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
        href={whatsappLink(askMessage, waNumber)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Tanya via WhatsApp"
      >
        <WhatsappIcon className="size-[18px]" />
      </a>

      <BuyNowButton product={product} className="btn btn-dark btn-sm w-auto" label="Beli" />
    </div>
  );
}
