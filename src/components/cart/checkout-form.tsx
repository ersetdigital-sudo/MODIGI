"use client";

import { ArrowRight, Eye, EyeOff, ShieldCheck, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { buatPesananAction } from "@/app/actions/pesanan";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { useCart } from "@/components/cart/use-cart";
import { cartCopy, checkoutCopy } from "@/data/store";
import { createOrder, simpanPasswordInstalasi, writeLastOrder } from "@/lib/cart";
import { formatRupiah } from "@/lib/format";

const kosong = { name: "", whatsapp: "", domain: "", wpUser: "", wpPassword: "" };

const FORM_ID = "form-checkout";

/**
 * Formulir checkout — "Data Instalasi".
 *
 * Fieldnya sengaja sesedikit mungkin: nama, WhatsApp, domain, dan kredensial
 * WP-Admin yang dipakai admin untuk memasang pluginnya. Datanya langsung ikut ke
 * pesan WhatsApp, jadi admin tidak perlu menanyakan ulang lewat chat.
 *
 * ⚠️ Soal password: yang tersimpan di `localStorage` **tidak memuat password**
 * (lihat `createOrder` di `lib/cart.ts`). Password hanya ada di memori form dan
 * dipindahkan ke memori tab (`simpanPasswordInstalasi`) supaya ikut terkirim saat
 * pembeli menekan Konfirmasi Pembayaran di halaman berikutnya.
 *
 * Tombol "Buat Pesanan" berada di kartu ringkasan (kanan) tapi men-submit formulir
 * di kartu kiri lewat atribut `form` — jadi di layar lebar orang melihat totalnya
 * persis di sebelah tombolnya.
 *
 * Setelah pesanan dibuat, pembeli langsung diarahkan ke `/checkout/pembayaran`
 * (pilih cara bayar + konfirmasi). **Tidak ada WhatsApp yang dibuka di sini**:
 * pesanan lengkap — termasuk akses login WP-Admin — baru dikirim saat pembeli
 * menekan Konfirmasi Pembayaran, jadi admin menerima satu pesan utuh lengkap
 * dengan bukti pembayarannya, bukan dua pesan yang harus digabung sendiri.
 */
export function CheckoutForm() {
  const { lines, count, total, savings, ready, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState(kosong);
  const [lihatPassword, setLihatPassword] = useState(false);
  const [mengirim, setMengirim] = useState(false);

  const ubah =
    (nama: keyof typeof kosong) =>
    (e: ChangeEvent<HTMLInputElement>) => {
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
        domain: form.domain.trim(),
        wpUser: form.wpUser.trim(),
      },
      lines,
    );

    writeLastOrder(order);
    clear();

    // Password dipindahkan ke memori tab (bukan localStorage) supaya halaman
    // pembayaran bisa mengirimkannya bersama konfirmasi pembayaran.
    simpanPasswordInstalasi(form.wpPassword);
    setForm({ ...kosong });

    router.push("/checkout/pembayaran");

    // Pesanan juga dicatat ke database supaya bisa dikelola di dashboard admin
    // (status, data instalasi, pembayaran). Sengaja TIDAK ditunggu: pembeli tidak
    // boleh gagal checkout hanya karena penyimpanan di server bermasalah — nomor
    // pesanannya sudah ada di browser, dan konfirmasi pembayarannya tetap bisa
    // dikirim dari halaman berikutnya walau baris database-nya gagal dibuat.
    buatPesananAction({
      orderNo: order.orderNo,
      customer: order.customer,
      items: order.items,
      total: order.total,
      compareAtTotal: order.compareAtTotal,
    }).catch(() => {
      // Diamkan: halaman konfirmasi tetap menampilkan pesanannya dari localStorage.
    });
  };

  /*
   * `mengirim` ikut menahan tampilan, dan itu bukan hiasan: begitu "Buat Pesanan"
   * ditekan, keranjang memang langsung dikosongkan (isinya sudah jadi pesanan).
   * Tanpa penjagaan ini, komponen sempat ter-render dengan keranjang kosong
   * sebelum halaman pembayaran muncul — pembeli melihat "keranjang Anda kosong"
   * padahal pesanannya baru saja dibuat. Jadi selama perpindahan, yang tampil
   * skeleton, bukan keadaan kosong.
   */
  if (!ready || mengirim) {
    return (
      <div className="mt-8 grid animate-pulse items-start gap-8 lg:grid-cols-[1.35fr_1fr]" aria-busy="true">
        <div className="card h-96 p-6" />
        <div className="card h-72 p-6" />
        <span className="sr-only">{mengirim ? "Menyiapkan halaman pembayaran…" : "Memuat keranjang…"}</span>
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
      <form id={FORM_ID} onSubmit={kirim} className="card p-6">
        <h2 className="text-[19px] font-extrabold tracking-[-0.01em]">{checkoutCopy.formTitle}</h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--muted)]">
          {checkoutCopy.formDescription}
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
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
          </div>

          <div className="sm:col-span-2">
            <Field id="whatsapp" label={checkoutCopy.fields.whatsapp.label}>
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
          </div>

          <div className="sm:col-span-2">
            <Field id="domain" label={checkoutCopy.fields.domain.label}>
              <input
                id="domain"
                name="domain"
                className="input"
                placeholder={checkoutCopy.fields.domain.placeholder}
                autoComplete="url"
                value={form.domain}
                onChange={ubah("domain")}
                pattern="^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+$"
                title="Contoh: contoh.com"
                required
              />
            </Field>
          </div>

          <Field id="wp-user" label={checkoutCopy.fields.wpUser.label}>
            <input
              id="wp-user"
              name="wp-user"
              className="input"
              placeholder={checkoutCopy.fields.wpUser.placeholder}
              autoComplete="username"
              value={form.wpUser}
              onChange={ubah("wpUser")}
              required
            />
          </Field>

          <Field id="wp-password" label={checkoutCopy.fields.wpPassword.label}>
            <div className="relative">
              <input
                id="wp-password"
                name="wp-password"
                type={lihatPassword ? "text" : "password"}
                className="input pr-20"
                placeholder={checkoutCopy.fields.wpPassword.placeholder}
                autoComplete="current-password"
                value={form.wpPassword}
                onChange={ubah("wpPassword")}
                required
              />

              {/* Toggle "Lihat" — supaya salah ketik password ketahuan sebelum dikirim. */}
              <button
                type="button"
                onClick={() => setLihatPassword((lihat) => !lihat)}
                aria-pressed={lihatPassword}
                aria-controls="wp-password"
                className="absolute right-2 top-1/2 inline-flex h-8 -translate-y-1/2 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
              >
                {lihatPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
                {lihatPassword ? checkoutCopy.hidePassword : checkoutCopy.showPassword}
              </button>
            </div>
          </Field>
        </div>

        <p className="mt-5 flex items-start gap-2.5 rounded-xl bg-[var(--accent-soft)] px-4 py-3 text-[12.5px] leading-relaxed text-[var(--ink)]">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
          {checkoutCopy.passwordNote}
        </p>
      </form>

      <aside className="card p-5 lg:sticky lg:top-[88px]">
        <h2 className="text-[17px] font-extrabold tracking-[-0.01em]">
          {checkoutCopy.summaryTitle}
        </h2>

        <ul className="mt-4 flex flex-col gap-3.5">
          {lines.map((line) => (
            <li key={line.slug} className="border-b border-[var(--line)] pb-3.5 last:border-0 last:pb-0">
              <CartItemRow line={line} />
            </li>
          ))}
        </ul>

        <div className="divider my-4" />

        <dl className="space-y-2.5 text-[14px]">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-[var(--muted)]">{checkoutCopy.totalItemLabel}</dt>
            <dd className="tabular font-semibold">
              {count} {checkoutCopy.itemSuffix}
            </dd>
          </div>

          {savings > 0 && (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[var(--muted)]">{cartCopy.summary.savingsLabel}</dt>
              <dd className="tabular font-semibold text-[var(--accent)]">
                −{formatRupiah(savings)}
              </dd>
            </div>
          )}

          <div className="flex items-baseline justify-between gap-4">
            <dt className="font-bold">{checkoutCopy.totalPriceLabel}</dt>
            <dd className="tabular text-[22px] font-extrabold leading-none text-[var(--accent)]">
              {formatRupiah(total)}
            </dd>
          </div>
        </dl>

        <button type="submit" form={FORM_ID} className="btn btn-dark mt-5 w-full" disabled={mengirim}>
          {mengirim ? "Membuat pesanan…" : checkoutCopy.submitLabel}
        </button>

        <p className="mt-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-[var(--muted)]">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {checkoutCopy.submitNote}
        </p>

        <p className="mt-4 text-[12px] leading-relaxed text-[var(--muted)]">
          {checkoutCopy.policyNote.lead}{" "}
          {checkoutCopy.policyNote.links.map((link, index) => (
            <span key={link.href}>
              {index > 0 && " & "}
              <Link href={link.href} target="_blank" className="font-semibold text-[var(--accent)] hover:underline">
                {link.label}
              </Link>
            </span>
          ))}{" "}
          {checkoutCopy.policyNote.suffix}
        </p>

        <Link
          href="/keranjang"
          className="mt-3 inline-flex h-9 items-center text-[13px] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
        >
          {checkoutCopy.backToCart}
        </Link>
      </aside>
    </div>
  );
}

/** Satu baris field: label + kontrol. */
function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="field-label">
        {label} <span className="text-[var(--accent)]">*</span>
      </label>
      {children}
    </div>
  );
}
