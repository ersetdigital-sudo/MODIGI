import type { Metadata } from "next";
import Link from "next/link";

import { OrderDone } from "@/components/cart/order-done";
import { orderDoneCopy } from "@/data/store";
import { ambilWhatsappNumber } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Pesanan Terkirim",
  description:
    "Ringkasan pesanan Anda beserta langkah pembayaran dan aktivasi lisensi.",
  robots: { index: false, follow: true },
};

/**
 * Halaman konfirmasi setelah checkout.
 *
 * Isi pesanannya dibaca dari `localStorage` (lihat `OrderDone`), bukan dari URL:
 * nomor pesanan dan data pembeli tidak ikut tercatat di riwayat browser maupun
 * terkirim sebagai referrer kalau link-nya dibagikan.
 */
export default async function CheckoutSelesaiPage() {
  const waNumber = await ambilWhatsappNumber();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--ink)]">
          Beranda
        </Link>{" "}
        /{" "}
        <Link href="/keranjang" className="hover:text-[var(--ink)]">
          Keranjang
        </Link>{" "}
        / <span className="font-semibold text-[var(--ink)]">Pesanan</span>
      </nav>

      <h1 className="mt-4 text-[30px] font-extrabold tracking-[-0.03em] md:text-[40px]">
        {orderDoneCopy.title}
      </h1>
      <p className="mt-2.5 max-w-2xl text-[15.5px] leading-relaxed text-[var(--muted)]">
        {orderDoneCopy.description}
      </p>

      <OrderDone waNumber={waNumber} />
    </div>
  );
}
