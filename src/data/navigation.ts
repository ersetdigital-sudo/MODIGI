import type { FooterColumn, NavItem, SocialLink } from "@/types";

/** Navigasi utama di header. */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Produk",
    href: "/produk",
    children: [
      {
        label: "Semua Produk",
        href: "/produk",
        description: "Seluruh plugin, tema, dan tools digital",
      },
      {
        label: "Produk Terlaris",
        href: "/produk?urut=terlaris",
        description: "Paling banyak dipakai pelanggan",
      },
      {
        label: "Produk Baru",
        href: "/produk?urut=terbaru",
        description: "Baru rilis dalam 30 hari terakhir",
      },
      {
        label: "Bundle Hemat",
        href: "/produk?tipe=bundle",
        description: "Paket produk dengan harga lebih hemat",
      },
    ],
  },
  {
    label: "Kategori",
    href: "/kategori",
    children: [
      { label: "Page Builder", href: "/produk?kategori=page-builder" },
      { label: "SEO Tools", href: "/produk?kategori=seo-tools" },
      { label: "Performance", href: "/produk?kategori=performance" },
      { label: "Security", href: "/produk?kategori=security" },
      { label: "WooCommerce", href: "/produk?kategori=woocommerce" },
      { label: "Tema", href: "/produk?kategori=tema" },
      { label: "Utility", href: "/produk?kategori=utility" },
    ],
  },
  { label: "Support", href: "/bantuan" },
  { label: "Tentang", href: "/tentang" },
];

/** Kolom-kolom link di footer. */
export const footerColumns: FooterColumn[] = [
  {
    title: "Produk",
    links: [
      { label: "Semua Produk", href: "/produk" },
      { label: "Kategori", href: "/kategori" },
      { label: "Produk Terlaris", href: "/produk?urut=terlaris" },
      { label: "Produk Baru", href: "/produk?urut=terbaru" },
    ],
  },
  {
    // Semua link ini menuju section di halaman /bantuan (bukan route terpisah),
    // jadi tidak ada tautan mati.
    title: "Bantuan",
    links: [
      { label: "Cara Order", href: "/bantuan#cara-order" },
      { label: "Aktivasi Lisensi", href: "/bantuan#aktivasi" },
      { label: "Pertanyaan Umum", href: "/bantuan#faq" },
      { label: "Hubungi Kami", href: "/bantuan#kontak" },
    ],
  },
  {
    // Cuma berisi halaman yang benar-benar ada. "Blog" dan "Status Layanan"
    // dibuang karena belum punya isinya — lebih baik tidak ada link sama sekali
    // daripada link yang berakhir di 404.
    title: "Informasi",
    links: [
      { label: "Tentang MODIGI", href: "/tentang" },
      { label: "Testimoni Pembeli", href: "/testimoni" },
    ],
  },
  {
    title: "Kebijakan",
    links: [
      { label: "Syarat & Ketentuan", href: "/kebijakan/syarat-ketentuan" },
      { label: "Kebijakan Privasi", href: "/kebijakan/privasi" },
      { label: "Refund & Garansi", href: "/kebijakan/refund" },
      { label: "Lisensi Produk", href: "/kebijakan/lisensi" },
    ],
  },
];

/** Social media di footer. Tambahkan platform baru di sini + di SocialIcon. */
export const socialLinks: SocialLink[] = [
  { key: "youtube", label: "YouTube", href: "https://youtube.com" },
  { key: "instagram", label: "Instagram", href: "https://instagram.com" },
  { key: "tiktok", label: "TikTok", href: "https://tiktok.com" },
  { key: "x", label: "X", href: "https://x.com" },
];
