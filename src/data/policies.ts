import { FileText, KeyRound, LockKeyhole, RefreshCcw } from "lucide-react";

import type { PolicyDoc } from "@/types";

/**
 * Isi empat dokumen kebijakan: Syarat & Ketentuan, Kebijakan Privasi,
 * Refund & Garansi, dan Lisensi Produk.
 *
 * Aturan menulis di sini:
 * - **Satu klaim, satu nilai.** Semua angka (masa aktif 1 tahun, support 30 hari,
 *   garansi 7 hari, jam operasional) harus sama dengan `src/data/support.ts` dan
 *   pengaturan `src/data/store.ts`. Kalau salah satu berubah, ubah di semua tempat.
 * - **Bahasa manusia.** Tidak ada "pihak pertama/kedua", tidak ada kalimat berlapis.
 *   Kalimat pendek, kata sehari-hari, dan sebutkan hal yang bisa pembeli cek sendiri.
 * - **Jujur soal yang belum pasti.** Hal yang masih menunggu keputusan pemilik toko
 *   ditandai `← PERLU DIPUTUSKAN` di komentar, dan dirangkum di README.
 *
 * `href` di bawah dipakai juga oleh kolom "Kebijakan" di footer
 * (`src/data/navigation.ts`) — kalau berubah, ubah dua-duanya.
 */

/** Tanggal revisi seluruh dokumen. Ubah saat isinya benar-benar berubah. */
const REVISI = "23 September 2026";

export const syaratKetentuan: PolicyDoc = {
  slug: "syarat-ketentuan",
  href: "/kebijakan/syarat-ketentuan",
  navLabel: "Syarat & Ketentuan",
  eyebrow: "Syarat & Ketentuan",
  title: "Aturan mainnya, ditulis tanpa bahasa hukum yang bikin pusing.",
  description:
    "Ini versi lengkap tapi manusiawi: apa yang Anda dapat setelah membayar, apa yang kami minta dari Anda, dan hal-hal yang tidak boleh dilakukan. Kalau ada satu bagian yang masih mengganjal, tanya admin — pertanyaan sepele pun kami jawab.",
  updated: REVISI,
  readMinutes: 5,
  icon: FileText,
  tldr: [
    "Kami menjual lisensi original, diaktivasi resmi ke domain Anda.",
    "Bayar sekali untuk satu domain: aktif 1 tahun termasuk update, plus support WhatsApp 30 hari.",
    "Yang dilarang cuma satu hal: menjual ulang lisensinya atau memakai versi nulled.",
  ],
  sections: [
    {
      id: "produk",
      title: "Yang kami jual, dan yang bukan milik kami",
      paragraphs: [
        "MODIGI menjual lisensi pemakaian plugin, tema, dan tools digital. Yang berpindah ke Anda adalah lisensi aktifnya, bukan kepemilikan software-nya.",
        "Nama produk seperti Elementor, WP Rocket, atau Rank Math tetap milik pembuatnya masing-masing, termasuk merek dagangnya. Kami bukan pembuat produk-produk itu dan tidak mengklaim sebaliknya.",
      ],
      note: "Kalau sebuah produk tidak bisa kami sediakan secara resmi, kami bilang terus terang — bukan menggantinya dengan versi nulled.",
    },
    {
      id: "pesanan",
      title: "Cara pesan dan bayar",
      paragraphs: [
        "Pesanan dibuat lewat halaman checkout di situs ini (keranjang opsional), lalu ringkasannya dikirim ke WhatsApp admin. Tidak ada akun yang perlu dibuat.",
        "Setelah itu Anda memilih cara bayar di halaman pembayaran — transfer bank, QRIS, atau e-wallet, lengkap dengan nomor tujuannya. Menekan tombol Konfirmasi Pembayaran akan mengirim ringkasan pembayarannya ke WhatsApp admin.",
        "Pesanan mulai diproses setelah pembayaran terkonfirmasi. Rata-rata selesai di bawah 5 menit pada jam operasional.",
      ],
      note: "Domain yang sudah disebut tidak bisa diubah sendiri setelah lisensi aktif. Kalau salah sebut, bilang sebelum membayar; sesudahnya tetap bisa dipindah, hanya perlu proses ulang.",
    },
    {
      id: "masa-aktif",
      title: "Masa aktif, update, dan support",
      paragraphs: [
        "Setelah dibayar, lisensi Anda punya masa berlaku yang jelas. Tidak ada biaya tambahan selama masa itu.",
      ],
      bullets: [
        "Lisensi aktif 1 tahun sejak tanggal aktivasi.",
        "Selama masa aktif, versi baru muncul di menu Update wp-admin seperti plugin lain.",
        "Support WhatsApp tersedia 30 hari sejak aktivasi, setiap hari pukul 08.00–22.00 WIB.",
        "Setelah masa aktif berakhir, plugin tetap jalan. Yang berhenti hanya update dan support.",
      ],
    },
    {
      id: "aktivasi",
      title: "Aktivasi dan pindah domain",
      paragraphs: [
        "Lisensi diaktivasi ke satu domain. Kalau Anda punya beberapa website, sebutkan jumlahnya saat memesan supaya dihitung dari awal.",
        "Butuh pindah domain? Beri tahu admin domain lama dan barunya. Gratis, selama masa aktif masih berjalan.",
      ],
    },
    {
      id: "larangan",
      title: "Yang tidak boleh dilakukan",
      paragraphs: [
        "Aturannya sengaja pendek supaya gampang diingat.",
      ],
      bullets: [
        "Menjual ulang, membagikan, atau menyewakan lisensi Anda ke pihak lain.",
        "Memakai versi nulled atau memodifikasi lisensi supaya jalan di lebih banyak domain dari yang dibeli.",
        "Mengklaim sebagai pembuat produk, atau menjualnya seolah-olah buatan sendiri.",
      ],
      // ← PERLU DIPUTUSKAN (pemilik toko): apakah pelanggaran lisensi berujung
      // pada penonaktifan tanpa refund? Kalau tidak, hapus kalimat note ini.
      note: "Kalau lisensi terbukti dipakai di luar ketentuan di atas, lisensi bisa dinonaktifkan tanpa pengembalian dana.",
    },
    {
      id: "kesalahan-kami",
      title: "Kalau kesalahannya dari kami",
      paragraphs: [
        "Produk terkirim tidak sesuai, lisensi tidak bisa aktif padahal data domain sudah benar, atau pembayaran masuk tapi lisensi tidak dikirim: kami perbaiki, atau uang Anda kembali penuh.",
        "Alur pengajuan dan batas waktunya ada di halaman Refund & Garansi.",
      ],
    },
    {
      id: "harga",
      title: "Harga",
      paragraphs: [
        "Harga tercantum dalam rupiah dan sudah final. Tidak ada biaya tersembunyi setelah pembayaran.",
        "Harga bisa berubah karena mengikuti harga resmi dari pembuat produk. Pesanan yang sudah dibayar tidak ikut berubah.",
      ],
    },
    {
      id: "perubahan",
      title: "Kalau halaman ini berubah",
      paragraphs: [
        "Kami perbarui halaman ini saat ada aturan yang berubah, dan tanggal di bagian atas selalu menunjukkan versi terbaru.",
        "Untuk pesanan yang sudah berjalan, yang berlaku adalah versi pada saat Anda membeli.",
      ],
    },
    {
      id: "kontak",
      title: "Mau tanya soal aturan ini?",
      paragraphs: [
        "Kirim ke halo@modigi.id atau chat admin di WhatsApp. Kami jawab pada jam operasional, setiap hari pukul 08.00–22.00 WIB.",
      ],
    },
  ],
};

export const kebijakanPrivasi: PolicyDoc = {
  slug: "privasi",
  href: "/kebijakan/privasi",
  navLabel: "Kebijakan Privasi",
  eyebrow: "Kebijakan Privasi",
  title: "Data Anda kami simpan seperlunya, dan kami jelaskan semuanya.",
  description:
    "Tidak ada pelacak iklan di situs ini dan tidak ada data yang kami jual. Yang kami simpan hanya yang Anda kirim sendiri saat memesan, plus catatan teknis yang dibutuhkan untuk menjaga situs ini tetap jalan.",
  updated: REVISI,
  readMinutes: 4,
  icon: LockKeyhole,
  tldr: [
    "Kami hanya menyimpan data yang Anda berikan saat memesan: nama, kontak, dan domain.",
    "Situs ini tidak memasang cookie iklan atau pelacak pihak ketiga.",
    "Anda bisa minta salinan, perbaikan, atau penghapusan data lewat halo@modigi.id.",
  ],
  sections: [
    {
      id: "data",
      title: "Data apa yang kami kumpulkan",
      paragraphs: [
        "Semuanya Anda kirim sendiri lewat chat WhatsApp, email, atau formulir checkout di situs ini. Kami tidak meminta data yang tidak berhubungan dengan pesanan.",
      ],
      bullets: [
        "Nama atau nama panggilan yang Anda pakai saat memesan.",
        "Nomor WhatsApp atau alamat email sebagai jalur komunikasi.",
        "Domain yang akan diaktivasi dan produk yang dipesan.",
        "Username WP-Admin, karena instalasi plugin dilakukan oleh admin kami.",
        "Bukti pembayaran, untuk memastikan pesanan benar-benar sudah dibayar.",
      ],
      note: "Pesanan yang dibuat lewat formulir checkout tersimpan di database kami supaya statusnya bisa dilacak. Untuk password WP-Admin berlaku sebaliknya: password itu TIDAK kami simpan — hanya dipakai sekali untuk instalasi, lalu sebaiknya Anda ganti.",
    },
    {
      id: "log",
      title: "Catatan teknis dari server",
      paragraphs: [
        "Seperti situs lain, server kami mencatat informasi teknis saat halaman dibuka: alamat IP, waktu akses, halaman yang dilihat, dan jenis perangkat.",
        "Catatan ini dipakai untuk keamanan dan memperbaiki error — bukan untuk melacak Anda berpindah-pindah situs.",
      ],
    },
    {
      id: "tujuan",
      title: "Untuk apa data itu dipakai",
      bullets: [
        "Memproses pesanan dan mengaktivasi lisensi ke domain Anda.",
        "Memindahkan lisensi atau memperpanjangnya saat Anda minta.",
        "Menangani garansi, refund, dan pertanyaan support.",
        "Pembukuan dan kewajiban pajak yang berlaku bagi kami.",
      ],
      note: "Kami tidak memakai data Anda untuk mengirim promosi massal. Kalau ada info produk baru, kami kirim di chat yang sama — dan Anda bisa minta berhenti kapan saja.",
    },
    {
      id: "cookie",
      title: "Cookie",
      paragraphs: [
        "Situs ini tidak memasang cookie iklan maupun pelacak analitik pihak ketiga. Karena itu Anda tidak akan menemukan banner cookie di sini.",
        "Tautan WhatsApp, Instagram, dan media sosial lain membawa Anda keluar dari situs kami. Di sana berlaku kebijakan privasi masing-masing layanan.",
      ],
    },
    {
      id: "pihak-lain",
      title: "Siapa lagi yang bisa melihat data Anda",
      bullets: [
        "Admin MODIGI, hanya yang menangani pesanan Anda.",
        "WhatsApp (Meta), karena pesanannya diproses lewat chat.",
        "Supabase, sebagai tempat penyimpanan data pesanan.",
        "Cloudinary, sebagai tempat penyimpanan foto produk — tidak ada data pribadi Anda di sana.",
        "Penyedia pembayaran yang Anda pilih: bank, QRIS, atau e-wallet.",
        "Penyedia hosting dan layanan email yang menjaga situs ini tetap berjalan.",
      ],
      note: "Kami tidak menjual, menyewakan, atau menyerahkan data Anda ke pihak lain untuk keperluan iklan.",
    },
    {
      id: "simpan",
      title: "Berapa lama data disimpan",
      // ← PERLU DIPUTUSKAN (pemilik toko): 12 bulan sesudah masa aktif. Sesuaikan
      // dengan kebiasaan pembukuan, lalu samakan di kolom "Dihapus" di bawah.
      paragraphs: [
        "Data pesanan kami simpan selama lisensi Anda aktif, dan sampai 12 bulan setelah itu untuk keperluan garansi, perpanjangan, dan pembukuan. Setelah masa itu, datanya kami hapus.",
      ],
    },
    {
      id: "hak",
      title: "Hak Anda atas data itu",
      bullets: [
        "Minta salinan data yang kami simpan tentang Anda.",
        "Minta diperbaiki kalau ada yang salah atau sudah tidak berlaku.",
        "Minta dihapus — dengan catatan, data pembukuan tertentu mungkin masih perlu kami simpan sesuai aturan pajak.",
        "Minta berhenti dihubungi untuk keperluan promosi.",
      ],
      // ← PERLU DIPUTUSKAN (pemilik toko): batas waktu balasan & pemrosesan
      // permintaan data (contoh: 1×24 jam balasan, maksimal 7 hari kerja proses).
      paragraphs: [
        "Caranya cukup kirim email ke halo@modigi.id dari alamat yang Anda pakai saat memesan. Kami balas dalam 1×24 jam dan menyelesaikan permintaannya maksimal 7 hari kerja.",
      ],
    },
    {
      id: "keamanan",
      title: "Bagaimana kami menjaganya",
      paragraphs: [
        "Akses ke data pesanan dibatasi hanya untuk admin yang membutuhkannya.",
        "Kami tidak menyimpan nomor kartu atau data perbankan Anda. Pembayaran terjadi di bank, QRIS, atau e-wallet yang Anda pilih, bukan di situs ini.",
      ],
    },
    {
      id: "perubahan",
      title: "Kalau kebijakan ini berubah",
      paragraphs: [
        "Setiap perubahan kami catat di halaman ini beserta tanggal barunya.",
        "Kalau perubahannya mengubah cara kami memakai data Anda, kami beri tahu lewat chat atau email — bukan diam-diam.",
      ],
    },
  ],
};

export const refundGaransi: PolicyDoc = {
  slug: "refund",
  href: "/kebijakan/refund",
  navLabel: "Refund & Garansi",
  eyebrow: "Refund & Garansi",
  title: "Kalau lisensi tidak bisa dipakai, uang Anda kembali penuh.",
  description:
    "Garansi kami berdiri di satu janji sederhana: kalau kami tidak bisa membuat lisensi Anda aktif, Anda tidak perlu ikut menanggungnya. Berikut kapan garansi berlaku, kapan tidak, dan cara mengajukannya.",
  updated: REVISI,
  readMinutes: 4,
  icon: RefreshCcw,
  tldr: [
    "Lisensi gagal aktivasi dan tidak bisa kami selesaikan: uang kembali 100%.",
    "Ajukan maksimal 7 hari setelah lisensi aktif dan dipakai.",
    "Kerusakan akibat plugin dimodifikasi atau dicampur versi nulled tidak ditanggung.",
  ],
  sections: [
    {
      id: "ditanggung",
      title: "Yang ditanggung garansi",
      paragraphs: ["Tiga hal ini cukup untuk mengajukan pengembalian dana:"],
      bullets: [
        "Lisensi tidak bisa aktif padahal data domain sudah benar.",
        "Produk yang terkirim tidak sesuai dengan yang Anda pesan.",
        "Pembayaran sudah masuk, tapi lisensi tidak pernah dikirim.",
      ],
    },
    {
      id: "tidak-ditanggung",
      title: "Yang tidak ditanggung",
      paragraphs: [
        "Kami sebutkan ini bukan untuk mencari alasan menolak, tapi supaya Anda tahu batasnya sejak awal.",
      ],
      bullets: [
        "Kerusakan karena plugin dimodifikasi atau dicampur dengan versi nulled.",
        "Masalah hosting, tema, atau plugin pihak lain yang tidak berhubungan dengan lisensi kami.",
        "Permintaan refund setelah lisensi aktif dan dipakai lebih dari 7 hari.",
      ],
      note: "Kalau kendalanya karena hosting, tema, atau plugin lain, kami tetap bantu cari jalan keluarnya — gratis, selama masa support 30 hari masih berjalan.",
    },
    {
      id: "cara-ajukan",
      title: "Cara mengajukan refund",
      bullets: [
        "Chat admin di WhatsApp, sebutkan nama produk dan domain yang diaktivasi.",
        "Ceritakan kendalanya — sertakan screenshot pesan error kalau ada.",
        "Kami periksa dulu. Kalau masih bisa diperbaiki, kami tawarkan perbaikan atau tukar produk senilai.",
      ],
      note: "Kalau setelah diperiksa memang tidak bisa diselesaikan, refund kami setujui dan beri tahu Anda di chat yang sama.",
    },
    {
      id: "waktu",
      title: "Berapa lama uangnya kembali",
      // ← PERLU DIPUTUSKAN (pemilik toko): batas waktu proses (contoh 1×24 jam)
      // dan lama dana sampai (contoh 1–3 hari kerja). Sesuaikan dengan praktik asli.
      paragraphs: [
        "Pengajuan yang disetujui kami proses maksimal 1×24 jam pada hari kerja.",
        "Dana sampai ke rekening Anda dalam 1–3 hari kerja, tergantung bank atau e-wallet yang dipakai. Bukti transfer kami kirim ke chat Anda.",
      ],
    },
    {
      id: "tukar-produk",
      title: "Tukar produk dulu, refund kemudian",
      paragraphs: [
        "Sering kali masalahnya bukan produknya, tapi cocok atau tidak dengan kebutuhan Anda. Untuk kasus seperti itu kami lebih suka menawarkan tukar produk senilai daripada langsung refund.",
        "Anda bebas memilih: ambil tukarnya, atau tetap minta refund sesuai garansi.",
      ],
    },
    {
      id: "setelah-refund",
      title: "Setelah refund disetujui",
      bullets: [
        "Lisensi yang di-refund kami nonaktifkan, dan plugin sebaiknya Anda hapus dari website.",
        "Kalau nanti Anda butuh produk yang sama, silakan pesan lagi. Tidak ada daftar hitam di sini.",
      ],
    },
    {
      id: "kontak",
      title: "Masih ragu kasus Anda masuk garansi atau tidak",
      paragraphs: [
        "Tanya saja dulu. Jawabannya gratis dan tidak membuat Anda wajib membeli apa pun. Chat admin di WhatsApp, atau kirim detailnya ke halo@modigi.id.",
      ],
    },
  ],
};

export const lisensiProduk: PolicyDoc = {
  slug: "lisensi",
  href: "/kebijakan/lisensi",
  navLabel: "Lisensi Produk",
  eyebrow: "Lisensi Produk",
  title: "Satu lisensi, satu domain. Ini rinciannya.",
  description:
    "Lisensi yang Anda beli diaktivasi resmi ke domain Anda dan tercatat di dashboard produknya. Berikut apa yang termasuk, apa yang tidak, dan apa yang terjadi saat masa aktif berakhir.",
  updated: REVISI,
  readMinutes: 4,
  icon: KeyRound,
  tldr: [
    "Lisensi original, diaktivasi ke satu domain, dan bisa dicek dari dashboard.",
    "Aktif 1 tahun: update dari wp-admin plus support WhatsApp 30 hari.",
    "Butuh pindah domain atau menambah situs? Bisa diatur, bilang saat memesan.",
  ],
  sections: [
    {
      id: "jenis",
      title: "Jenis lisensi yang kami sediakan",
      paragraphs: [
        "Standarnya satu lisensi untuk satu domain.",
        "Sebagian produk menyediakan lisensi multi-situs. Kalau Anda mengelola beberapa website, sebutkan jumlahnya saat memesan supaya admin menghitung paket yang paling hemat.",
      ],
    },
    {
      id: "aktivasi",
      title: "Aktivasi",
      bullets: [
        "Lisensi diaktivasi setelah pembayaran terkonfirmasi — rata-rata di bawah 5 menit pada jam operasional.",
        "Anda menerima lisensi aktif di dashboard produknya, plus panduan singkat pemasangan.",
        "Pemasangannya sama seperti plugin WordPress lain: unggah, aktifkan, lalu masukkan kunci lisensi.",
      ],
    },
    {
      id: "masa-aktif",
      title: "Masa aktif dan update",
      bullets: [
        "Lisensi aktif 1 tahun sejak tanggal aktivasi.",
        "Versi baru muncul di menu Update wp-admin, tinggal klik Update seperti biasa.",
        "Versi terbaru setiap produk selalu tercantum di tab Spesifikasi halaman produk.",
        "Setelah masa aktif berakhir, plugin tetap jalan. Yang berhenti hanya update dan support.",
        "Perpanjangan bisa dilakukan kapan saja, tidak harus menunggu masa aktif habis.",
      ],
    },
    {
      id: "pindah",
      title: "Pindah domain dan pindah website",
      paragraphs: [
        "Selama masa aktif berjalan, Anda bisa memindahkan lisensi ke domain lain tanpa biaya tambahan. Cukup beri tahu admin domain lama dan barunya.",
        "Permintaan pindah kami proses pada jam operasional, setiap hari pukul 08.00–22.00 WIB.",
      ],
    },
    {
      id: "status",
      title: "Cara mengecek status lisensi",
      paragraphs: [
        "Status lisensi terlihat dari dashboard produknya: aktif, mau habis, atau perlu diperpanjang.",
        "Kalau muncul peringatan “lisensi tidak aktif” padahal sudah diaktivasi, cek dulu koneksi website Anda ke layanan produk tersebut. Kalau tetap bermasalah, chat admin — kami bantu telusuri.",
      ],
    },
    {
      id: "tidak-termasuk",
      title: "Yang tidak termasuk dalam lisensi",
      bullets: [
        "Hak menjual, membagikan, atau menyewakan lisensinya ke pihak lain.",
        "Kepemilikan software dan merek dagangnya — itu tetap milik pembuat produk.",
        "Biaya layanan lain yang website Anda butuhkan, seperti hosting, domain, atau plugin pihak lain.",
        // ← PERLU DIPUTUSKAN (pemilik toko): apakah kustomisasi khusus di luar
        // bawaan produk memang tidak termasuk? Kalau Anda melayaninya, hapus baris ini.
        "Kustomisasi atau perubahan kode khusus di luar fitur bawaan produk.",
      ],
    },
    {
      id: "perpanjangan",
      title: "Perpanjangan",
      paragraphs: [
        "Belum ada penagihan otomatis di sini, dan kami tidak menyimpan data pembayaran Anda. Admin akan mengingatkan lewat chat sebelum masa aktif berakhir, lalu Anda bebas memutuskan.",
      ],
      note: "Masa aktif yang berakhir tidak mematikan plugin Anda. Website Anda tetap aman dan bisa dipakai seperti biasa.",
    },
    {
      id: "kontak",
      title: "Butuh lisensi khusus?",
      paragraphs: [
        "Pembelian dalam jumlah banyak, kebutuhan multi-situs, atau kerja sama lainnya: kirim detailnya ke halo@modigi.id. Kami balas pada jam operasional.",
      ],
    },
  ],
};

/** Urutan dokumen di navigasi — sengaja sama dengan urutan link di footer. */
export const policies: PolicyDoc[] = [
  syaratKetentuan,
  kebijakanPrivasi,
  refundGaransi,
  lisensiProduk,
];
