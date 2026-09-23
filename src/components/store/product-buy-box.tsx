import { CreditCard, ShoppingCart, Tag } from "lucide-react";

import { WhatsappIcon } from "@/components/store/whatsapp-icon";
import { discountPercent } from "@/data/products";
import { paymentNote, priceNote, productTrust } from "@/data/store";
import { formatRupiah } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import type { Product } from "@/types";

/**
 * Kotak pembelian di halaman detail: diskon, harga, dua tombol WhatsApp
 * (beli / tanya), daftar trust, dan catatan pembayaran.
 * Di desktop menempel (sticky) di kolom kanan; di mobile jadi bagian normal.
 */
export function ProductBuyBox({ product }: { product: Product }) {
  const orderMessage = `Halo, saya mau order ${product.name} (${formatRupiah(product.price)}).`;
  const askMessage = `Halo, saya mau tanya soal ${product.name}.`;

  return (
    <div className="card p-6 lg:sticky lg:top-[88px]">
      {/* Chip diskon dibuat seukuran chip di kartu katalog (bukan pill panjang
          yang memenuhi lebar kartu), lalu keterangannya jadi teks biasa. */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11.5px] font-bold text-[var(--accent)]">
          <Tag className="size-3.5" aria-hidden="true" />
          Hemat {discountPercent(product)}%
        </span>
        <span className="text-[12px] text-[var(--muted)]">dari harga resmi</span>
      </div>

      <div className="mt-3.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="tabular text-[32px] font-extrabold leading-none tracking-[-0.02em] md:text-[34px]">
          {formatRupiah(product.price)}
        </p>
        <p className="tabular text-[13.5px] text-[var(--muted)] line-through">
          {formatRupiah(product.compareAt)}
        </p>
      </div>

      <p className="mt-2 text-[13px] text-[var(--muted)]">{priceNote}</p>

      <div className="mt-5 flex flex-col gap-2.5">
        <a
          className="btn btn-dark w-full"
          href={whatsappLink(orderMessage)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ShoppingCart className="size-[18px]" aria-hidden="true" />
          Beli Sekarang
        </a>

        <a
          className="btn btn-wa w-full"
          href={whatsappLink(askMessage)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsappIcon className="size-[18px]" />
          Tanya Dulu via WhatsApp
        </a>
      </div>

      <div className="divider my-5" />

      <ul className="space-y-3 text-[13.5px]">
        {productTrust.map(({ title, description, icon: Icon }) => (
          <li key={title} className="flex items-center gap-3">
            <span className="ico-wrap text-[var(--ink)]">
              <Icon className="size-[18px]" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="font-bold">{title}</span>
              {description && (
                <>
                  {" "}
                  <span className="text-[var(--muted)]">{description}</span>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className="divider my-5" />

      <div className="flex items-start gap-3 text-[12px] text-[var(--muted)]">
        <CreditCard className="mt-0.5 size-[18px] shrink-0" aria-hidden="true" />
        <p>{paymentNote}</p>
      </div>
    </div>
  );
}
