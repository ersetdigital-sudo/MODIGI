"use client";

import {
  ArrowRight,
  Check,
  Copy,
  Landmark,
  QrCode,
  ShieldCheck,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLastOrder, usePasswordInstalasi, usePaymentChoice } from "@/components/cart/use-cart";
import { WhatsappIcon } from "@/components/store/whatsapp-icon";
import { checkoutCopy, metodeKindLabel, paymentCopy } from "@/data/store";
import { paymentConfirmMessage, writePaymentChoice } from "@/lib/cart";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import type { MetodeBayar, MetodeBayarKind, PaymentChoice } from "@/types";

/** Ikon per jenis cara bayar. */
const ikonMetode: Record<MetodeBayarKind, typeof Landmark> = {
  bank: Landmark,
  qris: QrCode,
  ewallet: Wallet,
};

/**
 * Langkah pembayaran — isi halaman `/checkout/pembayaran`.
 *
 * Alurnya: pembeli memilih satu cara bayar → rinciannya (nomor rekening atau
 * gambar QRIS) tampil di bawahnya → ia membayar → menekan **Konfirmasi
 * Pembayaran**, yang membuka WhatsApp admin dengan ringkasan lengkap. Jadi pembeli
 * tidak perlu mengetik apa pun ke chat, dan admin menerima **satu** pesan berisi
 * semuanya: cara bayar, nominal, keterangan pengirim, rincian item, dan data
 * instalasi termasuk username + password WP-Admin (dari `paymentConfirmMessage`).
 *
 * Soal password: nilainya datang dari memori tab yang diisi halaman checkout
 * (`simpanPasswordInstalasi`), jadi tidak pernah ditulis ke browser. Karena memori
 * itu hilang kalau halaman dimuat ulang, field passwordnya **muncul sendiri** di
 * kartu ringkasan begitu memorinya kosong — pembeli mengisinya sekali lagi di
 * sini, dan admin tetap menerima kredensialnya bareng konfirmasi pembayaran.
 *
 * Kenapa halaman, bukan modal: nomor rekening perlu dibaca dengan tenang dan
 * sering dipindah ke aplikasi bank — modal yang menutup halaman justru menyulitkan
 * (apalagi di ponsel, tempat aplikasi bank berada di layar lain).
 *
 * Catatan: yang disimpan di browser hanya **pilihannya** (`writePaymentChoice`),
 * bukan bukti pembayaran. Bukti yang sah tetap catatan admin di dashboard.
 */
export function PaymentStep({ methods, waNumber }: { methods: MetodeBayar[]; waNumber?: string }) {
  const { order, ready } = useLastOrder();
  const { pilihan: tersimpan } = usePaymentChoice();
  const passwordTab = usePasswordInstalasi();
  const router = useRouter();

  const [dipilih, setDipilih] = useState<string | null>(null);
  const [referensi, setReferensi] = useState("");
  const [referensiDisentuh, setReferensiDisentuh] = useState(false);
  const [tersalin, setTersalin] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordKosong, setPasswordKosong] = useState(false);

  /*
   * Field password hanya perlu muncul kalau memori tab sudah tidak memegangnya —
   * mis. pembeli memuat ulang halaman ini sebelum menekan konfirmasi. Syarat
   * `ready` membuat field ini tidak pernah ikut ter-render di server (di sana
   * `passwordTab` selalu kosong), jadi HTML awal dan render pertama di browser sama.
   */
  const perluPassword = ready && !passwordTab;

  /**
   * Pilihan sebelumnya hanya dipakai kalau pesanannya memang pesanan yang sedang
   * dibuka — supaya nomor pesanan lama tidak menempel di pesanan berikutnya.
   */
  const pilihanLama =
    tersimpan && order && tersimpan.orderNo === order.orderNo ? tersimpan : null;

  const aktifId = dipilih ?? pilihanLama?.methodId ?? methods[0]?.id ?? null;
  const aktif = methods.find((metode) => metode.id === aktifId);
  const nilaiReferensi = referensiDisentuh ? referensi : (pilihanLama?.reference ?? "");

  // Timer umpan balik "Tersalin" dibersihkan saat komponen dilepas.
  const timerSalin = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timerSalin.current) clearTimeout(timerSalin.current);
    },
    [],
  );

  const salin = useCallback(
    async (teks: string, penanda: string) => {
      try {
        await navigator.clipboard.writeText(teks);
      } catch {
        // Clipboard bisa diblokir (izin ditolak / bukan https). Teksnya tetap
        // terlihat di layar, jadi pembeli masih bisa menyalin manual.
        return;
      }

      setTersalin(penanda);
      if (timerSalin.current) clearTimeout(timerSalin.current);
      timerSalin.current = setTimeout(() => setTersalin(null), 1800);
    },
    [],
  );

  const konfirmasi = () => {
    if (!order) return;

    // Isian di layar menang atas memori tab: kalau field-nya tampil (memori
    // kosong), yang dipakai adalah apa yang baru saja diketik pembeli.
    const passwordFinal = password.trim() || passwordTab;

    if (!passwordFinal) {
      setPasswordKosong(true);
      return;
    }

    setPasswordKosong(false);

    const pilihan: PaymentChoice = {
      orderNo: order.orderNo,
      methodId: aktif?.id ?? "",
      methodLabel: aktif?.label ?? paymentCopy.noMethodLabel,
      methodKind: aktif?.kind ?? "bank",
      reference: nilaiReferensi.trim(),
      at: new Date().toISOString(),
    };

    writePaymentChoice(pilihan);

    // Buka WhatsApp dulu (masih di dalam gestur klik, jadi tidak diblokir browser),
    // baru pindah ke halaman konfirmasi.
    window.open(
      whatsappLink(paymentConfirmMessage(order, pilihan, aktif, passwordFinal), waNumber),
      "_blank",
      "noopener,noreferrer",
    );
    router.push("/checkout/selesai");
  };

  if (!ready) {
    return (
      <div className="mt-8 grid animate-pulse items-start gap-8 lg:grid-cols-[1.35fr_1fr]" aria-busy="true">
        <div className="card h-[26rem] p-6" />
        <div className="card h-80 p-6" />
        <span className="sr-only">Memuat pesanan…</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card mt-8 flex flex-col items-center px-6 py-14 text-center">
        <span className="ico-wrap size-12 rounded-2xl bg-[#f1eee7] text-[var(--muted)]">
          <ShoppingCart className="size-5" aria-hidden="true" />
        </span>

        <p className="mt-4 text-[19px] font-extrabold">{paymentCopy.missing.title}</p>
        <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-[var(--muted)]">
          {paymentCopy.missing.description}
        </p>

        <Link href={paymentCopy.missing.action.href} className="btn btn-dark mt-6">
          {paymentCopy.missing.action.label}
          <ArrowRight className="size-[18px]" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  const hemat = order.compareAtTotal - order.total;

  return (
    <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
      <div className="flex flex-col gap-6">
        <Progress />

        <section className="card p-6">
          <h2 className="text-[19px] font-extrabold tracking-[-0.01em]">
            {paymentCopy.methodTitle}
          </h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--muted)]">
            {paymentCopy.methodDescription}
          </p>

          {methods.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-[var(--line)] bg-[#faf8f4] p-5">
              <p className="text-[14.5px] font-extrabold">{paymentCopy.emptyMethods.title}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--muted)]">
                {paymentCopy.emptyMethods.description}
              </p>
            </div>
          ) : (
            <>
              {/* Radio asli (disembunyikan secara visual) — bukan tombol ber-role,
                  supaya navigasi panah keyboard jalan bawaan browser. */}
              <div
                role="radiogroup"
                aria-label={paymentCopy.methodTitle}
                className="mt-5 flex flex-col gap-3"
              >
                {methods.map((metode) => {
                  const Icon = ikonMetode[metode.kind];
                  const ini = metode.id === aktifId;

                  return (
                    <label
                      key={metode.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3.5 rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--accent)] has-[:focus-visible]:ring-offset-2",
                        ini
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                          : "border-[var(--line)] bg-white hover:border-[var(--muted)]",
                      )}
                    >
                      <input
                        type="radio"
                        name="metode-bayar"
                        value={metode.id}
                        checked={ini}
                        onChange={() => setDipilih(metode.id)}
                        className="sr-only"
                      />

                      <span
                        className={cn(
                          "ico-wrap",
                          ini ? "bg-[var(--accent)] text-white" : "bg-[#f1eee7] text-[var(--ink)]",
                        )}
                      >
                        <Icon className="size-[18px]" aria-hidden="true" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-extrabold">{metode.label}</span>
                        <span className="block text-[12.5px] text-[var(--muted)]">
                          {metodeKindLabel[metode.kind]}
                        </span>
                      </span>

                      <span
                        aria-hidden="true"
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-full border",
                          ini
                            ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                            : "border-[var(--line)]",
                        )}
                      >
                        {ini ? <Check className="size-3.5" /> : null}
                      </span>
                    </label>
                  );
                })}
              </div>

              {aktif ? (
                <Detail
                  metode={aktif}
                  tersalin={tersalin}
                  salin={salin}
                  nominal={order.total}
                  orderNo={order.orderNo}
                />
              ) : null}
            </>
          )}
        </section>

        <section className="card p-6">
          <label htmlFor="referensi" className="field-label">
            {paymentCopy.referenceLabel}{" "}
            <span className="font-semibold text-[var(--muted)]">
              ({paymentCopy.referenceOptional})
            </span>
          </label>

          <input
            id="referensi"
            name="referensi"
            className="input mt-2"
            placeholder={paymentCopy.referencePlaceholder}
            maxLength={80}
            value={nilaiReferensi}
            onChange={(e) => {
              setReferensiDisentuh(true);
              setReferensi(e.target.value);
            }}
          />

          <p className="hint mt-2">{paymentCopy.referenceHint}</p>
        </section>
      </div>

      <aside className="card p-5 lg:sticky lg:top-[88px]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="kicker">{paymentCopy.orderNoLabel}</p>
            <p className="tabular mt-1 text-[17px] font-extrabold tracking-[-0.01em]">
              {order.orderNo}
            </p>
          </div>

          <button
            type="button"
            onClick={() => salin(order.orderNo, "nomor")}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
          >
            {tersalin === "nomor" ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
            {tersalin === "nomor" ? paymentCopy.copiedLabel : paymentCopy.copyLabel}
          </button>
        </div>

        <div className="divider my-4" />

        <h2 className="text-[17px] font-extrabold tracking-[-0.01em]">{paymentCopy.recapTitle}</h2>

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

        <dl className="space-y-2.5 text-[14px]">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-[var(--muted)]">{paymentCopy.totalItemLabel}</dt>
            <dd className="tabular font-semibold">
              {order.items.reduce((jumlah, item) => jumlah + item.qty, 0)}{" "}
              {paymentCopy.recapItemSuffix}
            </dd>
          </div>

          {hemat > 0 && (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[var(--muted)]">Hemat</dt>
              <dd className="tabular font-semibold text-[var(--accent)]">
                −{formatRupiah(hemat)}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[#faf8f4] p-4">
          <p className="kicker">{paymentCopy.totalLabel}</p>
          <p className="tabular mt-1.5 text-[26px] font-extrabold leading-none tracking-[-0.02em]">
            {formatRupiah(order.total)}
          </p>

          <button
            type="button"
            onClick={() => salin(String(order.total), "nominal")}
            className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-xl border border-[var(--line)] bg-white px-3 text-[12.5px] font-semibold transition-colors hover:border-[var(--muted)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
          >
            {tersalin === "nominal" ? (
              <Check className="size-3.5 text-[var(--accent)]" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
            {tersalin === "nominal" ? paymentCopy.copiedLabel : paymentCopy.copyTotalLabel}
          </button>
        </div>

        {perluPassword ? (
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[#faf8f4] p-4">
            <label htmlFor="wp-password-bayar" className="field-label">
              {paymentCopy.passwordLabel}
            </label>

            <input
              id="wp-password-bayar"
              className="input mt-2"
              type="password"
              autoComplete="current-password"
              placeholder={checkoutCopy.fields.wpPassword.placeholder}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordKosong(false);
              }}
            />

            <p className="hint mt-2">{paymentCopy.passwordHint}</p>

            {passwordKosong ? (
              <p className="mt-2 text-[12.5px] font-semibold text-[#a32b1d]">
                {paymentCopy.passwordMissing}
              </p>
            ) : null}
          </div>
        ) : null}

        <button type="button" onClick={konfirmasi} className="btn btn-wa mt-5 w-full">
          <WhatsappIcon className="size-[18px]" />
          {paymentCopy.confirmLabel}
        </button>

        <p className="mt-3 flex items-start gap-2 text-[12.5px] leading-relaxed text-[var(--muted)]">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {paymentCopy.confirmNote}
        </p>

        <p className="mt-3 text-[12px] leading-relaxed text-[var(--muted)]">
          {paymentCopy.confirmReminder}
        </p>

        <Link
          href="/checkout"
          className="mt-3 inline-flex h-9 items-center text-[13px] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
        >
          {paymentCopy.backToCheckout}
        </Link>
      </aside>
    </div>
  );
}

/** Penanda posisi: data instalasi → pembayaran → lisensi aktif. */
function Progress() {
  const { steps, active } = paymentCopy.progress;

  return (
    <ol className="grid grid-cols-3 gap-2.5">
      {steps.map((langkah, index) => {
        const selesai = index < active;
        const sekarang = index === active;

        return (
          <li
            key={langkah}
            aria-current={sekarang ? "step" : undefined}
            className={cn(
              "rounded-2xl border px-3 py-3",
              sekarang ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--line)] bg-white",
            )}
          >
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full text-[11px] font-bold",
                selesai
                  ? "bg-[var(--accent)] text-white"
                  : sekarang
                    ? "bg-[var(--ink)] text-white"
                    : "bg-[#f1eee7] text-[var(--muted)]",
              )}
            >
              {selesai ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
            </span>
            <span
              className={cn(
                "mt-2 block text-[12.5px] font-bold leading-tight",
                sekarang ? "text-[var(--ink)]" : "text-[var(--muted)]",
              )}
            >
              {langkah}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Rincian cara bayar yang sedang dipilih: rekening, atau gambar QRIS. */
function Detail({
  metode,
  tersalin,
  salin,
  nominal,
  orderNo,
}: {
  metode: MetodeBayar;
  tersalin: string | null;
  salin: (teks: string, penanda: string) => void;
  nominal: number;
  orderNo: string;
}) {
  if (metode.kind === "qris") {
    return (
      <div className="mt-5 flex flex-col items-center rounded-2xl border border-[var(--line)] bg-[#faf8f4] p-5 text-center">
        {metode.qrUrl ? (
          <>
            <div className="rounded-2xl border border-[var(--line)] bg-white p-3">
              {/*
                QR harus tetap tajam, jadi gambarnya diserve apa adanya
                (`unoptimized`) — resampling next/image bisa membuat polanya kabur.
              */}
              <Image
                src={metode.qrUrl}
                alt={`Kode QRIS ${metode.label} untuk pembayaran ${orderNo}`}
                width={260}
                height={260}
                unoptimized
                className="size-[220px] object-contain sm:size-[260px]"
              />
            </div>

            <p className="tabular mt-4 text-[15px] font-extrabold">{formatRupiah(nominal)}</p>

            <a
              href={metode.qrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-[12.5px] font-semibold text-[var(--accent)] hover:underline"
            >
              Buka gambar QRIS ukuran penuh
            </a>
          </>
        ) : (
          <p className="text-[13.5px] leading-relaxed text-[var(--muted)]">{paymentCopy.qrisMissing}</p>
        )}

        {metode.instructions ? (
          <p className="mt-4 text-[13px] leading-relaxed text-[var(--muted)]">{metode.instructions}</p>
        ) : null}

        <p className="mt-3 text-[13px] leading-relaxed text-[var(--muted)]">{paymentCopy.qrisHint}</p>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[#faf8f4] p-5">
      <p className="kicker">
        {metode.kind === "ewallet" ? paymentCopy.ewalletAccountLabel : paymentCopy.accountLabel}
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p className="tabular text-[20px] font-extrabold tracking-[0.04em]">
          {metode.accountNo || "—"}
        </p>

        {metode.accountNo ? (
          <button
            type="button"
            onClick={() => salin(metode.accountNo, "rekening")}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[var(--line)] bg-white px-3 text-[12.5px] font-semibold transition-colors hover:border-[var(--muted)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
          >
            {tersalin === "rekening" ? (
              <Check className="size-3.5 text-[var(--accent)]" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
            {tersalin === "rekening" ? paymentCopy.copiedLabel : paymentCopy.copyLabel}
          </button>
        ) : null}
      </div>

      {metode.accountName ? (
        <p className="mt-3 text-[13.5px] text-[var(--muted)]">
          {paymentCopy.holderLabel}: <span className="font-bold text-[var(--ink)]">{metode.accountName}</span>
        </p>
      ) : null}

      {metode.instructions ? (
        <p className="mt-3 text-[13px] leading-relaxed text-[var(--muted)]">{metode.instructions}</p>
      ) : null}

      <p className="tabular mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-[var(--line)] pt-4 text-[13.5px] text-[var(--muted)]">
        <span>{paymentCopy.totalLabel}:</span>
        <span className="font-extrabold text-[var(--ink)]">{formatRupiah(nominal)}</span>
        <span className="text-[12.5px]">· {orderNo}</span>
      </p>
    </div>
  );
}
