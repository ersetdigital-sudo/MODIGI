"use client";

import { ChevronDown, ExternalLink, QrCode, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  hapusMetodeBayarAction,
  simpanMetodeBayarAction,
  ubahStatusMetodeAction,
} from "@/app/actions/admin";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/buttons";
import { tombol } from "@/components/admin/tombol";
import { Card, EmptyState, Field, Input, Pill, Select, Textarea } from "@/components/admin/ui";
import { metodeKindLabel } from "@/data/store";
import type { BarisMetodeBayar } from "@/lib/supabase";
import type { MetodeBayarKind } from "@/types";
import { cn } from "@/lib/utils";

const jenis = [
  { value: "bank", label: metodeKindLabel.bank },
  { value: "qris", label: metodeKindLabel.qris },
  { value: "ewallet", label: metodeKindLabel.ewallet },
] as const;

type KindBayar = (typeof jenis)[number]["value"];

/** Label jenis dari nilai kolom `kind` (nilai tak dikenal dianggap transfer bank). */
function labelJenis(kind: string) {
  return metodeKindLabel[kind as MetodeBayarKind] ?? "Transfer bank";
}

/**
 * Pengelola metode pembayaran.
 *
 * Isinya yang dilihat pembeli di `/checkout/pembayaran` — jadi ini sumber
 * kebenaran nomor rekening & QRIS. Tiap metode punya `<form>`-nya sendiri, jadi
 * menyimpan satu metode tidak mengirim data metode lain.
 *
 * Tiga hal yang perlu diperhatikan admin:
 * - **Metode yang sudah ada tampil ringkas dulu.** Yang terbuka otomatis hanya
 *   formulir "Tambah metode"; kartu metode lama menampilkan ringkasan apa yang
 *   dilihat pembeli + tombol **Ubah**. Sebelumnya semua formulir terbuka sekaligus,
 *   sehingga daftar rekening jadi dinding input dan mudah salah isi.
 * - **Kolomnya menyesuaikan jenis.** Pilih *QRIS* → yang muncul area unggah gambar
 *   QR (nomor rekening disembunyikan, memang tidak dipakai). Pilih *Transfer bank*
 *   atau *E-wallet* → nomor + atas nama yang muncul, area QRIS tidak ikut tampil.
 *   Metode nonaktif tetap tersimpan: menyembunyikan itu pilihan yang benar saat
 *   rekening sedang bermasalah — tidak perlu dihapus lalu diketik ulang.
 * - **Gambar QRIS diunggah ke Cloudinary** (maks 5 MB), dan berkas lama otomatis
 *   dihapus saat diganti atau saat metodenya pindah ke transfer bank. Tanpa gambar,
 *   halaman pembeli tetap jalan: pembeli diminta menanyakan rinciannya lewat
 *   WhatsApp, bukan diberi QR kosong.
 */
export function PaymentMethodManager({ methods }: { methods: BarisMetodeBayar[] }) {
  return (
    <div className="flex flex-col gap-5">
      <Card
        title="Tambah metode pembayaran"
        description="Muncul di halaman pembayaran pembeli begitu disimpan."
      >
        <FormBayar />
      </Card>

      {methods.length === 0 ? (
        <EmptyState
          title="Belum ada metode pembayaran"
          description="Selama daftar ini kosong, halaman /checkout/pembayaran menampilkan ajakan menghubungi admin — dan pesanan tetap tercatat dari halaman checkout."
        />
      ) : null}

      {methods.map((metode) => (
        <KartuMetode key={metode.id} metode={metode} />
      ))}

      <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-[#6f6f74]">
        <ExternalLink className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        Cek hasilnya di halaman pembeli:{" "}
        <Link href="/checkout/pembayaran" target="_blank" className="font-semibold underline underline-offset-2">
          /checkout/pembayaran
        </Link>{" "}
        — halaman itu mengikuti daftar di atas apa adanya.
      </p>
    </div>
  );
}

/**
 * Satu metode yang sudah ada: ringkasan dulu, formulirnya dibuka kalau perlu.
 *
 * Tombol **Ubah** ada di header bersama tombol tampil/sembunyikan, jadi aksi yang
 * paling sering dipakai tetap satu klik tanpa perlu membuka apa pun.
 */
function KartuMetode({ metode }: { metode: BarisMetodeBayar }) {
  const [terbuka, setTerbuka] = useState(false);

  return (
    <Card
      title={
        <span className="flex flex-wrap items-center gap-2.5">
          {metode.label}
          <Pill tone={metode.is_active ? "hijau" : "netral"}>
            {metode.is_active ? "Tampil" : "Disembunyikan"}
          </Pill>
        </span>
      }
      description={
        metode.kind === "qris"
          ? metode.qr_url
            ? "QRIS dengan gambar — pembeli memindai langsung dari halaman pembayaran."
            : "QRIS tanpa gambar: pembeli diminta menanyakan rinciannya lewat WhatsApp."
          : `${labelJenis(metode.kind)}${
              metode.account_no ? ` · ${metode.account_no}` : " · nomor belum diisi"
            }`
      }
      action={
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTerbuka((lama) => !lama)}
            aria-expanded={terbuka}
            className={tombol.kecil}
          >
            {terbuka ? "Tutup" : "Ubah"}
            <ChevronDown
              className={cn("size-4 transition-transform", terbuka && "rotate-180")}
              aria-hidden="true"
            />
          </button>

          <form action={ubahStatusMetodeAction}>
            <input type="hidden" name="id" value={metode.id} />
            <input type="hidden" name="is_active" value={metode.is_active ? "0" : "1"} />

            <SubmitButton variant="kecil" pendingLabel="Menyimpan…">
              {metode.is_active ? "Sembunyikan" : "Tampilkan"}
            </SubmitButton>
          </form>
        </div>
      }
    >
      {terbuka ? (
        <>
          <FormBayar metode={metode} />

          {/* Form terpisah: menghapus tidak boleh ikut terkirim saat menyimpan. */}
          <form action={hapusMetodeBayarAction} className="mt-5 border-t border-[#f0f0f3] pt-4">
            <input type="hidden" name="id" value={metode.id} />

            <ConfirmSubmit
              message={`Hapus metode “${metode.label}”? Pembeli tidak akan melihatnya lagi di halaman pembayaran.`}
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              Hapus metode
            </ConfirmSubmit>
          </form>
        </>
      ) : (
        <Ringkasan metode={metode} />
      )}
    </Card>
  );
}

/** Ringkasan read-only: persis apa yang dibaca pembeli di halaman pembayaran. */
function Ringkasan({ metode }: { metode: BarisMetodeBayar }) {
  const qris = metode.kind === "qris";

  return (
    <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
      <Baris label="Jenis" nilai={labelJenis(metode.kind)} />

      {qris ? (
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6f6f74]">Gambar QRIS</p>

          {metode.qr_url ? (
            <Image
              src={metode.qr_url}
              alt=""
              width={64}
              height={64}
              unoptimized
              className="mt-1.5 size-16 rounded-lg border border-[#e8e8ec] bg-white object-contain p-1"
            />
          ) : (
            <p className="mt-1.5 flex items-center gap-2 text-[13.5px] font-semibold text-[#8a6100]">
              <QrCode className="size-4 shrink-0" aria-hidden="true" />
              Belum ada gambar
            </p>
          )}
        </div>
      ) : (
        <>
          <Baris
            label={metode.kind === "ewallet" ? "Nomor e-wallet" : "Nomor rekening"}
            nilai={metode.account_no || "belum diisi"}
          />
          <Baris label="Atas nama" nilai={metode.account_name || "belum diisi"} />
        </>
      )}

      {metode.instructions ? <Baris label="Catatan untuk pembeli" nilai={metode.instructions} /> : null}

      <Baris label="Urutan" nilai={String(metode.sort_order)} />
    </div>
  );
}

function Baris({ label, nilai }: { label: string; nilai: string }) {
  return (
    <div className="min-w-0 max-w-md">
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6f6f74]">{label}</p>
      <p className="mt-1 break-words text-[13.5px] font-semibold text-[#151310]">{nilai}</p>
    </div>
  );
}

/**
 * Formulir satu metode — dipakai untuk **tambah** dan **edit**.
 *
 * Urutan field-nya mengikuti cara admin berpikir: jenis dulu (bank/QRIS/e-wallet),
 * lalu apa yang harus ditulis pembeli di aplikasi banknya (nomor + atas nama), baru
 * detail pelengkap. Field yang tidak relevan dengan jenis yang dipilih tidak
 * ditampilkan sama sekali — jadi tidak ada kolom QRIS yang menggantung di metode
 * transfer bank.
 */
function FormBayar({ metode }: { metode?: BarisMetodeBayar }) {
  const [kind, setKind] = useState<KindBayar>((metode?.kind as KindBayar) ?? "bank");

  const kunci = metode?.id ?? "baru";
  const qris = kind === "qris";

  return (
    <form action={simpanMetodeBayarAction} className="grid gap-5 sm:grid-cols-2">
      {metode ? <input type="hidden" name="id" value={metode.id} /> : null}

      {/*
        Metode non-QRIS tidak perlu gambar: kalau sebelumnya pernah QRIS dan
        gambarnya masih tersimpan, tandanya dikirim supaya berkasnya dibuang saat
        menyimpan — bukan menumpuk di Cloudinary sebagai yatim.
      */}
      {qris ? null : <input type="hidden" name="buang_qr" value="1" />}

      <Field
        label="Jenis"
        htmlFor={`jenis-${kunci}`}
        hint="Menentukan kolom mana yang perlu diisi di bawah."
      >
        <Select
          id={`jenis-${kunci}`}
          name="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value as KindBayar)}
        >
          {jenis.map((pilihan) => (
            <option key={pilihan.value} value={pilihan.value}>
              {pilihan.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Nama yang tampil"
        htmlFor={`label-${kunci}`}
        hint="Ditulis seperti yang dicari pembeli, mis. “BCA” atau “QRIS — semua bank”."
        required
      >
        <Input id={`label-${kunci}`} name="label" defaultValue={metode?.label ?? ""} placeholder="BCA" required />
      </Field>

      {qris ? (
        <AreaQris metode={metode} kunci={kunci} />
      ) : (
        <>
          <Field
            label={kind === "ewallet" ? "Nomor e-wallet" : "Nomor rekening"}
            htmlFor={`nomor-${kunci}`}
            hint="Angka saja, tanpa spasi atau tanda hubung."
          >
            <Input
              id={`nomor-${kunci}`}
              name="account_no"
              defaultValue={metode?.account_no ?? ""}
              placeholder="1234567890"
            />
          </Field>

          <Field
            label="Atas nama"
            htmlFor={`nama-${kunci}`}
            hint="Wajib untuk rekening bank — pembeli memakainya untuk memastikan tidak salah kirim."
          >
            <Input
              id={`nama-${kunci}`}
              name="account_name"
              defaultValue={metode?.account_name ?? ""}
              placeholder="PT Modigi Digital"
            />
          </Field>
        </>
      )}

      <Field
        label="Catatan untuk pembeli"
        htmlFor={`catatan-${kunci}`}
        className="sm:col-span-2"
        hint="Opsional. Mis. “Sertakan nomor pesanan di berita transfer”."
      >
        <Textarea
          id={`catatan-${kunci}`}
          name="instructions"
          rows={2}
          defaultValue={metode?.instructions ?? ""}
        />
      </Field>

      <Field label="Urutan" htmlFor={`urutan-${kunci}`} hint="Angka kecil tampil lebih dulu.">
        <Input
          id={`urutan-${kunci}`}
          name="sort_order"
          inputMode="numeric"
          defaultValue={metode?.sort_order ?? 0}
        />
      </Field>

      <div className="flex flex-col justify-end gap-2">
        <label className="flex items-center gap-2.5 text-[13.5px] font-semibold text-[#3a3a3f]">
          <input
            type="checkbox"
            name="is_active"
            value="1"
            defaultChecked={metode ? metode.is_active : true}
            className="size-4 accent-[#151310]"
          />
          Tampilkan di halaman pembayaran
          {/*
            Cadangan untuk saat checkbox-nya TIDAK dicentang: checkbox yang tidak
            dicentang tidak terkirim sama sekali, dan tanpa baris ini server action
            tidak bisa membedakan "disembunyikan" dari "form-nya rusak".
            Urutannya harus SETELAH checkbox: `FormData.get()` mengambil nilai
            pertama, jadi kalau ditaruh di depan, nilainya selalu "0".
          */}
          <input type="hidden" name="is_active" value="0" />
        </label>
      </div>

      <div className="sm:col-span-2">
        <SubmitButton pendingLabel={metode ? "Menyimpan…" : "Menambah…"}>
          {metode ? "Simpan perubahan" : "Tambah metode"}
        </SubmitButton>
      </div>
    </form>
  );
}

/** Area unggah gambar QR — hanya dirender untuk jenis QRIS. */
function AreaQris({ metode, kunci }: { metode?: BarisMetodeBayar; kunci: string }) {
  return (
    <div className="sm:col-span-2">
      <p className="text-[13px] font-semibold text-[#3a3a3f]">
        Gambar QRIS <span className="font-normal text-[#6f6f74]">(opsional)</span>
      </p>

      {metode?.qr_url ? (
        <div className="mt-2.5 flex flex-wrap items-start gap-4">
          <Image
            src={metode.qr_url}
            alt=""
            width={120}
            height={120}
            unoptimized
            className="size-[120px] rounded-xl border border-[#e8e8ec] bg-white object-contain p-1.5"
          />

          <div className="min-w-[12rem]">
            <p className="text-[12.5px] leading-relaxed text-[#6f6f74]">
              Gambar yang sedang tampil di halaman pembayaran. Unggah berkas baru untuk
              menggantinya — berkas lama otomatis dihapus.
            </p>

            <label className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-[#a32b1d]">
              <input type="checkbox" name="buang_qr" value="1" className="size-4 accent-[#a32b1d]" />
              Buang gambar ini saat menyimpan
            </label>
          </div>
        </div>
      ) : (
        <p className="mt-2 flex items-center gap-2 text-[12.5px] text-[#6f6f74]">
          <QrCode className="size-4 shrink-0" aria-hidden="true" />
          Belum ada gambar. Tanpa gambar pun tetap jalan — pembeli diminta menanyakan
          rinciannya lewat WhatsApp.
        </p>
      )}

      <input
        id={`qr-${kunci}`}
        name="qr"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="mt-3 block w-full cursor-pointer rounded-xl border border-[#8a8a90] bg-white px-3.5 py-2.5 text-[13.5px] file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#f1f1f4] file:px-3 file:py-1.5 file:text-[13px] file:font-semibold"
      />

      <p className="mt-1.5 text-[12px] text-[#6f6f74]">
        PNG/JPG/WebP, maksimal 5 MB. Pakai gambar QR asli dari aplikasi bank — bukan foto layar
        yang miring.
      </p>
    </div>
  );
}
