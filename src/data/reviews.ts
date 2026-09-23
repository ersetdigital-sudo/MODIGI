import type { ProductReview, RatingBreakdown } from "@/types";

/**
 * Ulasan pembeli per produk + sebaran ratingnya.
 *
 * ⚠️ Ini DATA CONTOH (placeholder) supaya tampilannya sudah jadi ala marketplace.
 * Ganti dengan ulasan asli sebelum dipakai jualan — cukup edit array di bawah,
 * komponennya tidak perlu diubah.
 *
 * Ulasan pertama tiap produk diambil dari testimoni yang sudah ada di
 * `src/data/products.ts`, jadi ceritanya konsisten.
 */
const reviewData: Record<string, { reviews: ProductReview[]; breakdown: RatingBreakdown }> = {
  "elementor-pro": {
    breakdown: { 5: 82, 4: 13, 3: 3, 2: 1, 1: 1 },
    reviews: [
      {
        name: "Rangga P.",
        role: "Web Freelancer",
        rating: 5,
        date: "12 Sep 2026",
        text: "Aktivasi cuma 3 menit dan langsung bisa update dari dashboard. Sudah beli 4 lisensi buat klien.",
        verified: true,
      },
      {
        name: "Nadia K.",
        role: "Agency Owner",
        rating: 5,
        date: "05 Sep 2026",
        text: "Theme Builder-nya bikin kerjaan landing page klien jauh lebih cepat. Adminnya juga responsif pas saya tanya soal upgrade domain.",
        verified: true,
      },
      {
        name: "Bayu S.",
        role: "Pemilik UMKM",
        rating: 4,
        date: "28 Agu 2026",
        text: "Ramah untuk pemula walau butuh waktu belajar di awal. Lisensi aktif tanpa kendala.",
        verified: true,
      },
      {
        name: "Sari W.",
        role: "Desainer Web",
        rating: 5,
        date: "18 Sep 2026",
        text: "Popup builder-nya dipakai terus buat promo klien. Setup dari admin jelas, saya tinggal pasang.",
        verified: true,
      },
      {
        name: "Fajar N.",
        role: "Pemilik Agency",
        rating: 4,
        date: "09 Sep 2026",
        text: "Fitur lengkap, sesekali setelah update layout lama perlu dirapikan lagi. Selebihnya aman.",
        verified: true,
      },
      {
        name: "Ika P.",
        role: "Pemilik Toko Online",
        rating: 5,
        date: "27 Agu 2026",
        text: "Bikin halaman promo tanpa nunggu developer. Update otomatisnya jalan terus.",
        verified: true,
      },
      {
        name: "Reza M.",
        role: "Web Developer",
        rating: 3,
        date: "14 Agu 2026",
        text: "Semua fitur ada, tapi butuh waktu menyesuaikan dengan tema lama saya. Harganya tetap sepadan.",
        verified: true,
      },
    ],
  },

  "rankmath-pro": {
    breakdown: { 5: 76, 4: 17, 3: 4, 2: 2, 1: 1 },
    reviews: [
      {
        name: "Dina S.",
        role: "Owner Toko Online",
        rating: 5,
        date: "08 Sep 2026",
        text: "Trafik organik naik pelan-pelan setelah benerin schema pakai RankMath. Harganya nggak masuk akal murahnya.",
        verified: true,
      },
      {
        name: "Hendra W.",
        role: "SEO Specialist",
        rating: 5,
        date: "30 Agu 2026",
        text: "Setup-nya jelas, ada wizard dari nol. Yang saya suka: modul bisa dimatikan satu-satu jadi website tetap ringan.",
        verified: true,
      },
      {
        name: "Rina M.",
        role: "Blogger",
        rating: 4,
        date: "21 Agu 2026",
        text: "Fitur lengkap untuk harga segini. Sempat bingung migrasi dari Yoast, tapi importernya jalan mulus.",
        verified: true,
      },
      {
        name: "Yudi A.",
        role: "Pemilik UMKM",
        rating: 5,
        date: "17 Sep 2026",
        text: "Meta title dan schema otomatis bikin CTR naik. Nggak perlu paham teknis sama sekali.",
        verified: true,
      },
      {
        name: "Clara T.",
        role: "Content Writer",
        rating: 4,
        date: "06 Sep 2026",
        text: "Bantuan outline-nya menghemat waktu riset, walau hasilnya tetap harus saya edit.",
        verified: true,
      },
      {
        name: "Bambang S.",
        role: "Webmaster",
        rating: 5,
        date: "29 Agu 2026",
        text: "Redirection dan monitor 404 menyelamatkan trafik waktu saya migrasi domain.",
        verified: true,
      },
      {
        name: "Nina H.",
        role: "Freelancer",
        rating: 3,
        date: "19 Agu 2026",
        text: "Fitur banyak, tapi menunya lumayan ramai buat yang baru pertama pakai.",
        verified: true,
      },
    ],
  },

  "wp-rocket": {
    breakdown: { 5: 74, 4: 18, 3: 5, 2: 2, 1: 1 },
    reviews: [
      {
        name: "Faisal A.",
        role: "Blogger",
        rating: 5,
        date: "02 Sep 2026",
        text: "PageSpeed mobile naik dari 42 ke 88 cuma dengan aktifin delay JS. Worth banget.",
        verified: true,
      },
      {
        name: "Andi T.",
        role: "Web Developer",
        rating: 5,
        date: "26 Agu 2026",
        text: "Cocok banget buat klien yang hostingnya shared. Pasang, aktif, langsung ada hasil.",
        verified: true,
      },
      {
        name: "Sinta L.",
        role: "Pemilik Toko Online",
        rating: 4,
        date: "18 Agu 2026",
        text: "Checkout jadi lebih enak dipakai setelah cache hidup. Awalnya perlu matikan plugin cache lama dulu.",
        verified: true,
      },
      {
        name: "Dimas P.",
        role: "Pemilik Toko Online",
        rating: 5,
        date: "20 Sep 2026",
        text: "LCP turun dari 3,4 detik ke 1,6 detik. Halaman checkout langsung terasa lebih ringan.",
        verified: true,
      },
      {
        name: "Ayu R.",
        role: "Blogger",
        rating: 4,
        date: "11 Sep 2026",
        text: "Bekerja baik, hanya perlu pastikan plugin cache lama dimatikan dulu biar nggak konflik.",
        verified: true,
      },
      {
        name: "Wahyu S.",
        role: "Web Developer",
        rating: 5,
        date: "04 Sep 2026",
        text: "Kombinasi lazy render dan optimasi CSS bikin skor PageSpeed klien naik konsisten.",
        verified: true,
      },
      {
        name: "Laras D.",
        role: "Pemilik Bisnis",
        rating: 3,
        date: "24 Agu 2026",
        text: "Hasilnya bagus, tapi mencari setelan paling pas butuh sedikit eksperimen dulu.",
        verified: true,
      },
    ],
  },

  "wordfence-premium": {
    breakdown: { 5: 78, 4: 15, 3: 4, 2: 2, 1: 1 },
    reviews: [
      {
        name: "Yoga H.",
        role: "IT Support",
        rating: 5,
        date: "15 Sep 2026",
        text: "Website klien sempat kena malware, setelah pakai Wordfence Premium clean dan aman sampai sekarang.",
        verified: true,
      },
      {
        name: "Tri A.",
        role: "Webmaster",
        rating: 5,
        date: "03 Sep 2026",
        text: "Rules real-time-nya kerasa bedanya dibanding versi gratis. Percobaan brute force login langsung keblokir.",
        verified: true,
      },
      {
        name: "Intan P.",
        role: "Agency Owner",
        rating: 4,
        date: "25 Agu 2026",
        text: "Scan terjadwal bisa diatur di jam sepi jadi performa tidak terganggu. Butuh penyesuaian di awal saja.",
        verified: true,
      },
      {
        name: "Surya K.",
        role: "IT Support",
        rating: 5,
        date: "19 Sep 2026",
        text: "Login admin jadi tenang sejak 2FA dan pembatasan negara aktif. Log-nya jelas waktu ada percobaan masuk.",
        verified: true,
      },
      {
        name: "Mega L.",
        role: "Pemilik Toko Online",
        rating: 5,
        date: "07 Sep 2026",
        text: "Ada percobaan brute force tengah malam, langsung diblokir otomatis tanpa saya sentuh.",
        verified: true,
      },
      {
        name: "Ronny P.",
        role: "Webmaster",
        rating: 4,
        date: "31 Agu 2026",
        text: "Scan-nya cukup berat kalau hosting kecil, jadi saya jadwalkan malam. Sudah beres.",
        verified: true,
      },
      {
        name: "Fitri A.",
        role: "Agency Owner",
        rating: 3,
        date: "22 Agu 2026",
        text: "Deteksinya bagus, tapi masih ada false positive yang harus dimasukkan whitelist manual.",
        verified: true,
      },
    ],
  },

  "essential-addons-pro": {
    breakdown: { 5: 75, 4: 18, 3: 4, 2: 2, 1: 1 },
    reviews: [
      {
        name: "Melati R.",
        role: "Agency Owner",
        rating: 5,
        date: "10 Sep 2026",
        text: "Hemat waktu banget, nggak perlu install 5 plugin berbeda buat widget yang beda-beda.",
        verified: true,
      },
      {
        name: "Gilang D.",
        role: "Freelancer",
        rating: 4,
        date: "01 Sep 2026",
        text: "Widget-nya banyak dan bisa dinyalakan sesuai kebutuhan. Beberapa widget butuh Elementor Pro biar maksimal.",
        verified: true,
      },
      {
        name: "Wulan S.",
        role: "Pemilik Bisnis",
        rating: 5,
        date: "23 Agu 2026",
        text: "Bikin halaman jualan jadi cepat, tinggal pakai blok yang sudah tersedia. Aktivasi juga cepat.",
        verified: true,
      },
      {
        name: "Bagas W.",
        role: "Freelancer",
        rating: 5,
        date: "18 Sep 2026",
        text: "Widget kreatifnya cepat dikustomisasi. Lima klien terakhir puas dengan hasilnya.",
        verified: true,
      },
      {
        name: "Rani S.",
        role: "Pemilik Bisnis",
        rating: 4,
        date: "09 Sep 2026",
        text: "Beberapa widget butuh Elementor Pro, sisanya jalan apa adanya. Puas dengan hasilnya.",
        verified: true,
      },
      {
        name: "Teguh I.",
        role: "Web Developer",
        rating: 5,
        date: "02 Sep 2026",
        text: "Pustaka templatenya hemat waktu, tinggal ganti warna sesuai brand klien.",
        verified: true,
      },
      {
        name: "Alia N.",
        role: "Desainer",
        rating: 3,
        date: "20 Agu 2026",
        text: "Widget-nya bagus, kadang CSS-nya perlu di-override untuk ukuran layar tertentu.",
        verified: true,
      },
    ],
  },
};

/** Ulasan + sebaran rating satu produk (kosong kalau slug-nya belum ada datanya). */
export function getProductReviews(slug: string) {
  return (
    reviewData[slug] ?? {
      reviews: [] as ProductReview[],
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as RatingBreakdown,
    }
  );
}
