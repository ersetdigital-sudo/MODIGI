import {
  ClipboardList,
  DownloadCloud,
  KeyRound,
  LifeBuoy,
  Mail,
  RefreshCw,
  ShieldCheck,
  Timer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Isi halaman Support (/bantuan).
 *
 * Strukturnya sengaja urut sesuai pertanyaan yang paling sering muncul setelah
 * orang membayar: "pesanannya gimana" → "cara aktifin" → "update gimana" →
 * "kalau bermasalah". Setiap section punya `id` yang dipakai juga oleh link
 * footer (`/bantuan#aktivasi`, dst).
 */

export const supportHero = {
  breadcrumb: "Support",
  eyebrow: "Pusat Bantuan",
  title: "Semua pertanyaan setelah bayar, dijawab di sini.",
  description:
    "Cara order, aktivasi lisensi, update, sampai garansi — semuanya ada di halaman ini. Kalau masih bingung, chat admin: rata-rata dibalas di bawah 5 menit pada jam operasional.",
  primary: {
    label: "Chat Admin Sekarang",
    message: "Halo, saya butuh bantuan soal pesanan di MODIGI.",
  },
  secondary: { label: "Lihat Katalog", href: "/produk" },
};

/** Kartu bantuan cepat di atas — sekaligus jadi navigasi ke tiap section. */
export const supportTopics: {
  anchor: string;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    anchor: "cara-order",
    title: "Cara order",
    description: "Tiga langkah dari pilih produk sampai bayar.",
    icon: ClipboardList,
  },
  {
    anchor: "aktivasi",
    title: "Aktivasi lisensi",
    description: "Apa yang Anda terima dan cara memasangnya.",
    icon: KeyRound,
  },
  {
    anchor: "update",
    title: "Update & masa aktif",
    description: "Update langsung dari dashboard, tanpa download manual.",
    icon: RefreshCw,
  },
  {
    anchor: "garansi",
    title: "Garansi & refund",
    description: "Kalau gagal aktivasi, uang kembali 100%.",
    icon: ShieldCheck,
  },
];

/** Section 1 — cara order. */
export const orderSection = {
  title: "Cara order",
  description:
    "Tidak ada keranjang dan tidak ada akun yang perlu dibuat. Pesanan diproses lewat WhatsApp supaya Anda bisa langsung bertanya sambil memesan.",
};

/** Section 2 — aktivasi. */
export const activationSection = {
  title: "Aktivasi lisensi",
  description:
    "Setelah pembayaran terkonfirmasi, lisensi diaktivasi ke domain yang Anda sebutkan. Anda tidak perlu memasang manual dari nol.",
  received: [
    "Lisensi aktif di dashboard WordPress Anda (lisensi terhubung ke domain yang Anda berikan)",
    "Panduan singkat pemasangan plugin beserta pengaturan yang disarankan",
    "Nama admin yang bisa dihubungi kalau ada kendala di tengah jalan",
  ],
  notes: [
    {
      title: "Ganti domain di kemudian hari",
      description: "Bisa, tinggal beri tahu admin domain lama dan barunya.",
    },
    {
      title: "Butuh lebih dari 1 website",
      description: "Sebutkan saat memesan, admin akan hitung paket yang lebih hemat.",
    },
  ],
};

/** Section 3 — update. */
export const updateSection = {
  title: "Update & masa aktif",
  description:
    "Plugin di-update seperti biasa dari dashboard WordPress Anda — tidak ada langkah tambahan, tidak ada file yang harus diunduh manual.",
  facts: [
    "Versi baru muncul di menu Update pada wp-admin, sama seperti plugin lain.",
    "Update tersedia 1 tahun sejak aktivasi, dan support WhatsApp 30 hari.",
    "Masa aktif dan cakupan update tiap produk tercantum di tab Spesifikasi halaman produk.",
    "Sesudah masa aktif berakhir, plugin tetap jalan — yang berhenti hanya update otomatis.",
  ],
};

/** Section 4 — garansi & refund. */
export const guaranteeSection = {
  title: "Garansi & refund",
  description:
    "Kalau lisensi tidak bisa diaktivasi dan kami tidak bisa menyelesaikannya, uang Anda kembali penuh. Syaratnya sesederhana itu.",
  covered: [
    "Lisensi tidak bisa aktif padahal data domain sudah benar",
    "Salah produk dari pihak kami (mis. terkirim versi yang berbeda)",
    "Pembayaran sudah masuk tapi lisensi tidak dikirim",
  ],
  notCovered: [
    "Kerusakan karena plugin dimodifikasi atau dicampur versi nulled",
    "Masalah hosting, tema, atau plugin pihak lain yang tidak berhubungan",
    "Permintaan refund setelah lisensi aktif dan dipakai lebih dari 7 hari",
  ],
};

/** Section FAQ — sengaja pendek, satu jawaban satu ide. */
export const supportFaq: [string, string][] = [
  [
    "Berapa lama pesanan diproses?",
    "Rata-rata di bawah 5 menit setelah pembayaran terkonfirmasi, termasuk di luar jam kerja. Kalau admin sedang tidak di tempat, pesan Anda tetap masuk dan dibalas berurutan.",
  ],
  [
    "Bagaimana cara memastikan ini lisensi original?",
    "Lisensi diaktivasi resmi ke domain Anda dan bisa dicek statusnya dari dashboard. Kami tidak menjual versi nulled atau crack — kalau produknya tidak bisa kami sediakan resmi, kami bilang terus terang.",
  ],
  [
    "Apakah bisa dipakai di beberapa website?",
    "Tergantung lisensinya. Sebagian produk 1 domain, sebagian bisa upgrade multi-situs. Sebutkan jumlah website Anda saat memesan supaya dihitung dari awal.",
  ],
  [
    "Kalau saya ganti domain, harus beli lagi?",
    "Tidak. Beri tahu admin domain lama dan barunya, lisensi akan dipindahkan selama masa aktif masih berjalan.",
  ],
  [
    "Masa aktifnya habis, plugin berhenti jalan?",
    "Plugin tetap jalan dan website Anda aman. Yang berhenti hanya update otomatis serta bantuan support. Anda bisa perpanjang kapan saja.",
  ],
  [
    "Bisa bayar dengan apa saja?",
    "Transfer bank, QRIS, dan e-wallet. Bukti pembayaran dikirim ke chat yang sama dengan tempat Anda memesan.",
  ],
];

/** Section kontak. */
export const contactSection = {
  title: "Masih butuh bantuan?",
  description:
    "Sebelum chat, siapkan tiga hal ini supaya masalahnya bisa langsung ditangani tanpa bolak-balik.",
  prepare: [
    "Nama produk yang Anda pesan",
    "Domain yang mau diaktivasi (mis. namasitus.com)",
    "Bukti transfer atau nomor pesanan",
  ],
};

export const contactChannels: {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  /** Kosongkan kalau bukan link (mis. jam operasional). */
  href?: string;
  /** Pesan WhatsApp untuk tombolnya. */
  message?: string;
}[] = [
  {
    label: "WhatsApp",
    value: "Chat dengan admin",
    note: "Jalur tercepat, rata-rata dibalas di bawah 5 menit.",
    icon: LifeBuoy,
    message: "Halo, saya butuh bantuan soal pesanan di MODIGI.",
  },
  {
    label: "Email",
    value: "halo@modigi.id",
    note: "Untuk pertanyaan panjang, invoice, atau kerja sama.",
    icon: Mail,
    href: "mailto:halo@modigi.id",
  },
  {
    label: "Jam operasional",
    value: "Setiap hari, 08.00–22.00 WIB",
    note: "Di luar jam itu pesan tetap masuk dan dibalas pagi berikutnya.",
    icon: Timer,
  },
];

/** Langkah-langkah pesan cepat, versi ringkas dari section cara order. */
export const quickOrderSteps: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: LifeBuoy,
    title: "Pilih produk",
    description: "Buka katalog, tentukan plugin yang Anda butuhkan.",
  },
  {
    icon: DownloadCloud,
    title: "Bayar & sebutkan domain",
    description: "Transfer bank atau QRIS, lalu kirim nama domain Anda.",
  },
  {
    icon: ShieldCheck,
    title: "Lisensi aktif",
    description: "Plugin siap dipakai dan langsung bisa di-update.",
  },
];
