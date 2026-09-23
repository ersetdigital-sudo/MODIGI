import { BadgeCheck, CreditCard, MessageCircle, ShieldCheck, ShoppingCart, Zap } from "lucide-react";
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
    icon: ShoppingCart,
    title: "Klik Beli Sekarang",
    description: "Produk masuk keranjang, lalu Anda mengisi data pesanan.",
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

// ---------------------------------------------------------------------------
// Keranjang → Checkout → Konfirmasi
// ---------------------------------------------------------------------------

/** Teks halaman keranjang (/keranjang). */
export const cartCopy = {
  breadcrumb: "Keranjang",
  title: "Keranjang Anda",
  description:
    "Satu lisensi untuk satu domain. Periksa produk dan jumlahnya dulu sebelum lanjut ke checkout.",
  empty: {
    title: "Keranjang masih kosong",
    description:
      "Belum ada produk yang dipilih. Buka katalog, lalu tekan “Tambah ke Keranjang” pada produk yang Anda butuhkan.",
    action: { label: "Lihat Katalog", href: "/produk" },
    helpLabel: "Belum tahu butuh yang mana?",
    helpMessage: "Halo, saya belum tahu plugin apa yang saya butuhkan untuk website saya.",
  },
  perItemNote: "1 lisensi = 1 domain",
  qtyLabel: "Jumlah lisensi",
  decreaseLabel: "Kurangi jumlah",
  increaseLabel: "Tambah jumlah",
  removeLabel: "Hapus dari keranjang",
  summary: {
    title: "Ringkasan",
    countLabel: "Lisensi",
    savingsLabel: "Hemat",
    totalLabel: "Total bayar",
    totalNote: "Sudah termasuk diskon — tanpa biaya tersembunyi.",
  },
  checkoutLabel: "Lanjut ke Checkout",
  continueLabel: "Lanjut belanja",
  note: "Langkah berikutnya: isi data pesanan, lalu kirim ringkasannya ke WhatsApp admin.",
};

/** Teks halaman checkout (/checkout). */
export const checkoutCopy = {
  breadcrumb: "Checkout",
  title: "Data pesanan",
  description:
    "Isi data di bawah, lalu kirim pesanan ke WhatsApp admin. Kami balas dengan rincian pembayaran.",
  formTitle: "Data pembeli",
  fields: {
    name: { label: "Nama lengkap", placeholder: "Nama Anda" },
    whatsapp: {
      label: "Nomor WhatsApp",
      placeholder: "08xx xxxx xxxx",
      hint: "Rincian pembayaran dan lisensi dikirim ke nomor ini.",
    },
    email: {
      label: "Email (opsional)",
      placeholder: "nama@email.com",
      hint: "Dipakai untuk arsip lisensi Anda.",
    },
    domain: {
      label: "Domain website",
      placeholder: "namadomain.com",
      hint: "1 lisensi = 1 domain. Belum ada domain? Tulis rencana domainnya.",
    },
    note: {
      label: "Catatan (opsional)",
      placeholder: "Mis. minta sekalian dipasangkan, atau nomor invoice berbeda.",
    },
  },
  agreementLead: "Saya sudah membaca dan setuju dengan",
  agreementLinks: [
    { label: "Lisensi Produk", href: "/kebijakan/lisensi" },
    { label: "Syarat & Ketentuan", href: "/kebijakan/syarat-ketentuan" },
  ],
  agreementSuffix: "termasuk aturan satu lisensi untuk satu domain.",
  submitLabel: "Kirim Pesanan ke WhatsApp",
  submitHint:
    "Setelah terkirim, Anda menerima rincian pembayaran (transfer bank atau QRIS) di chat yang sama.",
  backToCart: "Kembali ke keranjang",
  empty: {
    title: "Tidak ada yang bisa di-checkout",
    description: "Keranjang Anda kosong. Pilih produknya dulu, lalu kembali ke halaman ini.",
    action: { label: "Lihat Katalog", href: "/produk" },
  },
  summaryTitle: "Ringkasan Pesanan",
};

/** Teks halaman konfirmasi (/checkout/selesai). */
export const orderDoneCopy = {
  title: "Pesanan terkirim",
  description:
    "Ringkasan pesanan sudah dibuka di WhatsApp admin. Rincian pembayaran dibalas di chat yang sama pada jam operasional 08.00–22.00 WIB.",
  orderNoLabel: "Nomor pesanan",
  createdAtLabel: "Dikirim",
  customerTitle: "Dikirim ke",
  recapTitle: "Ringkasan pesanan",
  stepsTitle: "Setelah ini",
  steps: [
    { title: "Simpan nomor pesanan", description: "Sebutkan nomornya kalau perlu menanyakan status." },
    { title: "Bayar sesuai rincian", description: "Transfer bank atau QRIS — rinciannya dikirim admin." },
    { title: "Terima lisensi & panduan", description: "Dikirim di chat yang sama, siap diaktivasi." },
  ],
  waLabel: "Buka WhatsApp admin lagi",
  catalogLabel: "Lanjut belanja",
  note: "Halaman ini hanya tersimpan di browser ini — simpan nomor pesanannya kalau perlu arsip.",
  missing: {
    title: "Belum ada pesanan di perangkat ini",
    description:
      "Halaman konfirmasi hanya bisa menampilkan pesanan yang dikirim dari browser ini. Kalau pesanan Anda sudah terkirim ke WhatsApp, cukup lanjutkan di chat itu.",
    action: { label: "Lihat Katalog", href: "/produk" },
  },
};
