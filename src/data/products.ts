import elementorLogo from "@/assets/brands/elementor-lockup.svg";
import essentialAddonsLogo from "@/assets/brands/essential-addons.svg";
import rankMathLogo from "@/assets/brands/rank-math-icon.svg";
import wordfenceLogo from "@/assets/brands/wordfence-icon.svg";
import wpRocketLogo from "@/assets/brands/wp-rocket-black.svg";
import rankMathPhoto from "@/assets/products/rankmath-pro.png";
import wpRocketPhoto from "@/assets/products/wp-rocket.png";
import type { Product } from "@/types";

/**
 * Katalog produk.
 *
 * Isi teks (tagline, deskripsi, spesifikasi, FAQ, testimoni) diambil dari template
 * HTML `katalog-plugin-wordpress/assets/products.js`, sedangkan logo brand di
 * `art.logo` tetap dari kanal resmi vendornya masing-masing dan dipakai APA ADANYA —
 * tidak di-recolor, tidak dibuat ulang, bukan dari marketplace pihak ketiga:
 * - Elementor        → elementor.com/logos/
 * - WP Rocket        → wp-rocket.me/press/ (press kit resmi)
 * - Essential Addons → essential-addons.com
 * - Rank Math        → ikon resmi plugin di direktori WordPress.org (di-upload vendor)
 * - Wordfence        → ikon resmi plugin di direktori WordPress.org (di-upload vendor)
 *
 * Bentuk box, sudut kamera, pencahayaan, bayangan, dan komposisi digambar oleh
 * <PluginBoxArt /> dengan SATU template yang sama. Per produk hanya logo, `label`,
 * dan warna brand (`from`/`to`/`accent`) yang berubah — jadi produk berikutnya
 * tinggal tambah entri di sini dan hasilnya otomatis konsisten.
 *
 * `tone` dipilih supaya logo resminya tetap kontras di muka box: `dark` untuk logo
 * terang (Elementor memakai wordmark putih), `light` untuk logo berwarna gelap.
 *
 * Foto produk: WP Rocket dan RankMath memakai file gambar dari folder
 * `katalog-plugin-wordpress/images/` (aset yang dipakai template HTML) lewat
 * `art.image`. Kalau `art.image` dihapus, kartunya otomatis kembali memakai box 3D
 * berlogo resmi — tidak ada yang perlu diubah di komponen.
 */
export const products: Product[] = [
  {
    slug: "elementor-pro",
    name: "Elementor Pro",
    categorySlug: "page-builder",
    tagline: "Bangun halaman WordPress apa pun tanpa koding, drag & drop sepenuhnya.",
    price: 50_000,
    compareAt: 1_899_000,
    rating: 4.9,
    reviews: 2100,
    sold: 3120,
    version: "3.25.x",
    updated: "12 Sep 2026",
    highlights: [
      "100+ widget Pro: form, slider, mega menu, popup builder",
      "Theme Builder: header, footer, single post, archive",
      "WooCommerce Builder untuk halaman produk custom",
      "300+ template siap pakai & global styling",
    ],
    description:
      "Elementor Pro adalah page builder paling populer di dunia dengan lebih dari 10 juta pengguna aktif. Versi Pro membuka Theme Builder, Popup Builder, form builder dengan integrasi email marketing, serta widget dinamis yang menarik data langsung dari custom field. Cocok untuk freelancer, agency, maupun pemilik bisnis yang ingin website profesional tanpa menyentuh satu baris kode.",
    specs: [
      ["Jenis lisensi", "Original, aktivasi resmi"],
      ["Masa aktif", "1 tahun update, support 30 hari"],
      ["Jumlah situs", "1 domain (bisa upgrade)"],
      ["Kompatibilitas", "WordPress 6.0+ / PHP 7.4+"],
      ["Pengiriman", "Otomatis, maksimal 5 menit"],
    ],
    faq: [
      [
        "Apakah ini lisensi original?",
        "Ya. Semua produk kami adalah lisensi resmi yang diaktivasi ke domain Anda, bukan versi nulled atau crack.",
      ],
      [
        "Berapa lama proses aktivasi?",
        "Rata-rata di bawah 5 menit setelah pembayaran terkonfirmasi, 24 jam setiap hari.",
      ],
      [
        "Apakah dapat update otomatis?",
        "Ya, update tersedia langsung dari dashboard WordPress selama masa lisensi aktif.",
      ],
      [
        "Bagaimana jika gagal aktivasi?",
        "Tim kami membantu sampai berhasil. Bila tetap gagal, dana dikembalikan 100%.",
      ],
    ],
    testimonial: {
      text: "Aktivasi cuma 3 menit dan langsung bisa update dari dashboard. Sudah beli 4 lisensi buat klien.",
      by: "Rangga P. — Web Freelancer",
    },
    art: {
      label: "Elementor Pro",
      from: "#2A0B1E",
      to: "#0B0B0C",
      accent: "#ED01EE",
      tone: "dark",
      logo: elementorLogo,
    },
  },
  {
    slug: "rankmath-pro",
    name: "RankMath Pro",
    categorySlug: "seo-tools",
    tagline: "Optimasi SEO on-page otomatis dengan analisis 40+ faktor peringkat.",
    price: 45_000,
    compareAt: 1_299_000,
    rating: 4.8,
    reviews: 1300,
    sold: 2480,
    version: "3.0.x",
    updated: "08 Sep 2026",
    highlights: [
      "Analisis SEO 40+ faktor per halaman",
      "Schema markup lengkap (20+ tipe rich snippet)",
      "Integrasi Google Analytics & Search Console",
      "Redirection, 404 monitor, dan sitemap otomatis",
    ],
    description:
      "RankMath Pro menggabungkan semua kebutuhan SEO dalam satu plugin ringan: riset kata kunci, schema generator, tracking peringkat, hingga SEO khusus WooCommerce. Modul dapat dinyalakan satu per satu sehingga website tetap cepat, dan wizard setup-nya memandu Anda dari nol tanpa perlu keahlian teknis.",
    specs: [
      ["Jenis lisensi", "Original, aktivasi resmi"],
      ["Masa aktif", "1 tahun update, support 30 hari"],
      ["Jumlah situs", "1 domain"],
      ["Kompatibilitas", "WordPress 5.6+ / PHP 7.4+"],
      ["Pengiriman", "Otomatis, maksimal 5 menit"],
    ],
    faq: [
      [
        "Bisa migrasi dari Yoast?",
        "Bisa. RankMath punya importer sekali klik yang memindahkan seluruh pengaturan dan meta dari Yoast atau All in One SEO.",
      ],
      [
        "Apakah memberatkan website?",
        "Tidak. Anda bisa mematikan modul yang tak dipakai sehingga plugin tetap ringan.",
      ],
      ["Dapat update otomatis?", "Ya, selama lisensi aktif."],
      ["Ada garansi?", "Garansi aktivasi 100% atau uang kembali."],
    ],
    testimonial: {
      text: "Trafik organik naik pelan-pelan setelah benerin schema pakai RankMath. Harganya nggak masuk akal murahnya.",
      by: "Dina S. — Owner Toko Online",
    },
    art: {
      label: "RankMath Pro",
      from: "#FFFFFF",
      to: "#F0EAFB",
      accent: "#6B48AE",
      logo: rankMathLogo,
      image: rankMathPhoto,
    },
  },
  {
    slug: "wp-rocket",
    name: "WP Rocket",
    categorySlug: "performance",
    tagline: "Plugin cache premium: website ngebut tanpa setting ribet.",
    price: 45_000,
    compareAt: 899_000,
    rating: 4.7,
    reviews: 983,
    sold: 1890,
    version: "3.17.x",
    updated: "02 Sep 2026",
    highlights: [
      "Page caching & preload aktif otomatis setelah instal",
      "Lazy load gambar, iframe, dan video",
      "Minify + delay JavaScript untuk skor Core Web Vitals",
      "Optimasi database dan CDN ready",
    ],
    description:
      "WP Rocket adalah plugin optimasi kecepatan yang langsung bekerja begitu diaktifkan: 80% praktik terbaik caching diterapkan otomatis. Fitur delay JS dan Remove Unused CSS terbukti mengangkat skor LCP dan INP di PageSpeed Insights, tanpa perlu konfigurasi teknis yang rumit seperti plugin cache gratisan.",
    specs: [
      ["Jenis lisensi", "Original, aktivasi resmi"],
      ["Masa aktif", "1 tahun update, support 30 hari"],
      ["Jumlah situs", "1 domain"],
      ["Kompatibilitas", "WordPress 5.8+ / PHP 7.4+"],
      ["Pengiriman", "Otomatis, maksimal 5 menit"],
    ],
    faq: [
      [
        "Bentrok dengan plugin cache lain?",
        "Nonaktifkan plugin cache lama sebelum mengaktifkan WP Rocket agar tidak bentrok.",
      ],
      [
        "Perlu setting khusus?",
        "Tidak wajib. Setelah aktif, caching langsung jalan. Optimasi lanjutan opsional.",
      ],
      ["Cocok untuk hosting shared?", "Sangat cocok, justru paling terasa di hosting shared."],
      ["Ada garansi?", "Garansi aktivasi 100% atau uang kembali."],
    ],
    testimonial: {
      text: "PageSpeed mobile naik dari 42 ke 88 cuma dengan aktifin delay JS. Worth banget.",
      by: "Faisal A. — Blogger",
    },
    art: {
      label: "WP Rocket",
      from: "#FFFFFF",
      to: "#F7F1E9",
      accent: "#F56F46",
      logo: wpRocketLogo,
      image: wpRocketPhoto,
    },
  },
  {
    slug: "wordfence-premium",
    name: "Wordfence Premium",
    categorySlug: "security",
    tagline: "Firewall & malware scanner real-time untuk WordPress Anda.",
    price: 45_000,
    compareAt: 1_599_000,
    rating: 4.8,
    reviews: 745,
    sold: 1260,
    version: "8.0.x",
    updated: "15 Sep 2026",
    highlights: [
      "Firewall dengan rules real-time (versi gratis delay 30 hari)",
      "Malware signature terbaru & scan terjadwal",
      "Blokir IP negara tertentu dan brute force protection",
      "Two-factor authentication untuk semua user",
    ],
    description:
      "Wordfence Premium melindungi website dari serangan yang paling sering menimpa WordPress: brute force login, injeksi malware lewat plugin bajakan, dan eksploitasi celah plugin. Versi Premium memberi Anda aturan firewall dan signature malware secara real-time, bukan menunggu 30 hari seperti versi gratis, plus reputation check dan blokir berdasarkan negara.",
    specs: [
      ["Jenis lisensi", "Original, aktivasi resmi"],
      ["Masa aktif", "1 tahun update, support 30 hari"],
      ["Jumlah situs", "1 domain"],
      ["Kompatibilitas", "WordPress 5.6+ / PHP 7.4+"],
      ["Pengiriman", "Otomatis, maksimal 5 menit"],
    ],
    faq: [
      [
        "Beda dengan versi gratis?",
        "Versi Premium menerima aturan firewall dan signature malware secara real-time, gratis tertunda 30 hari.",
      ],
      [
        "Memberatkan server?",
        "Scan bisa dijadwalkan di jam sepi agar tidak mengganggu performa.",
      ],
      ["Bisa dipakai di multisite?", "Bisa, dengan lisensi yang sesuai. Hubungi kami sebelum membeli."],
      ["Ada garansi?", "Garansi aktivasi 100% atau uang kembali."],
    ],
    testimonial: {
      text: "Website klien sempat kena malware, setelah pakai Wordfence Premium clean dan aman sampai sekarang.",
      by: "Yoga H. — IT Support",
    },
    art: {
      label: "Wordfence Premium",
      from: "#FFFFFF",
      to: "#EAF3FA",
      accent: "#218DC1",
      logo: wordfenceLogo,
    },
  },
  {
    slug: "essential-addons-pro",
    name: "Essential Addons Pro",
    categorySlug: "utility",
    tagline: "100+ widget tambahan untuk Elementor, langsung pakai.",
    price: 49_000,
    compareAt: 749_000,
    rating: 4.8,
    reviews: 612,
    sold: 980,
    version: "6.0.x",
    updated: "10 Sep 2026",
    highlights: [
      "100+ widget & 3.000+ blok siap pakai",
      "Widget WooCommerce, filter produk, dan advanced data table",
      "Efek interaktif: parallax, tooltip, particle, reveal",
      "Ringan — muat hanya widget yang dipakai",
    ],
    description:
      "Essential Addons Pro adalah koleksi widget Elementor terlengkap dengan lebih dari 2 juta pemasangan aktif. Dari advanced data table, product grid WooCommerce, hingga login/register form dan efek interaktif, semuanya bisa diaktifkan per widget sehingga halaman tetap ringan.",
    specs: [
      ["Jenis lisensi", "Original, aktivasi resmi"],
      ["Masa aktif", "1 tahun update, support 30 hari"],
      ["Jumlah situs", "1 domain"],
      ["Kompatibilitas", "Elementor 3.5+ / WordPress 5.8+"],
      ["Pengiriman", "Otomatis, maksimal 5 menit"],
    ],
    faq: [
      [
        "Butuh Elementor Pro?",
        "Tidak wajib. Essential Addons bekerja dengan Elementor gratis, tapi paling maksimal dipadukan dengan Elementor Pro.",
      ],
      [
        "Apakah memberatkan?",
        "Tidak, widget bisa dinyalakan satu per satu sesuai kebutuhan.",
      ],
      ["Dapat update otomatis?", "Ya, selama lisensi aktif."],
      ["Ada garansi?", "Garansi aktivasi 100% atau uang kembali."],
    ],
    testimonial: {
      text: "Hemat waktu banget, nggak perlu install 5 plugin berbeda buat widget yang beda-beda.",
      by: "Melati R. — Agency Owner",
    },
    art: {
      label: "Essential Addons Pro",
      from: "#FFFFFF",
      to: "#F1EDFF",
      accent: "#6F0AF2",
      logo: essentialAddonsLogo,
    },
  },
];

/** Produk unggulan untuk section "Produk Terlaris" di homepage. */
export const trendingProducts = products.slice(0, 5);

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

/** Persentase diskon dari `compareAt` (mis. 50000 dari 1899000 → 97). */
export function discountPercent(product: Product) {
  return Math.round((1 - product.price / product.compareAt) * 100);
}

/** Filter sederhana untuk halaman katalog (query `q` dan `kategori`). */
export function filterProducts({ q, kategori }: { q?: string; kategori?: string }) {
  const keyword = q?.trim().toLowerCase();

  return products.filter((product) => {
    const matchKeyword =
      !keyword ||
      product.name.toLowerCase().includes(keyword) ||
      product.categorySlug.toLowerCase().includes(keyword);

    const matchCategory = !kategori || product.categorySlug === kategori;

    return matchKeyword && matchCategory;
  });
}
