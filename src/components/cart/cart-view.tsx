"use client";

import { ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";

import { CartItemRow } from "@/components/cart/cart-item-row";
import { useCart } from "@/components/cart/use-cart";
import { WhatsappIcon } from "@/components/store/whatsapp-icon";
import { cartCopy } from "@/data/store";
import { formatRupiah } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Isi halaman /keranjang — versi halaman penuh dari drawer.
 *
 * Dipisah dari `page.tsx` supaya halamannya tetap komponen server (metadata,
 * judul), sementara bagian yang butuh state jadi client.
 */
export function CartView({ waNumber }: { waNumber?: string }) {
  const { lines, count, total, savings, ready, clear } = useCart();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--ink)]">
          Beranda
        </Link>{" "}
        / <span className="font-semibold text-[var(--ink)]">{cartCopy.breadcrumb}</span>
      </nav>

      <h1 className="mt-4 text-[30px] font-extrabold tracking-[-0.03em] md:text-[40px]">
        {cartCopy.title}
      </h1>
      <p className="mt-2.5 max-w-2xl text-[15.5px] leading-relaxed text-[var(--muted)]">
        {cartCopy.description}
      </p>

      {!ready ? (
        <KeranjangMemuat />
      ) : lines.length === 0 ? (
        <KeranjangKosong waNumber={waNumber} />
      ) : (
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-[13.5px] font-semibold text-[var(--muted)]">
                {count} {cartCopy.drawer.itemSuffix}
              </p>

              <button
                type="button"
                onClick={clear}
                className="inline-flex h-9 items-center rounded-lg px-3 text-[13px] font-semibold text-[#b42318] transition-colors hover:bg-[#fdf2f2] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
              >
                {cartCopy.drawer.clearLabel}
              </button>
            </div>

            <ul className="mt-3 flex flex-col gap-4">
              {lines.map((line) => (
                <li key={line.slug}>
                  <CartItemRow line={line} size="md" showLineTotal />
                </li>
              ))}
            </ul>
          </div>

          <aside className="card p-5 lg:sticky lg:top-[88px]">
            <h2 className="text-[17px] font-extrabold tracking-[-0.01em]">
              {cartCopy.summary.title}
            </h2>

            <div className="divider my-4" />

            <dl className="space-y-2.5 text-[14px]">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[var(--muted)]">{cartCopy.summary.countLabel}</dt>
                <dd className="tabular font-semibold">{count}</dd>
              </div>

              {savings > 0 && (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[var(--muted)]">{cartCopy.summary.savingsLabel}</dt>
                  <dd className="tabular font-semibold text-[var(--accent)]">
                    −{formatRupiah(savings)}
                  </dd>
                </div>
              )}
            </dl>

            <div className="divider my-4" />

            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[14px] font-bold">{cartCopy.summary.totalLabel}</p>
              <p className="tabular text-[24px] font-extrabold leading-none">
                {formatRupiah(total)}
              </p>
            </div>

            <p className="mt-2 text-[12.5px] text-[var(--muted)]">{cartCopy.summary.totalNote}</p>

            <Link href="/checkout" className="btn btn-dark mt-5 w-full">
              {cartCopy.checkoutLabel}
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </Link>

            <Link
              href="/produk"
              className="mt-3 inline-flex h-9 w-full items-center justify-center text-[13.5px] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
            >
              {cartCopy.continueLabel}
            </Link>

            <p className="mt-3 text-[12.5px] leading-relaxed text-[var(--muted)]">{cartCopy.note}</p>
          </aside>
        </div>
      )}
    </div>
  );
}

/** Keranjang kosong: satu kartu, dua langkah berikutnya. */
function KeranjangKosong({ waNumber }: { waNumber?: string }) {
  return (
    <div className="card mt-8 flex flex-col items-center px-6 py-14 text-center">
      <span className="ico-wrap size-12 rounded-2xl bg-[#f1eee7] text-[var(--muted)]">
        <ShoppingCart className="size-5" aria-hidden="true" />
      </span>

      <p className="mt-4 text-[19px] font-extrabold">{cartCopy.empty.title}</p>
      <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-[var(--muted)]">
        {cartCopy.empty.description}
      </p>

      <Link href={cartCopy.empty.action.href} className="btn btn-dark mt-6">
        {cartCopy.empty.action.label}
        <ArrowRight className="size-[18px]" aria-hidden="true" />
      </Link>

      <a
        href={whatsappLink(cartCopy.empty.helpMessage, waNumber)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex h-9 items-center gap-2 text-[13.5px] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
      >
        <WhatsappIcon className="size-4" />
        {cartCopy.empty.helpLabel}
      </a>
    </div>
  );
}

/**
 * Placeholder sebelum localStorage selesai dibaca.
 * Tanpa ini, halaman sempat menampilkan "keranjang kosong" selama satu frame —
 * kesan pertama yang salah untuk orang yang keranjangnya berisi.
 */
function KeranjangMemuat() {
  return (
    <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]" aria-busy="true">
      <div className="flex flex-col gap-4">
        {[0, 1].map((n) => (
          <div key={n} className="card p-4">
            <div className="flex animate-pulse gap-4">
              <div className="size-[76px] shrink-0 rounded-2xl bg-[#f1eee7]" />
              <div className="flex-1 space-y-3 py-2">
                <div className="h-3 w-24 rounded bg-[#f1eee7]" />
                <div className="h-4 w-40 rounded bg-[#f1eee7]" />
                <div className="h-3 w-32 rounded bg-[#f1eee7]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card animate-pulse p-5">
        <div className="h-4 w-24 rounded bg-[#f1eee7]" />
        <div className="mt-5 h-3 w-full rounded bg-[#f1eee7]" />
        <div className="mt-3 h-3 w-2/3 rounded bg-[#f1eee7]" />
        <div className="mt-6 h-12 w-full rounded-full bg-[#f1eee7]" />
      </div>

      <span className="sr-only">Memuat keranjang…</span>
    </div>
  );
}
