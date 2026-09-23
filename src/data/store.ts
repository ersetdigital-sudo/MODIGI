import { BadgeCheck, CreditCard, MessageCircle, ShieldCheck, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { TrustPoint } from "@/types";

/**
 * Nomor WhatsApp toko — format `62…`, tanpa `+` dan tanpa spasi.
 * Semua tombol "Beli Sekarang" / "Tanya" mengarah ke nomor ini.
 * PENTING: ganti nilai ini dengan nomor asli sebelum dipakai jualan.
 */
export const whatsappNumber = "6281234567890";

/** Teks halaman katalog. */
export const catalogCopy = {
  breadcrumb: "Katalog",
  title: "Semua Produk",
  description:
    "Lisensi original untuk website Anda — dari page builder sampai keamanan. Aktivasi instan, update dari dashboard, garansi 100%.",
  searchPlaceholder: "Cari produk…",
  allCategoriesLabel: "Semua",
  emptyText: "Produk tidak ditemukan. Coba kata kunci lain.",
  request: {
    title: "Butuh plugin yang belum ada di katalog?",
    description: "Kirim nama pluginnya, kami cek ketersediaan lisensinya untuk Anda.",
    label: "Tanya via WhatsApp",
    message: "Halo, saya mau tanya ketersediaan lisensi plugin: ",
  },
};

/** Opsi urutan di halaman katalog. */
export const sortOptions = [
  { value: "pop", label: "Terlaris" },
  { value: "rating", label: "Rating tertinggi" },
  { value: "low", label: "Harga terendah" },
  { value: "high", label: "Harga tertinggi" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

/** Label teks untuk kartu statistik + baris versi di halaman detail produk. */
export const productStatsCopy = {
  reviewsSuffix: "ulasan",
  soldLabel: "lisensi terjual",
  activationValue: "< 5 menit",
  activationLabel: "waktu aktivasi",
  versionLabel: "Versi terbaru",
};

/**
 * Poin trust di dalam buy box halaman detail.
 *
 * Formatnya sengaja **judul saja** (tanpa kalimat penjelas) supaya barisnya padat
 * dan cepat dipindai. Kalau nanti butuh penjelasan tambahan, isi `description`
 * pada poin yang bersangkutan — komponennya otomatis menampilkannya.
 */
export const productTrust: TrustPoint[] = [
  { title: "Lisensi original & resmi", icon: BadgeCheck },
  { title: "Instalasi cepat 5–15 menit", icon: Zap },
  { title: "Garansi uang kembali", icon: ShieldCheck },
  { title: "Support 30 hari via WhatsApp", icon: MessageCircle },
];

/** Kartu "Masih ragu?" di kolom kanan halaman detail. */
export const secondOpinion = {
  title: "Masih ragu?",
  description: "Sebutkan website Anda, admin kami pilihkan lisensi yang paling pas — gratis.",
  label: "Konsultasi sekarang →",
  message: "Halo, saya butuh rekomendasi plugin untuk website saya.",
};

/** Blok "Cara pesan" di halaman detail. */
export const orderSteps: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: MessageCircle,
    title: "Klik Beli Sekarang",
    description: "Anda diarahkan ke WhatsApp admin.",
  },
  {
    icon: CreditCard,
    title: "Bayar & kirim domain",
    description: "Transfer bank atau QRIS, lalu sebutkan nama domain.",
  },
  {
    icon: BadgeCheck,
    title: "Lisensi aktif",
    description: "Plugin langsung bisa dipakai dan di-update.",
  },
];

/** Catatan kecil soal pembayaran di buy box. */
export const paymentNote =
  "Transfer bank, QRIS, atau e-wallet. Konfirmasi lewat WhatsApp, lisensi dikirim ke chat yang sama.";

/** Keterangan harga di bawah nominal di buy box. */
export const priceNote = "Sekali bayar untuk 1 domain. Aktif 1 tahun, termasuk update.";

/** Hak cipta di footer halaman katalog & detail. */
export const storeFooterNote = "Semua merek dagang milik pemiliknya masing-masing.";
