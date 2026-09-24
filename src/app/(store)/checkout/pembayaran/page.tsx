import type { Metadata } from "next";
import Link from "next/link";

import { PaymentStep } from "@/components/cart/payment-step";
import { paymentCopy } from "@/data/store";
import { ambilMetodeBayar } from "@/lib/payment";
import { ambilWhatsappNumber } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Pembayaran",
  description:
    "Pilih cara bayar — transfer bank, QRIS, atau e-wallet — lalu kirim konfirmasi pembayarannya ke WhatsApp admin.",
  robots: { index: false, follow: true },
};

/**
 * Halaman pembayaran — langkah setelah checkout.
 *
 * Rincian cara bayarnya **dirender di server** dari tabel `payment_methods`, jadi
 * nomor rekening yang dilihat pembeli selalu yang terbaru saat halaman dimuat dan
 * tidak menunggu JavaScript. Pilihan & tombol konfirmasinya ada di komponen klien
 * karena butuh data pesanan dari `localStorage` (lihat `PaymentStep`).
 *
 * Halaman ini `noindex`: isinya per-pesanan, tidak ada gunanya muncul di hasil
 * pencarian.
 */
export default async function PembayaranPage() {
  const [metode, waNumber] = await Promise.all([ambilMetodeBayar(), ambilWhatsappNumber()]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--muted)]">
        <Link href={paymentCopy.breadcrumbParent.href} className="hover:text-[var(--ink)]">
          {paymentCopy.breadcrumbParent.label}
        </Link>{" "}
        <span aria-hidden="true" className="text-[var(--line)]">
          ›
        </span>{" "}
        <span className="font-semibold text-[var(--ink)]">{paymentCopy.breadcrumb}</span>
      </nav>

      <h1 className="mt-4 text-[30px] font-extrabold tracking-[-0.03em] md:text-[40px]">
        {paymentCopy.title}
      </h1>
      <p className="mt-2.5 max-w-2xl text-[15.5px] leading-relaxed text-[var(--muted)]">
        {paymentCopy.description}
      </p>

      <PaymentStep methods={metode} waNumber={waNumber} />
    </div>
  );
}
