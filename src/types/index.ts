import type { StaticImageData } from "next/image";
import type { LucideIcon } from "lucide-react";

/** Item navigasi (mendukung submenu opsional untuk dropdown). */
export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

/**
 * Deskripsi artwork box produk.
 *
 * Template box-nya satu (`<PluginBoxArt />`); yang berbeda antar produk hanya
 * logo, nama, dan warna brand di bawah ini. Isi `image` kalau nanti mau pakai
 * file artwork jadi (mis. hasil render 1600×1600) — komponen otomatis memakainya.
 */
export type ProductArt = {
  /** Teks singkat di badan box, mis. "Elementor Pro". */
  label: string;
  /** Warna gradient muka box (warna terang). */
  from: string;
  /** Warna gradient muka box (warna gelap). */
  to: string;
  /** Warna teks label (opsional; default ditentukan otomatis dari `tone`). */
  textClassName?: string;
  /**
   * Gambar produk jadi (foto/artwork dari vendor atau desainer).
   * Kalau diisi, `PluginBoxArt` memakai gambar ini dan TIDAK menggambar box-
   * Jadi cukup hapus isinya untuk kembali ke box 3D berlogo resmi.
   */
  image?: StaticImageData | string;
  /**
   * Logo resmi brand dari `src/assets/brands/`, dipakai APA ADANYA di muka box
   * (tidak di-recolor maupun dibuat ulang).
   */
  logo?: StaticImageData | string;
  /**
   * Permukaan box. `light` (default) untuk logo yang berwarna gelap,
   * `dark` untuk logo yang terang — dipilih supaya logonya tetap kontras.
   */
  tone?: "light" | "dark";
  /** Warna aksen (sisi + bibir box). Default mengikuti `to`. */
  accent?: string;
};

/** Satu baris tabel spesifikasi: `[label, nilai]`. */
export type ProductSpec = [label: string, value: string];

/** Satu item FAQ: `[pertanyaan, jawaban]`. */
export type ProductFaq = [question: string, answer: string];

export type Product = {
  slug: string;
  name: string;
  categorySlug: string;
  /** Kalimat singkat yang tampil di bawah judul halaman detail. */
  tagline: string;
  price: number;
  /** Harga resmi sebelum diskon — dipakai untuk harga coret + badge diskon. */
  compareAt: number;
  rating: number;
  /** Jumlah ulasan (angka mentah, diformat di komponen). */
  reviews: number;
  /** Jumlah lisensi terjual — dasar urutan "Terlaris" di katalog. */
  sold: number;
  /** Versi produk yang dijual, mis. "3.25.x". */
  version: string;
  /** Tanggal update terakhir (sudah diformat, mis. "12 Sep 2026"). */
  updated: string;
  /** Poin fitur utama (tab "Fitur" di halaman detail). */
  highlights: string[];
  /** Paragraf deskripsi (tab "Deskripsi"). */
  description: string;
  /** Tabel spesifikasi lisensi (tab "Spesifikasi"). */
  specs: ProductSpec[];
  /** FAQ produk (tab "FAQ"). */
  faq: ProductFaq[];
  /** Testimoni pembeli. */
  testimonial: { text: string; by: string };
  art: ProductArt;
};

/** Satu ulasan pembeli di halaman detail produk. */
export type ProductReview = {
  name: string;
  /** Keterangan profesi pembeli, mis. "Web Freelancer". */
  role?: string;
  /** 1–5. */
  rating: number;
  /** Tanggal sudah diformat, mis. "12 Sep 2026". */
  date: string;
  text: string;
  /** Pembelian terverifikasi (lisensi benar-benar diaktivasi). */
  verified?: boolean;
};

/** Sebaran rating dalam persen; total kelima nilai = 100. */
export type RatingBreakdown = {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
};

/** Poin keunggulan yang tampil di baris trust di bawah daftar produk. */
export type TrustPoint = {
  title: string;
  /** Kalimat penjelas. Opsional — kalau dikosongkan, hanya judulnya yang tampil. */
  description?: string;
  icon: LucideIcon;
};

/** Statistik singkat di hero. */
export type Stat = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};

/** Platform social media yang didukung <SocialIcon />. */
export type SocialKey = "youtube" | "instagram" | "tiktok" | "x";

export type SocialLink = {
  key: SocialKey;
  label: string;
  href: string;
};
