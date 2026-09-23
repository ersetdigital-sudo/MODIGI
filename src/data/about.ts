import { BadgeCheck, HandCoins, HeartHandshake, MessagesSquare, RefreshCw, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { TrustPoint } from "@/types";

/**
 * Isi halaman Tentang (/tentang).
 *
 * Aturan menulis di sini (biar konsisten dengan halaman store):
 * - Klaim harus bisa dibuktikan. Jangan tulis angka, sertifikasi, atau
 *   "jaminan" yang belum benar-benar diberlakukan — lebih baik jujur dan
 *   spesifik daripada terdengar besar tapi kosong.
 * - Satu paragraf = satu ide. Kalimat pendek, bahasa yang dipakai pembeli
 *   (plugin, lisensi, domain, update), bukan istilah korporat.
 */

export const aboutHero = {
  eyebrow: "Tentang MODIGI",
  title: "Plugin original, harga yang masuk akal.",
  description:
    "MODIGI menyediakan plugin, tema, dan tools digital original untuk freelancer, agency, dan pemilik bisnis di Indonesia. Pesan lewat WhatsApp, lisensi aktif ke domain Anda, lalu update jalan langsung dari dashboard WordPress.",
  primary: { label: "Jelajahi Katalog", href: "/produk" },
  secondary: {
    label: "Tanya Admin",
    message: "Halo, saya mau tanya-tanya dulu soal produk MODIGI.",
  },
};

/** Cerita singkat — kenapa toko ini ada. Dua paragraf saja. */
export const aboutStory = {
  eyebrow: "Kenapa Kami Ada",
  title: "Lisensi resmi seharusnya tidak bikin mahal website.",
  paragraphs: [
    "Kebanyakan pemilik website di Indonesia bukan perusahaan besar. Ada freelancer yang menggarap lima proyek sendiri, ada agency kecil, ada orang yang baru mulai berjualan online. Harga lisensi resmi yang ditagih per tahun dengan kurs dolar sering jadi penghalang pertama mereka.",
    "MODIGI menjual lisensi original dengan harga rupiah yang bisa dicerna, tanpa perantara dan tanpa biaya tersembunyi. Yang Anda dapat sama: aktivasi resmi di domain Anda, update dari dashboard, dan admin manusia yang membantu kalau ada kendala.",
  ],
};

/** Keunggulan utama — ditulis sebagai manfaat, bukan daftar fitur. */
export const aboutValues: TrustPoint[] = [
  {
    title: "Lisensi original",
    description: "Diaktivasi resmi ke domain Anda, bukan versi nulled.",
    icon: ShieldCheck,
  },
  {
    title: "Update dari dashboard",
    description: "Versi baru muncul di wp-admin, tinggal klik Update.",
    icon: RefreshCw,
  },
  {
    title: "Harga jelas sejak awal",
    description: "Harga yang tertera itu yang dibayar. Tidak ada biaya tersembunyi.",
    icon: HandCoins,
  },
  {
    title: "Admin manusia, bukan bot",
    description: "Sebelum dan sesudah bayar, Anda ngobrol dengan orang yang bisa dipanggil.",
    icon: HeartHandshake,
  },
];

/** Alur kerja, 1-2-3 — sengaja sederhana supaya tidak terasa ribet. */
export const aboutProcess: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: MessagesSquare,
    title: "Ceritakan kebutuhan Anda",
    description: "Chat admin: sebutkan jenis website dan masalah yang mau diselesaikan.",
  },
  {
    icon: BadgeCheck,
    title: "Kami pilihkan lisensinya",
    description: "Diarahkan ke produk yang paling pas — bukan yang paling mahal.",
  },
  {
    icon: RefreshCw,
    title: "Aktif dan jalan",
    description: "Lisensi diaktivasi, plugin dipakai, update langsung dari dashboard.",
  },
];

/** Prinsip kerja yang bisa dipakai pembeli untuk menilai kami. */
export const aboutPrinciples: {
  title: string;
  description: string;
}[] = [
  {
    title: "Harga transparan",
    description: "Harga ada di katalog, bukan hasil tawar-menawar diam-diam.",
  },
  {
    title: "Klaim yang bisa dicek",
    description:
      "Kami tidak menulis \"update seumur hidup\" atau angka pembeli yang dibesar-besarkan.",
  },
  {
    title: "Bantuan sampai beres",
    description:
      "Kalau lisensi gagal aktif, ada yang membantu menyelesaikan — atau uang kembali 100%.",
  },
];

export const aboutCta = {
  eyebrow: "Mulai dari Sini",
  title: "Cari produknya, atau tanya dulu.",
  description:
    "Belum yakin plugin mana yang cocok? Sebutkan jenis website Anda, admin akan bantu pilihkan.",
  primary: { label: "Lihat Katalog", href: "/produk" },
  secondary: {
    label: "Chat Admin",
    message: "Halo, saya butuh rekomendasi produk untuk website saya.",
  },
};

/**
 * Statistik di hero. Nilainya diambil dari `site.ts` (dipakai juga di beranda)
 * supaya angka di dua halaman tidak pernah beda.
 *
 * ⚠️ Ganti dengan angka asli sebelum dipakai jualan.
 */
export { heroStats as aboutStats } from "@/data/site";
