/**
 * Copy halaman Kategori (/kategori).
 *
 * Halaman ini mengarahkan pembeli yang belum tahu nama plugin-nya: mereka datang
 * dengan masalah ("website lambat", "mau jualan online"), bukan dengan nama produk.
 * Karena itu judul dan deskripsinya berbicara soal kebutuhan, bukan fitur.
 *
 * Daftar kategori & produknya diambil dari `categories.ts` + `products.ts`,
 * jadi menambah produk otomatis memperbarui hitungan dan harga "mulai dari".
 */
export const kategoriHero = {
  eyebrow: "Kategori Produk",
  title: "Belum tahu plugin apa yang Anda butuhkan? Mulai dari masalahnya.",
  description:
    "Semua produk di sini dikelompokkan sesuai pekerjaan yang mau diselesaikan: membangun halaman, mempercepat situs, mengamankan, sampai berjualan online. Pilih kategorinya, lihat produknya, baru putuskan.",
  action: { label: "Lihat Semua Produk", href: "/produk" },
};

export const kategoriSections = {
  grid: {
    title: "Pilih berdasarkan kebutuhan",
    description:
      "Tiap kartu punya jumlah produk dan harga mulai dari — supaya Anda tahu isinya sebelum masuk.",
  },
  list: {
    title: "Produk di tiap kategori",
    description:
      "Daftar singkat supaya Anda bisa membandingkan tanpa bolak-balik ke katalog.",
  },
};

export const kategoriCta = {
  title: "Masih bingung pilih yang mana?",
  description:
    "Sebutkan website Anda dan masalah yang mau diselesaikan. Admin akan pilihkan satu produk yang paling pas — bukan yang paling mahal.",
  action: {
    label: "Tanya admin dulu",
    message: "Halo, saya bingung pilih plugin untuk website saya. Bisa dibantu?",
  },
};

/** Label untuk kategori yang belum punya produk — ditulis apa adanya, bukan disembunyikan. */
export const kategoriKosong = "Belum ada produk";
