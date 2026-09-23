"use client";

import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/components/cart/use-cart";
import { WhatsappIcon } from "@/components/store/whatsapp-icon";
import { PluginBoxArt } from "@/components/ui/plugin-box-art";
import { getCategoryName } from "@/data/categories";
import { cartCopy } from "@/data/store";
import { MAX_QTY } from "@/lib/cart";
import { formatRupiah } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Isi halaman /keranjang.
 *
 * Dipisah dari `page.tsx` supaya halamannya tetap komponen server (metadata,
 * breadcrumb, judul) — hanya bagian yang butuh state yang jadi client.
 */
export function CartView() {
  const { lines, count, total, savings, ready, setQty, remove } = useCart();

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
        <KeranjangKosong />
      ) : (
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
          <ul className="flex flex-col gap-4">
            {lines.map((line) => (
              <li key={line.slug} className="card p-4">
                <div className="flex gap-4">
                  <div className="cover-box size-[76px] shrink-0 rounded-2xl bg-gradient-to-b from-[#fbf9f5] to-[#efeae1] ring-1 ring-black/[0.05]">
                    <PluginBoxArt art={line.product.art} sizes="76px" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                      {getCategoryName(line.product.categorySlug)}
                    </p>

                    <h2 className="mt-1 text-[16.5px] font-bold leading-snug">
                      <Link
                        href={`/produk/${line.slug}`}
                        className="hover:underline focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
                      >
                        {line.product.name}
                      </Link>
                    </h2>

                    <p className="tabular mt-1 flex flex-wrap items-center gap-x-2 text-[13px] text-[var(--muted)]">
                      <span>{formatRupiah(line.product.price)} / lisensi</span>
                      <span className="text-[var(--line)]">·</span>
                      <span>{cartCopy.perItemNote}</span>
                    </p>
                  </div>

                  <p className="tabular hidden shrink-0 text-[17px] font-extrabold sm:block">
                    {formatRupiah(line.subtotal)}
                  </p>
                </div>

                <div className="divider my-4" />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 rounded-full border border-[var(--line)] bg-white p-1">
                      <button
                        type="button"
                        onClick={() => setQty(line.slug, line.qty - 1)}
                        disabled={line.qty <= 1}
                        aria-label={`${cartCopy.decreaseLabel} ${line.product.name}`}
                        className="grid size-8 place-items-center rounded-full text-[var(--ink)] transition hover:bg-[#f1eee7] disabled:opacity-40"
                      >
                        <Minus className="size-4" aria-hidden="true" />
                      </button>

                      <span className="tabular w-9 text-center text-[15px] font-bold">
                        <span className="sr-only">
                          {cartCopy.qtyLabel} {line.product.name}:{" "}
                        </span>
                        {line.qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => setQty(line.slug, line.qty + 1)}
                        disabled={line.qty >= MAX_QTY}
                        aria-label={`${cartCopy.increaseLabel} ${line.product.name}`}
                        className="grid size-8 place-items-center rounded-full text-[var(--ink)] transition hover:bg-[#f1eee7] disabled:opacity-40"
                      >
                        <Plus className="size-4" aria-hidden="true" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(line.slug)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13px] font-semibold text-[var(--muted)] transition-colors hover:text-[#b42318] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      {cartCopy.removeLabel}
                    </button>
                  </div>

                  <p className="tabular text-[17px] font-extrabold sm:hidden">
                    {formatRupiah(line.subtotal)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

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

            <p className="mt-3 text-[12.5px] leading-relaxed text-[var(--muted)]">
              {cartCopy.note}
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}

/** Keranjang kosong: satu kartu, dua langkah berikutnya. */
function KeranjangKosong() {
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
        href={whatsappLink(cartCopy.empty.helpMessage)}
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
