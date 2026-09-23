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

/**
 * Isi keranjang yang disimpan di `localStorage`.
 *
 * Sengaja HANYA slug + jumlah — harga, nama, dan artwork selalu diambil ulang
 * dari `products.ts` saat dibaca. Jadi kalau harga di katalog berubah, isi
 * keranjang yang lama tidak menyimpan harga basi.
 */
export type CartItem = {
  slug: string;
  qty: number;
};

/** Baris keranjang yang sudah dicocokkan dengan data produk. */
export type CartLine = {
  slug: string;
  qty: number;
  product: Product;
  /** `product.price` × `qty`. */
  subtotal: number;
};

/** Baris pesanan (bentuk ringkas, aman disimpan di `localStorage`). */
export type OrderItem = {
  slug: string;
  name: string;
  price: number;
  qty: number;
  subtotal: number;
};

/**
 * Data pemesan — juga dipakai untuk instalasi plugin di website pembeli.
 *
 * SENGAJA TANPA PASSWORD: yang tersimpan di browser tidak boleh memuat kredensial
 * WordPress. Lihat `CheckoutData`. 
 */
export type Customer = {
  name: string;
  whatsapp: string;
  /** Domain WordPress tempat plugin dipasang — 1 lisensi = 1 domain. */
  domain: string;
  /** Username WP-Admin, dipakai admin untuk memasang pluginnya. */
  wpUser: string;
};

/**
 * Isi formulir checkout: data pemesan + password WP-Admin.
 *
 * Password hanya dipakai untuk menyusun pesan WhatsApp dan **tidak pernah
 * disimpan** ke `localStorage` — lihat `createOrder` di `lib/cart.ts`.
 */
export type CheckoutData = Customer & {
  wpPassword: string;
};

/**
 * Pesanan yang tersimpan setelah checkout.
 *
 * Aplikasi ini tidak punya backend: pesanan dicatat di `localStorage` supaya
 * halaman konfirmasi bisa menampilkannya, dan salinan lengkapnya dikirim ke
 * admin lewat WhatsApp (satu-satunya "database" yang benar-benar dipakai).
 */
export type Order = {
  orderNo: string;
  /** ISO string supaya bisa diformat ulang kapan saja. */
  createdAt: string;
  items: OrderItem[];
  /** Data pemesan tanpa password — password hanya ikut ke pesan WhatsApp. */
  customer: Customer;
  /** Total harga jual (setelah diskon). */
  total: number;
  /** Total harga resmi sebelum diskon — dasar info "hemat". */
  compareAtTotal: number;
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

/** Satu blok di dalam dokumen kebijakan. */
export type PolicySection = {
  /** Anchor id — dipakai daftar isi, jadi jangan diubah tanpa mengubah daftarnya. */
  id: string;
  title: string;
  /** Kalimat pembuka section. */
  paragraphs?: string[];
  /** Poin-poin (ditampilkan dengan ikon centang). */
  bullets?: string[];
  /** Catatan yang ditonjolkan — dipakai untuk hal yang paling sering ditanyakan. */
  note?: string;
};

/**
 * Dokumen kebijakan (Syarat & Ketentuan, Privasi, Refund, Lisensi).
 *
 * Semua dokumen memakai satu halaman shell yang sama; yang berbeda hanya isi di
 * sini. `href` juga dipakai oleh link kolom "Kebijakan" di footer, jadi mengubah
 * salah satunya harus mengubah keduanya.
 */
export type PolicyDoc = {
  slug: string;
  href: string;
  /** Judul pendek untuk daftar dokumen & breadcrumb. */
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Tanggal revisi terakhir, mis. "23 September 2026". */
  updated: string;
  /** Perkiraan waktu baca dalam menit. */
  readMinutes: number;
  /** Ringkasan 3 poin di atas — untuk yang cuma mau baca sekilas. */
  tldr: string[];
  sections: PolicySection[];
  icon: LucideIcon;
};
