/**
 * Copy halaman Testimoni (/testimoni).
 *
 * Halaman ini mengumpulkan ulasan dari `reviews.ts` (sumber yang sama dengan
 * halaman detail produk) dan menampilkannya per produk. Karena satu sumber,
 * ulasan yang muncul di sini dan di halaman produk tidak akan pernah beda.
 *
 * Nada sengaja tidak "jualan": pembaca halaman testimoni biasanya sudah tertarik
 * dan sedang mencari alasan untuk percaya — termasuk alasan untuk tidak percaya.
 */
export const testimoniHero = {
  eyebrow: "Testimoni",
  title: "Kata pembeli, apa adanya — termasuk yang bintangnya kurang lima.",
  description:
    "Semua ulasan di halaman ini ditulis pembeli yang lisensinya benar-benar diaktivasi di domain mereka. Kami tidak menyunting isinya dan tidak menyembunyikan yang biasa saja.",
  action: { label: "Lihat Katalog", href: "/produk" },
};

export const testimoniSections = {
  jump: {
    label: "Lompat ke produk",
  },
  list: {
    title: "Ulasan per produk",
    description:
      "Dikelompokkan per produk supaya Anda bisa melihat pola yang muncul, bukan cuma satu cerita bagus.",
  },
};

/** Teks yang dipakai di kartu ringkasan atas. */
export const testimoniSummary = {
  ratingLabel: "Rata-rata penilaian",
  reviewsLabel: "Ulasan terkumpul",
  productsLabel: "Produk dinilai",
  verifiedLabel: "Ulasan terverifikasi",
  note: "Ulasan di bawah adalah ulasan terbaru yang kami tampilkan di halaman ini. Semuanya dari pembelian yang sudah diaktivasi.",
};

export const testimoniCta = {
  title: "Masih mencari alasan untuk percaya?",
  description:
    "Garansi kami jelas dan bisa dibaca dulu sebelum membeli: kalau lisensi gagal aktivasi dan tidak bisa kami selesaikan, uang Anda kembali penuh.",
  primary: { label: "Baca Garansi", href: "/kebijakan/refund" },
  secondary: {
    label: "Chat admin",
    message: "Halo, saya mau tanya dulu sebelum membeli di MODIGI.",
  },
};
