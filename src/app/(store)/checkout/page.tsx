import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutForm } from "@/components/cart/checkout-form";
import { checkoutCopy } from "@/data/store";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Isi data pesanan, lalu kirim ringkasannya ke WhatsApp admin. Rincian pembayaran dibalas di chat yang sama.",
  robots: { index: false, follow: true },
};

/**
 * Halaman checkout.
 *
 * Kerangka (judul, breadcrumb) dirender di server; formulirnya komponen klien
 * karena butuh isi keranjang dari `localStorage`.
 */
export default function CheckoutPage() {
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
        / <span className="font-semibold text-[var(--ink)]">{checkoutCopy.breadcrumb}</span>
      </nav>

      <h1 className="mt-4 text-[30px] font-extrabold tracking-[-0.03em] md:text-[40px]">
        {checkoutCopy.title}
      </h1>
      <p className="mt-2.5 max-w-2xl text-[15.5px] leading-relaxed text-[var(--muted)]">
        {checkoutCopy.description}
      </p>

      <CheckoutForm />
    </div>
  );
}
