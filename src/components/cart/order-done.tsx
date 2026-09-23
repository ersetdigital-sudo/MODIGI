"use client";

import { ArrowRight, CheckCircle2, Clock, CreditCard, FileText, Smartphone } from "lucide-react";
import Link from "next/link";

import { useLastOrder, usePaymentChoice } from "@/components/cart/use-cart";
import { WhatsappIcon } from "@/components/store/whatsapp-icon";
import { orderDoneCopy } from "@/data/store";
import { orderMessage } from "@/lib/cart";
import { formatRupiah } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";

const ikonLangkah = [FileText, Smartphone, CheckCircle2];

/**
 * Halaman konfirmasi (/checkout/selesai).
 *
 * Membaca pesanan terakhir dari `localStorage` — sengaja tidak lewat URL, supaya
 * nomor pesanan & data pembeli tidak ikut tercatat di riwayat browser ataupun
 * terkirim sebagai referrer kalau link-nya dibagikan.
 *
 * Dua keadaan yang mungkin: pembeli sudah menekan **Konfirmasi Pembayaran**
 * (pilihannya tersimpan di browser → metode & waktunya ditampilkan), atau belum
 * (ditawari tombol menuju halaman pembayaran). Yang menentukan hanya "apakah
 * pembeli bilang sudah bayar" — verifikasi tetap di admin, bukan di halaman ini.
 */
export function OrderDone() {
  const { order, ready } = useLastOrder();
  const { pilihan } = usePaymentChoice();

  if (!ready) {
    return (
      <div className="card mt-8 h-64 animate-pulse p-6" aria-busy="true">
        <span className="sr-only">Memuat pesanan…</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card mt-8 flex flex-col items-center px-6 py-14 text-center">
        <span className="ico-wrap size-12 rounded-2xl bg-[#f1eee7] text-[var(--muted)]">
          <FileText className="size-5" aria-hidden="true" />
        </span>

        <p className="mt-4 text-[19px] font-extrabold">{orderDoneCopy.missing.title}</p>
        <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-[var(--muted)]">
          {orderDoneCopy.missing.description}
        </p>

        <Link href={orderDoneCopy.missing.action.href} className="btn btn-dark mt-6">
          {orderDoneCopy.missing.action.label}
          <ArrowRight className="size-[18px]" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  const dikirim = new Date(order.createdAt).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const hemat = order.compareAtTotal - order.total;

  // Pilihan pembayaran hanya berlaku untuk pesanan yang sedang ditampilkan.
  const bayar = pilihan && pilihan.orderNo === order.orderNo ? pilihan : null;

  return (
    <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
      <div className="flex flex-col gap-6">
        <section className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="kicker">{orderDoneCopy.orderNoLabel}</p>
              <p className="tabular mt-1.5 text-[24px] font-extrabold tracking-[-0.01em]">
                {order.orderNo}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-[var(--muted)]">
                <Clock className="size-3.5" aria-hidden="true" />
                {orderDoneCopy.createdAtLabel} {dikirim}
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3.5 py-2 text-[12.5px] font-bold text-[var(--accent)]">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              {orderDoneCopy.title}
            </span>
          </div>

          <div className="divider my-5" />

          <h2 className="text-[15px] font-extrabold">{orderDoneCopy.recapTitle}</h2>

          <ul className="mt-3 divide-y divide-[var(--line)]">
            {order.items.map((item) => (
              <li key={item.slug} className="flex items-baseline justify-between gap-4 py-3">
                <span className="min-w-0">
                  <span className="block text-[14.5px] font-bold">{item.name}</span>
                  <span className="tabular block text-[12.5px] text-[var(--muted)]">
                    {item.qty} × {formatRupiah(item.price)}
                  </span>
                </span>
                <span className="tabular shrink-0 text-[14.5px] font-bold">
                  {formatRupiah(item.subtotal)}
                </span>
              </li>
            ))}
          </ul>

          <div className="divider my-4" />

          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="text-[14px] font-bold">Total bayar</span>
            <span className="tabular text-[24px] font-extrabold leading-none">
              {formatRupiah(order.total)}
            </span>
          </div>

          {hemat > 0 && (
            <p className="tabular mt-2 text-[12.5px] text-[var(--accent)]">
              Hemat {formatRupiah(hemat)} dari harga resmi
            </p>
          )}
        </section>

        <section className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-[15px] font-extrabold">
              <CreditCard className="size-4 text-[var(--accent)]" aria-hidden="true" />
              {orderDoneCopy.payment.title}
            </h2>

            <span
              className={
                bayar
                  ? "inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-[12px] font-bold text-[var(--accent)]"
                  : "inline-flex items-center gap-1.5 rounded-full bg-[#f1eee7] px-3 py-1.5 text-[12px] font-bold text-[var(--muted)]"
              }
            >
              {bayar ? orderDoneCopy.payment.paidBadge : orderDoneCopy.payment.unpaidBadge}
            </span>
          </div>

          <p className="mt-3 text-[14px] leading-relaxed text-[var(--muted)]">
            {bayar ? orderDoneCopy.payment.paidNote : orderDoneCopy.payment.unpaidNote}
          </p>

          {bayar ? (
            <dl className="mt-4 grid gap-x-8 gap-y-3 text-[14px] sm:grid-cols-2">
              <Baris label={orderDoneCopy.payment.methodLabel} nilai={bayar.methodLabel} />
              {bayar.reference ? (
                <Baris label={orderDoneCopy.payment.referenceLabel} nilai={bayar.reference} />
              ) : null}
              <Baris
                label={orderDoneCopy.payment.sentAtLabel}
                nilai={new Date(bayar.at).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            </dl>
          ) : null}

          <Link href="/checkout/pembayaran" className="btn btn-ghost mt-4">
            {bayar ? orderDoneCopy.payment.payAgainLabel : orderDoneCopy.payment.payLabel}
            <ArrowRight className="size-[18px]" aria-hidden="true" />
          </Link>
        </section>

        <section className="card p-6">
          <h2 className="text-[15px] font-extrabold">{orderDoneCopy.customerTitle}</h2>

          <dl className="mt-4 grid gap-x-8 gap-y-3 text-[14px] sm:grid-cols-2">
            <Baris label="Nama" nilai={order.customer.name} />
            <Baris label="WhatsApp" nilai={order.customer.whatsapp} />
            <Baris label="Domain WordPress" nilai={order.customer.domain} />
            <Baris label="Username WP-Admin" nilai={order.customer.wpUser} />
          </dl>

          <p className="mt-4 text-[12.5px] leading-relaxed text-[var(--muted)]">
            Password WP-Admin tidak ditampilkan di sini karena tidak disimpan di browser —
            hanya ikut terkirim ke WhatsApp admin untuk proses instalasi.
          </p>
        </section>
      </div>

      <aside className="card p-6 lg:sticky lg:top-[88px]">
        <h2 className="text-[17px] font-extrabold tracking-[-0.01em]">{orderDoneCopy.stepsTitle}</h2>

        <ol className="mt-4 space-y-4">
          {orderDoneCopy.steps.map((langkah, index) => {
            const Icon = ikonLangkah[index] ?? CheckCircle2;

            return (
              <li key={langkah.title} className="flex gap-3">
                <span className="ico-wrap shrink-0 bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14.5px] font-bold">{langkah.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-[var(--muted)]">
                    {langkah.description}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        <a
          className="btn btn-wa mt-5 w-full"
          href={whatsappLink(orderMessage(order))}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsappIcon className="size-[18px]" />
          {orderDoneCopy.waLabel}
        </a>

        <Link
          href="/produk"
          className="mt-3 inline-flex h-9 w-full items-center justify-center text-[13.5px] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
        >
          {orderDoneCopy.catalogLabel}
        </Link>

        <p className="mt-3 text-[12px] leading-relaxed text-[var(--muted)]">{orderDoneCopy.note}</p>
      </aside>
    </div>
  );
}

function Baris({ label, nilai }: { label: string; nilai: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
        {label}
      </dt>
      <dd className="mt-1 break-words font-semibold">{nilai}</dd>
    </div>
  );
}
