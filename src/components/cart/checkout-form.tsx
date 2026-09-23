"use client";

import { ArrowRight, BadgeCheck, Lock, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { useCart } from "@/components/cart/use-cart";
import { PluginBoxArt } from "@/components/ui/plugin-box-art";
import { checkoutCopy, paymentNote } from "@/data/store";
import { createOrder, orderMessage, writeLastOrder } from "@/lib/cart";
import { formatRupiah } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";

const kosong = { name: "", whatsapp: "", email: "", domain: "", note: "" };

/**
 * Formulir checkout.
 *
 * Karena tidak ada backend, "mengirim pesanan" berarti dua hal sekaligus:
 * 1. salinan pesanan disimpan di `localStorage` supaya halaman konfirmasi bisa
 *    menampilkannya, dan
 * 2. ringkasannya dibuka di WhatsApp admin — jalur yang benar-benar dipakai
 *    untuk konfirmasi pembayaran saat ini.
 *
 * Validasi memakai validasi bawaan browser (`required`, `pattern`, `type`): pesan
 * errornya sudah diterjemahkan browser, sudah terhubung ke field-nya, dan tetap
 * jalan kalau JavaScript dimatikan sebagian.
 */
export function CheckoutForm() {
  const { lines, count, total, savings, ready, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState(kosong);
  const [mengirim, setMengirim] = useState(false);

  const ubah = (nama: keyof typeof kosong) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((sebelumnya) => ({ ...sebelumnya, [nama]: e.target.value }));
  };

  const kirim = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mengirim) return;

    setMengirim(true);

    const order = createOrder(
      {
        name: form.name.trim(),
        whatsapp: form.whatsapp.trim(),
        email: form.email.trim(),
        domain: form.domain.trim(),
        note: form.note.trim() || undefined,
      },
      lines,
    );

    writeLastOrder(order);
    clear();

    // Buka WhatsApp lebih dulu (masih di dalam gestur klik pengguna, jadi tidak
    // diblokir), baru pindah ke halaman konfirmasi.
    window.open(whatsappLink(orderMessage(order)), "_blank", "noopener,noreferrer");
    router.push("/checkout/selesai");
  };

  if (!ready) {
    return (
      <div className="mt-8 grid animate-pulse items-start gap-8 lg:grid-cols-[1.35fr_1fr]" aria-busy="true">
        <div className="card h-80 p-6" />
        <div className="card h-64 p-6" />
        <span className="sr-only">Memuat keranjang…</span>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="card mt-8 flex flex-col items-center px-6 py-14 text-center">
        <span className="ico-wrap size-12 rounded-2xl bg-[#f1eee7] text-[var(--muted)]">
          <ShoppingCart className="size-5" aria-hidden="true" />
        </span>

        <p className="mt-4 text-[19px] font-extrabold">{checkoutCopy.empty.title}</p>
        <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-[var(--muted)]">
          {checkoutCopy.empty.description}
        </p>

        <Link href={checkoutCopy.empty.action.href} className="btn btn-dark mt-6">
          {checkoutCopy.empty.action.label}
          <ArrowRight className="size-[18px]" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
      <form onSubmit={kirim} className="card p-6" aria-labelledby="judul-data-pembeli">
        <h2 id="judul-data-pembeli" className="text-[18px] font-extrabold tracking-[-0.01em]">
          {checkoutCopy.formTitle}
        </h2>

        <div className="mt-5 flex flex-col gap-5">
          <Field id="nama" label={checkoutCopy.fields.name.label}>
            <input
              id="nama"
              name="nama"
              className="input"
              placeholder={checkoutCopy.fields.name.placeholder}
              autoComplete="name"
              value={form.name}
              onChange={ubah("name")}
              required
            />
          </Field>

          <Field
            id="whatsapp"
            label={checkoutCopy.fields.whatsapp.label}
            hint={checkoutCopy.fields.whatsapp.hint}
          >
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              inputMode="tel"
              className="input"
              placeholder={checkoutCopy.fields.whatsapp.placeholder}
              autoComplete="tel"
              value={form.whatsapp}
              onChange={ubah("whatsapp")}
              pattern="^(\+?62|0)[0-9\s-]{8,15}$"
              title="Contoh: 08123456789 atau +628123456789"
              required
            />
          </Field>

          <Field
            id="email"
            label={checkoutCopy.fields.email.label}
            hint={checkoutCopy.fields.email.hint}
          >
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              placeholder={checkoutCopy.fields.email.placeholder}
              autoComplete="email"
              value={form.email}
              onChange={ubah("email")}
            />
          </Field>

          <Field
            id="domain"
            label={checkoutCopy.fields.domain.label}
            hint={checkoutCopy.fields.domain.hint}
          >
            <input
              id="domain"
              name="domain"
              className="input"
              placeholder={checkoutCopy.fields.domain.placeholder}
              autoComplete="url"
              value={form.domain}
              onChange={ubah("domain")}
              pattern="^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+$"
              title="Contoh: namadomain.com"
              required
            />
          </Field>

          <Field id="catatan" label={checkoutCopy.fields.note.label}>
            <textarea
              id="catatan"
              name="catatan"
              rows={3}
              className="input resize-y"
              placeholder={checkoutCopy.fields.note.placeholder}
              value={form.note}
              onChange={ubah("note")}
            />
          </Field>
        </div>

        <div className="divider my-6" />

        <label className="flex items-start gap-3 text-[13.5px] leading-relaxed">
          <input
            type="checkbox"
            name="setuju"
            className="mt-0.5 size-[18px] shrink-0 accent-[var(--accent)]"
            required
          />
          <span>
            {checkoutCopy.agreementLead}{" "}
            {checkoutCopy.agreementLinks.map((link, index) => (
              <span key={link.href}>
                {index > 0 && " & "}
                <Link
                  href={link.href}
                  target="_blank"
                  className="font-bold text-[var(--accent)] hover:underline"
                >
                  {link.label}
                </Link>
              </span>
            ))}{" "}
            {checkoutCopy.agreementSuffix}
          </span>
        </label>

        <button type="submit" className="btn btn-wa mt-5 w-full" disabled={mengirim}>
          {mengirim ? "Mengirim…" : checkoutCopy.submitLabel}
          <ArrowRight className="size-[18px]" aria-hidden="true" />
        </button>

        <p className="mt-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-[var(--muted)]">
          <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {checkoutCopy.submitHint}
        </p>

        <Link
          href="/keranjang"
          className="mt-4 inline-flex h-9 items-center text-[13.5px] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
        >
          {checkoutCopy.backToCart}
        </Link>
      </form>

      <aside className="card p-5 lg:sticky lg:top-[88px]">
        <h2 className="text-[17px] font-extrabold tracking-[-0.01em]">
          {checkoutCopy.summaryTitle}
        </h2>

        <ul className="mt-4 flex flex-col gap-3.5">
          {lines.map((line) => (
            <li key={line.slug} className="flex gap-3">
              <div className="cover-box size-11 shrink-0 rounded-xl bg-gradient-to-b from-[#fbf9f5] to-[#efeae1] ring-1 ring-black/[0.05]">
                <PluginBoxArt art={line.product.art} sizes="44px" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold leading-snug">{line.product.name}</p>
                <p className="tabular text-[12.5px] text-[var(--muted)]">
                  {line.qty} × {formatRupiah(line.product.price)}
                </p>
              </div>

              <p className="tabular shrink-0 text-[14px] font-bold">{formatRupiah(line.subtotal)}</p>
            </li>
          ))}
        </ul>

        <div className="divider my-4" />

        <dl className="space-y-2.5 text-[14px]">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-[var(--muted)]">Lisensi</dt>
            <dd className="tabular font-semibold">{count}</dd>
          </div>

          {savings > 0 && (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[var(--muted)]">Hemat</dt>
              <dd className="tabular font-semibold text-[var(--accent)]">
                −{formatRupiah(savings)}
              </dd>
            </div>
          )}
        </dl>

        <div className="divider my-4" />

        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[14px] font-bold">Total bayar</p>
          <p className="tabular text-[24px] font-extrabold leading-none">{formatRupiah(total)}</p>
        </div>

        <p className="mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-[var(--muted)]">
          <BadgeCheck className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
          {paymentNote}
        </p>
      </aside>
    </div>
  );
}

/** Satu baris field: label + kontrol + petunjuk kecil di bawahnya. */
function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="hint">
          {hint}
        </p>
      )}
    </div>
  );
}
