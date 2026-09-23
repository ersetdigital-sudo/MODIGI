import {
  BadgeCheck,
  Boxes,
  Headphones,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import type { Stat, TrustPoint } from "@/types";

export const siteConfig = {
  name: "MODIGI",
  subName: "Digital Products",
  tagline: "Tools for a Better Tomorrow",
  description:
    "Menyediakan plugin, tema, dan tools digital original untuk website yang lebih baik.",
  footerNote: "More Digital Possibilities",
  cartCount: 0,
};

/** Statistik singkat di bawah kolom pencarian hero. */
export const heroStats: Stat[] = [
  { value: "120+", label: "Produk Digital", icon: Boxes },
  { value: "10K+", label: "Pelanggan", icon: Users },
  { value: "100%", label: "Lisensi Original", icon: ShieldCheck },
  { value: "24/7", label: "Support", icon: Headphones },
];

/** Kata kunci populer di bawah kolom pencarian. */
export const popularSearches = ["Elementor", "RankMath", "WP Rocket", "WooCommerce", "ACF"];

/**
 * Sapaan kecil di atas judul hero — hanya tampil di layar kecil (mobile shell).
 * Di desktop baris ini digantikan oleh eyebrow "Plugin Original, Website Lebih Maju".
 */
export const heroGreeting = "Selamat datang,";

/**
 * Kartu kode promo yang tampil di mobile (di atas daftar produk).
 * Isinya placeholder — ganti nilainya di sini, kartunya ikut otomatis.
 */
export const promoCode = {
  title: "Promo Spesial",
  code: "MODIGI10",
  discount: "Diskon 10%",
  minSpend: "Min. belanja Rp150.000",
};

/** Poin keunggulan di bawah daftar produk terlaris. */
export const trustPoints: TrustPoint[] = [
  {
    title: "Lisensi Original",
    description: "Aman dan terpercaya",
    icon: ShieldCheck,
  },
  {
    title: "Aktivasi Cepat",
    description: "Proses mudah dan instan",
    icon: Zap,
  },
  {
    title: "Update Produk",
    description: "Selalu versi terbaru",
    icon: RefreshCw,
  },
  {
    title: "Bantuan Profesional",
    description: "Siap membantu kapan saja",
    icon: Headphones,
  },
];

/** Konten banner ajakan di atas footer. */
export const ctaBanner = {
  eyebrow: "Mulai Sekarang",
  title: "Bangun Website Terbaik dengan Produk Original.",
  description: "Temukan plugin, tema, dan tools digital yang Anda butuhkan sekarang.",
  action: { label: "Cari Produk", href: "/produk" },
  sideNote: ["Lebih", "Banyak", "Possibilitas", "untuk Anda"],
};

/** Section header "Produk Terlaris" — dipakai juga di halaman katalog. */
export const trendingSection = {
  eyebrow: "Produk Terlaris",
  title: "Produk Pilihan untuk Website Anda",
  action: { label: "Lihat Semua Produk", href: "/produk" },
};

/** Ikon badge "Original" pada kartu produk. */
export const verifiedIcon = BadgeCheck;

/** Ikon panah tren, dipakai sebagai aksen pada label kategori trending. */
export const trendingIcon = TrendingUp;
