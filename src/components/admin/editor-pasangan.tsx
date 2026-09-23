"use client";

import { Plus, X } from "lucide-react";
import { Fragment, useState } from "react";

import { tombol } from "@/components/admin/tombol";
import { inputClass } from "@/components/admin/ui";

type Baris = { label: string; value: string };

/**
 * Editor dua kolom untuk **Spesifikasi** & **FAQ** produk.
 *
 * Sebelumnya keduanya diedit sebagai teks mentah dengan format `Judul | Isi`, satu
 * baris satu item. Cara itu memang hemat ruang, tapi satu `|` yang salah ketik
 * langsung merusak tabelnya — dan admin baru tahu setelah produknya dibuka pembeli.
 * Sekarang tiap baris punya dua kolomnya sendiri, sama seperti yang tampil di
 * halaman produk (tab Spesifikasi & FAQ), jadi yang dilihat admin = yang dilihat
 * pembeli. Ini juga yang bikin tabel di situs tidak bisa lagi "beda" dari dashboard.
 *
 * Cara nilainya dikirim: dua daftar bernama sama (`specs_label` & `specs_value`),
 * dibaca server action dengan `formData.getAll()`. Urutan `getAll()` mengikuti
 * urutan elemen di DOM, jadi baris ke-n di sini = baris ke-n di halaman produk —
 * tidak perlu penanda indeks yang harus dijaga sendiri.
 */
export function EditorPasangan({
  dasar,
  judulKolom,
  isiKolom,
  contohJudul,
  contohIsi,
  bawaan,
  catatan,
}: {
  /** Awal nama field — menghasilkan `{dasar}_label` dan `{dasar}_value`. */
  dasar: string;
  judulKolom: string;
  isiKolom: string;
  contohJudul?: string;
  contohIsi?: string;
  bawaan: [string, string][];
  /** Keterangan kecil di bawah editor. */
  catatan?: string;
}) {
  // Satu baris kosong selalu tersedia — supaya menambah item pertama tidak perlu
  // menekan "Tambah baris" dulu di formulir produk baru.
  const [baris, setBaris] = useState<Baris[]>(
    bawaan.length > 0 ? bawaan.map(([label, value]) => ({ label, value })) : [{ label: "", value: "" }],
  );

  const ubah = (index: number, kolom: keyof Baris, nilai: string) => {
    setBaris((sebelumnya) =>
      sebelumnya.map((item, i) => (i === index ? { ...item, [kolom]: nilai } : item)),
    );
  };

  const tambah = () => setBaris((sebelumnya) => [...sebelumnya, { label: "", value: "" }]);

  const hapus = (index: number) =>
    setBaris((sebelumnya) => sebelumnya.filter((_, i) => i !== index));

  const adaBarisMenggantung = baris.some((item) => !item.label.trim() && item.value.trim());

  return (
    <div className="flex flex-col gap-2.5">
      {/* Judul kolom: hanya di layar lebar, tempat grid-nya benar-benar 2 kolom. */}
      <div
        aria-hidden="true"
        className="hidden gap-2.5 text-[12px] font-semibold text-[#6f6f74] sm:grid sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_2.25rem]"
      >
        <span>{judulKolom}</span>
        <span>{isiKolom}</span>
        <span />
      </div>

      {baris.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#dcdce2] bg-[#fafafa] px-3.5 py-3 text-[13px] text-[#6f6f74]">
          Belum ada baris. Tekan “Tambah baris” untuk mengisi.
        </p>
      ) : null}

      <div className="grid gap-2.5 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_2.25rem] sm:items-center">
        {baris.map((item, index) => (
          <Fragment key={index}>
            <input
              name={`${dasar}_label`}
              value={item.label}
              onChange={(e) => ubah(index, "label", e.target.value)}
              className={inputClass}
              placeholder={contohJudul}
              aria-label={`${judulKolom} baris ${index + 1}`}
            />

            <input
              name={`${dasar}_value`}
              value={item.value}
              onChange={(e) => ubah(index, "value", e.target.value)}
              className={inputClass}
              placeholder={contohIsi}
              aria-label={`${isiKolom} baris ${index + 1}`}
            />

            <button
              type="button"
              onClick={() => hapus(index)}
              aria-label={`Hapus baris ${index + 1}`}
              title="Hapus baris ini"
              className="inline-flex size-9 shrink-0 items-center justify-center justify-self-end rounded-lg border border-[#e2e2e7] bg-white text-[#6f6f74] transition-colors hover:border-[#f0d5d1] hover:bg-[#fdf4f3] hover:text-[#a32b1d] focus-visible:ring-2 focus-visible:ring-[#151310]/20 focus-visible:outline-none"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </Fragment>
        ))}
      </div>

      <div>
        <button type="button" onClick={tambah} className={tombol.kecil}>
          <Plus className="size-4" aria-hidden="true" />
          Tambah baris
        </button>
      </div>

      {adaBarisMenggantung ? (
        <p className="text-[12px] font-semibold text-[#a32b1d]">
          Ada baris yang isinya diisi tapi judulnya kosong — baris itu tidak akan disimpan.
        </p>
      ) : null}

      {catatan ? <p className="text-[12px] leading-relaxed text-[#6f6f74]">{catatan}</p> : null}
    </div>
  );
}
