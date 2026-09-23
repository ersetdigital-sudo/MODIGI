import { BadgeCheck, CreditCard, MessageCircle, ShieldCheck, ShoppingCart, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { MetodeBayarKind, TrustPoint } from "@/types";

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
    title: "Pilih produk & isi data",
    description: "Produk masuk keranjang, lalu Anda mengisi domain dan akses WP-Admin.",
  },
  {
    icon: CreditCard,
    title: "Bayar di halaman pembayaran",
    description: "Pilih transfer bank, QRIS, atau e-wallet — rinciannya tampil langsung.",
  },
  {
    icon: BadgeCheck,
    title: "Lisensi aktif",
    description: "Konfirmasi terverifikasi, plugin dipasang dan bisa langsung dipakai.",
  },
];

/** Catatan kecil soal pembayaran di buy box. */
export const paymentNote =
  "Transfer bank, QRIS, atau e-wallet. Pilih metodenya di halaman pembayaran, lalu kirim konfirmasi lewat WhatsApp.";

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
  note: "Langkah berikutnya: isi data pesanan, pilih cara bayar, lalu kirim konfirmasinya lewat WhatsApp.",

  /** Teks drawer keranjang — panel yang muncul dari kanan saat produk ditambahkan. */
  drawer: {
    /** Judul + jumlah lisensi, mis. "Keranjang (2)". */
    title: "Keranjang",
    clearLabel: "Hapus Semua",
    closeLabel: "Tutup keranjang",
    totalItemLabel: "Total Item",
    totalPriceLabel: "Total Harga",
    /** "1 produk" / "3 produk". */
    itemSuffix: "produk",
    checkoutLabel: "Checkout Sekarang",
    pageLabel: "Buka halaman keranjang",
    emptyTitle: "Keranjang masih kosong",
    emptyDescription: "Produk yang Anda tambahkan akan muncul di sini — tinggal atur jumlah dan lanjut ke checkout.",
    emptyAction: { label: "Lihat Katalog", href: "/produk" },
  },
};

/** Teks halaman checkout (/checkout). */
export const checkoutCopy = {
  breadcrumb: "Checkout",
  /** Induk breadcrumb, mis. "Katalog > Checkout". */
  breadcrumbParent: { label: "Katalog", href: "/produk" },
  title: "Checkout",
  formTitle: "Data Instalasi",
  formDescription: "Isi data WordPress Anda untuk proses instalasi plugin.",
  fields: {
    name: { label: "Nama Lengkap", placeholder: "Nama Anda" },
    whatsapp: { label: "Nomor WhatsApp", placeholder: "08xxxxxxxxxx" },
    domain: { label: "Domain WordPress", placeholder: "contoh.com" },
    wpUser: { label: "Username WP-Admin", placeholder: "admin@domainanda.com" },
    wpPassword: { label: "Password WP-Admin", placeholder: "••••••••" },
  },
  showPassword: "Lihat",
  hidePassword: "Sembunyikan",
  /**
   * Catatan keamanan di bawah field password — ditampilkan, bukan cuma ditulis di
   * dokumentasi, karena pembeli berhak tahu passwordnya tidak mengendap di browser.
   */
  passwordNote:
    "Password hanya dikirim ke WhatsApp admin untuk instalasi dan tidak disimpan di halaman ini. Sebaiknya ganti setelah plugin terpasang.",
  submitLabel: "Buat Pesanan",
  submitNote:
    "WhatsApp admin terbuka berisi data instalasi Anda, lalu Anda memilih cara bayar di halaman berikutnya.",
  policyNote: {
    lead: "Dengan membuat pesanan, Anda setuju dengan",
    links: [
      { label: "Lisensi Produk", href: "/kebijakan/lisensi" },
      { label: "Syarat & Ketentuan", href: "/kebijakan/syarat-ketentuan" },
    ],
    suffix: "— termasuk aturan satu lisensi untuk satu domain.",
  },
  backToCart: "Kembali ke keranjang",
  empty: {
    title: "Tidak ada yang bisa di-checkout",
    description: "Keranjang Anda kosong. Pilih produknya dulu, lalu kembali ke halaman ini.",
    action: { label: "Lihat Katalog", href: "/produk" },
  },
  summaryTitle: "Ringkasan Pesanan",
  totalItemLabel: "Total Item",
  totalPriceLabel: "Total Harga",
  /** "1 produk" / "3 produk" di baris Total Item. */
  itemSuffix: "produk",
};

/**
 * Label jenis cara bayar — dipakai halaman pembeli **dan** dashboard admin supaya
 * penyebutannya konsisten ("Transfer bank", bukan "transfer" di satu tempat dan
 * "Bank Transfer" di tempat lain).
 */
export const metodeKindLabel: Record<MetodeBayarKind, string> = {
  bank: "Transfer bank",
  qris: "QRIS",
  ewallet: "E-wallet",
};

/**
 * Teks halaman pembayaran (/checkout/pembayaran).
 *
 * Halaman ini sengaja dibuat *satu halaman penuh* (bukan modal atau lompatan ke
 * WhatsApp): pembeli perlu membaca nomor rekening, mencocokkan nama pemiliknya,
 * dan menyalin nominalnya dengan tenang.
 */
export const paymentCopy = {
  breadcrumb: "Pembayaran",
  breadcrumbParent: { label: "Checkout", href: "/checkout" },
  title: "Selesaikan pembayaran",
  description:
    "Pilih salah satu cara bayar di bawah, kirim nominalnya persis sesuai total, lalu tekan Konfirmasi Pembayaran supaya pesanan Anda langsung diproses.",

  /** Tiga langkah pesanan — penanda posisi pembeli sekarang. */
  progress: {
    steps: ["Data instalasi", "Pembayaran", "Lisensi aktif"],
    active: 1,
  },

  methodTitle: "Pilih cara bayar",
  methodDescription:
    "Rekening & QRIS di bawah ini resmi milik MODIGI. Nama pemiliknya selalu dicantumkan — pastikan cocok sebelum mengirim.",
  accountLabel: "Nomor rekening",
  /** Label khusus e-wallet — "nomor rekening" terasa salah untuk GoPay/DANA. */
  ewalletAccountLabel: "Nomor e-wallet",
  holderLabel: "Atas nama",
  /** Dipakai saat pembeli mengonfirmasi padahal admin belum mengisi metode apa pun. */
  noMethodLabel: "Belum dipilih — mohon info rinciannya",
  copyLabel: "Salin",
  copiedLabel: "Tersalin",
  qrisHint:
    "Scan pakai aplikasi bank atau e-wallet apa pun. Nominalnya sudah kami cantumkan di ringkasan supaya tidak salah isi.",
  qrisMissing:
    "Gambar QRIS belum diunggah admin. Tekan Konfirmasi Pembayaran — admin mengirimkannya di chat yang sama.",

  referenceLabel: "Nama pengirim / keterangan",
  referencePlaceholder: "mis. Budi Santoso — BCA",
  referenceHint:
    "Nama yang muncul di mutasi bank. Dengan ini admin lebih cepat mencocokkan pembayaran dan mengaktifkan lisensi Anda.",
  referenceOptional: "Opsional",

  confirmLabel: "Konfirmasi Pembayaran",
  confirmNote:
    "Membuka WhatsApp admin berisi ringkasan pesanan dan cara bayar yang Anda pilih — tidak perlu mengetik ulang apa pun.",
  confirmReminder:
    "Pastikan pembayarannya sudah terkirim sebelum menekan tombol ini, ya. Admin memverifikasi lalu mengirim lisensinya di chat yang sama.",

  recapTitle: "Rincian pesanan",
  totalItemLabel: "Total Item",
  recapItemSuffix: "produk",
  orderNoLabel: "Nomor pesanan",
  totalLabel: "Jumlah yang harus dibayar",
  copyTotalLabel: "Salin nominal",
  backToCheckout: "Ubah data pesanan",

  /** Rincian cara bayar belum diisi admin — bukan alasan menghalangi pembeli. */
  emptyMethods: {
    title: "Rincian cara bayar belum diatur",
    description:
      "Admin belum menambahkan nomor rekening atau QRIS. Tekan Konfirmasi Pembayaran di bawah — admin mengirim rinciannya di chat yang sama, dan pesanan Anda tetap tercatat.",
  },

  missing: {
    title: "Belum ada pesanan di perangkat ini",
    description:
      "Halaman pembayaran menampilkan pesanan yang dibuat dari browser ini. Kalau Anda sudah memesan sebelumnya, cukup lanjutkan pemesannya lewat chat WhatsApp.",
    action: { label: "Lihat Katalog", href: "/produk" },
  },
};

/** Teks halaman konfirmasi (/checkout/selesai). */
export const orderDoneCopy = {
  title: "Pesanan terkirim",
  description:
    "Pesanan Anda sudah tercatat. Begitu konfirmasi pembayaran terkirim, admin memverifikasi lalu mengirim lisensinya di chat yang sama.",
  orderNoLabel: "Nomor pesanan",
  createdAtLabel: "Dikirim",
  customerTitle: "Dikirim ke",
  recapTitle: "Ringkasan pesanan",
  stepsTitle: "Setelah ini",
  steps: [
    { title: "Simpan nomor pesanan", description: "Sebutkan nomornya kalau perlu menanyakan status." },
    {
      title: "Admin verifikasi pembayaran",
      description: "Rata-rata beberapa menit pada jam operasional 08.00–22.00 WIB.",
    },
    { title: "Terima lisensi & panduan", description: "Dikirim di chat yang sama, siap diaktivasi." },
  ],
  payment: {
    title: "Pembayaran",
    paidBadge: "Konfirmasi terkirim",
    unpaidBadge: "Belum dibayar",
    paidNote:
      "Ringkasan pembayaran Anda sudah dibuka di WhatsApp admin. Kami verifikasi, lalu lisensinya dikirim di chat yang sama.",
    unpaidNote:
      "Pesanan ini belum dibayar. Buka halaman pembayaran untuk melihat nomor rekening atau QRIS-nya.",
    methodLabel: "Cara bayar",
    referenceLabel: "Keterangan",
    sentAtLabel: "Dikonfirmasi",
    payLabel: "Pilih cara bayar",
    payAgainLabel: "Buka halaman pembayaran lagi",
  },
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
