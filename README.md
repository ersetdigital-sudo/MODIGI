# MODIGI — Digital Products Storefront

Storefront produk digital (lisensi plugin & tema WordPress) — katalog, halaman detail
produk dengan ulasan pelanggan, dan alur checkout via WhatsApp.

Dibangun dengan **Next.js 16 (App Router)**, **TypeScript**, dan **Tailwind CSS v4**.

![Next.js](https://img.shields.io/badge/Next.js-16.3-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

> **Catatan:** ini proyek portofolio. Data produk, harga, ulasan, dan nomor WhatsApp
> di repo ini adalah **contoh** — bukan toko yang sedang berjalan. Logo produk pihak
> ketiga (Elementor, WP Rocket, Wordfence, Rank Math, Essential Addons) tetap milik
> pemiliknya masing-masing dan dipakai apa adanya.

---

## Daftar Isi

- [Preview](#preview)
- [Fitur](#fitur)
- [Tumpukan](#tumpukan)
- [Menjalankan](#menjalankan)
- [Struktur Proyek](#struktur-proyek)
- [Route & Halaman](#route--halaman)
- [Mengubah Konten](#mengubah-konten)
- [Sistem Desain](#sistem-desain)
- [Catatan Teknis](#catatan-teknis)
- [Yang Perlu Diputuskan Sebelum Dipakai](#yang-perlu-diputuskan-sebelum-dipakai)
- [Roadmap](#roadmap)
- [Lisensi](#lisensi)

---

## Preview

**Desktop**

| Beranda | Katalog | Detail produk |
| :---: | :---: | :---: |
| ![Beranda MODIGI](docs/preview-home.png) | ![Katalog produk](docs/preview-catalog.png) | ![Detail produk](docs/preview-product.png) |

**Mobile** — hero ringkas ala aplikasi (sapaan, judul, kolom pencarian) di latar cream,
lalu baris kategori geser, grid 2 kolom, dan bottom tab bar + tombol keranjang

<p align="center">
  <img src="docs/preview-home-mobile.png" width="230" alt="Beranda versi mobile" />
  <img src="docs/preview-catalog-mobile.png" width="230" alt="Katalog versi mobile" />
  <img src="docs/preview-product-mobile.png" width="230" alt="Detail produk versi mobile" />
</p>

**Pusat bantuan** — 6 section ber-anchor yang ditautkan dari footer

![Pusat bantuan MODIGI](docs/preview-support.png)

**Halaman kebijakan** — satu kerangka untuk empat dokumen, dengan daftar isi
bernomor supaya bagian tertentu gampang dirujuk

![Syarat & Ketentuan MODIGI](docs/preview-kebijakan.png)

**Kategori & Testimoni** — halaman yang mengubah "belum tahu mau beli apa" dan
"boleh percaya nggak?" jadi langkah berikutnya

| Kategori | Testimoni |
| :---: | :---: |
| ![Kategori produk MODIGI](docs/preview-kategori.png) | ![Testimoni pembeli MODIGI](docs/preview-testimoni.png) |

**Keranjang & Checkout** — dari "suka produknya" sampai pesanan terkirim, tanpa akun

| Drawer keranjang | Halaman keranjang | Checkout |
| :---: | :---: | :---: |
| ![Drawer keranjang MODIGI](docs/preview-drawer.png) | ![Halaman keranjang MODIGI](docs/preview-keranjang.png) | ![Checkout MODIGI](docs/preview-checkout.png) |

| Halaman | Deskripsi singkat |
| --- | --- |
| `/` | Hero + pencarian, baris kategori, produk terlaris, trust bar, CTA |
| `/produk` | Katalog: filter kategori, pencarian, urutan, kartu produk dengan badge diskon |
| `/produk/[slug]` | Detail: tab informasi, 3 kartu statistik, ulasan, buy box sticky, bar beli mobile |
| `/kategori` | Semua kategori dengan jumlah produk & harga mulai, plus daftar produknya |
| `/testimoni` | Ulasan dari semua produk, dikelompokkan per produk |
| `/keranjang` | Daftar item + ubah jumlah + ringkasan (hemat, total) |
| `/checkout` | Formulir data pembeli + ringkasan + persetujuan lisensi |
| `/checkout/selesai` | Nomor pesanan, rincian, langkah pembayaran |
| `/kebijakan/*` | Empat dokumen: Syarat & Ketentuan, Privasi, Refund, Lisensi |

---

## Fitur

**Storefront**

- Katalog dengan **chip kategori, pencarian, dan urutan** (terlaris, rating, harga) —
  filter dibaca dari URL (`?q=`, `?kategori=`, `?urut=`) sehingga hasilnya bisa dibagikan
- Kartu produk: harga coret + chip diskon, rating, **seal verifikasi**, tombol keranjang
- Halaman detail: hero-stage artwork, **3 kartu statistik**, tab
  **Fitur / Deskripsi / Spesifikasi / FAQ**, buy box yang menempel saat scroll,
  blok "Cara pesan", produk terkait, dan bar beli khusus mobile
- **Ulasan ala marketplace**: ringkasan rating + sebaran bintang, filter per bintang,
  tombol "lihat ulasan lainnya", badge pembelian terverifikasi
- **Drawer keranjang** — menekan "Tambah ke Keranjang" (atau ikon keranjang di
  header / FAB di tab bar) membuka panel dari kanan: ubah jumlah, hapus item,
  lihat total, lalu langsung ke checkout tanpa meninggalkan halaman yang dibaca
- **Keranjang** — isinya disimpan di `localStorage` (hanya slug + jumlah), badge
  jumlah di header & tab bar mobile ikut berubah tanpa reload
- **Checkout** — formulir data pembeli (nama, WhatsApp, email, domain, catatan),
  ringkasan pesanan yang menempel saat scroll, dan persetujuan lisensi
- **Konfirmasi pesanan** — nomor pesanan, rincian item, data pembeli, dan langkah
  berikutnya. Isinya dibaca dari `localStorage`, **bukan dari URL**, jadi nomor
  pesanan & data pembeli tidak tertinggal di riwayat browser
- **Alur order WhatsApp**: checkout menghasilkan satu pesan pesanan yang lengkap
  (item, total, nomor pesanan, domain) dan membukanya di chat admin — jadi admin
  tidak perlu menanyakan ulang; tombol "Tanya Dulu" juga tetap tersedia

**Brand & bantuan**

- Beranda lengkap dengan showcase kategori dan trust bar
- **`/tentang`** — cerita, keunggulan, cara kerja, prinsip
- **`/bantuan`** — pusat bantuan 6 section ber-anchor (cara order, aktivasi, update,
  garansi, FAQ, kontak) yang ditautkan dari footer

**Fundamental**

- **Mobile shell ala aplikasi** di layar `< 1024px`: header dengan pembatas gelombang,
  hero ringkas (sapaan + pencarian), baris kategori, grid 2 kolom,
  bottom tab bar + tombol keranjang
- **Hero dua tampilan dari satu DOM**: mobile = panel cream ala aplikasi,
  desktop = panel gelap full-bleed dengan artwork. Isi desktop (eyebrow, chip
  pencarian populer, 4 statistik) disembunyikan di mobile dengan `lg:*`, bukan
  di-render ulang — jadi tidak ada duplikasi markup
- **SEO**: metadata per produk, halaman detail **ter-prerender saat build**,
  breadcrumb, struktur heading berurutan
- **Aksesibilitas**: indikator fokus di semua elemen interaktif, ikon dekoratif
  `aria-hidden`, label untuk pembaca layar, target pointer ≥ 24px
- **Responsif terukur**: diuji di 320 / 375 / 768 / 1024 / 1280 / 1440 px dengan
  nol horizontal scroll

---

## Tumpukan

| Bagian | Dipakai |
| --- | --- |
| Framework | Next.js 16.3 (App Router, Server Components) |
| UI | React 19.2, Tailwind CSS v4, Lucide Icons |
| Bahasa | TypeScript 5 |
| Utilitas | `clsx` + `tailwind-merge` (helper `cn`) |
| Data | File statis di `src/data/` — **tanpa database, tanpa API key** |
| Deploy | Vercel / Node.js (statis + beberapa halaman dinamis) |

---

## Menjalankan

Prasyarat: **Node.js 20+** dan npm.

```bash
npm install      # pasang dependensi
npm run dev      # jalankan di http://localhost:3000
npm run build    # production build + type checking
npm start        # jalankan hasil build
npm run lint     # ESLint
```

Tidak ada variabel environment yang dibutuhkan — semua konfigurasi toko ada di
`src/data/store.ts`.

---

## Struktur Proyek

```
src/
├─ app/
│  ├─ layout.tsx              # akar: font global + metadata saja
│  ├─ globals.css             # design token MODIGI (warna, font, shadow) via @theme
│  │
│  ├─ (main)/                 # chrome brand MODIGI (header, footer, tab bar mobile)
│  │  ├─ layout.tsx
│  │  ├─ page.tsx             # beranda — hanya menyusun urutan section
│  │  ├─ tentang/page.tsx     # halaman Tentang
│  │  ├─ kategori/page.tsx    # kategori + produk per kategori
│  │  ├─ testimoni/page.tsx   # ulasan lintas produk
│  │  └─ kebijakan/           # 4 dokumen kebijakan (satu kerangka yang sama)
│  │
│  └─ (store)/                # chrome store (tema cream/hijau)
│     ├─ layout.tsx
│     ├─ store.css            # tema store, di-scope ke `.store`
│     ├─ produk/
│     │  ├─ page.tsx          # katalog + filter dari search params
│     │  └─ [slug]/page.tsx   # detail produk (SSG via generateStaticParams)
│     ├─ keranjang/page.tsx   # keranjang (isi dari localStorage)
│     ├─ checkout/
│     │  ├─ page.tsx          # formulir data pembeli + ringkasan
│     │  └─ selesai/page.tsx  # konfirmasi pesanan
│     └─ bantuan/page.tsx     # pusat bantuan
│
├─ components/
│  ├─ layout/                 # header, footer, tab bar mobile
│  ├─ home/                   # section khusus beranda
│  ├─ cart/                   # keranjang: hook, tombol, daftar, form checkout
│  ├─ store/                  # komponen katalog & detail produk
│  ├─ kebijakan/              # kerangka dokumen kebijakan
│  └─ ui/                     # komponen kecil yang dipakai ulang
│
├─ assets/
│  ├─ logo-mark.png, hero-background.png
│  ├─ verified-badge.png      # seal verifikasi (dipakai di kartu, judul, ulasan)
│  ├─ products/               # foto produk
│  └─ brands/                 # logo RESMI tiap plugin (dipakai apa adanya)
│
├─ data/                      # SEMUA konten & daftar produk
│  ├─ site.ts                 # hero, statistik, trust bar, CTA
│  ├─ navigation.ts           # menu header, kolom footer, social media
│  ├─ categories.ts           # daftar kategori
│  ├─ products.ts             # produk: harga, versi, spesifikasi, FAQ
│  ├─ reviews.ts              # ulasan per produk + sebaran bintang
│  ├─ store.ts                # nomor WhatsApp + teks katalog & buy box
│  ├─ about.ts, support.ts    # copy halaman Tentang & Bantuan
│  ├─ policies.ts             # isi 4 dokumen kebijakan
│  └─ ...
│
├─ lib/                       # helper: cn, format Rupiah/angka, link WhatsApp
└─ types/                     # tipe data bersama
```

Prinsipnya: **komponen mengurus tampilan, folder `data/` mengurus isi.** Mengubah
teks atau menambah produk hampir selalu tidak perlu menyentuh komponen.

---

## Route & Halaman

| Route | Rendering | Keterangan |
| --- | --- | --- |
| `/` | Static | Beranda brand MODIGI |
| `/tentang` | Static | Cerita, keunggulan, cara kerja, prinsip |
| `/produk` | Dynamic (search params) | Katalog + filter kategori/pencarian/urutan |
| `/produk/[slug]` | **SSG** | Detail produk — 1 halaman per produk, dibangun saat build |
| `/bantuan` | Static | Pusat bantuan (6 section ber-anchor) |
| `/kategori` | Static | Kategori + produk per kategori, dihitung dari data |
| `/keranjang` | Static + klien | Isi keranjang dari `localStorage` (tidak diindeks) |
| `/checkout` | Static + klien | Formulir data pembeli + ringkasan pesanan (tidak diindeks) |
| `/checkout/selesai` | Static + klien | Konfirmasi pesanan terakhir (tidak diindeks) |
| `/testimoni` | Static | Ulasan lintas produk dari satu sumber data yang sama |
| `/kebijakan/syarat-ketentuan` | Static | Syarat & Ketentuan — 9 bagian |
| `/kebijakan/privasi` | Static | Kebijakan Privasi — 9 bagian |
| `/kebijakan/refund` | Static | Refund & Garansi — 7 bagian |
| `/kebijakan/lisensi` | Static | Lisensi Produk — 8 bagian |
| `/icon.png`, `/apple-icon.png` | Static | Favicon & ikon home screen iOS |

---

## Mengubah Konten

| Mau ubah apa | Edit di |
| --- | --- |
| Warna, radius, shadow, font | `src/app/globals.css` (blok `@theme`) |
| Teks hero, statistik, trust bar, CTA | `src/data/site.ts` |
| Menu header & link footer | `src/data/navigation.ts` |
| Tambah/edit produk | `src/data/products.ts` |
| Tambah/edit kategori | `src/data/categories.ts` |
| **Ulasan pembeli** | `src/data/reviews.ts` (produk tanpa data ulasan otomatis tidak menampilkan section) |
| **Nomor WhatsApp toko** | `src/data/store.ts` → `whatsappNumber` |
| Teks katalog, buy box, poin trust | `src/data/store.ts` |
| Teks keranjang / checkout / konfirmasi | `src/data/store.ts` → `cartCopy`, `checkoutCopy`, `orderDoneCopy` |
| Copy halaman Tentang / Bantuan | `src/data/about.ts`, `src/data/support.ts` |
| Copy halaman Kategori / Testimoni | `src/data/kategori.ts`, `src/data/testimoni.ts` |
| **Teks 4 dokumen kebijakan** | `src/data/policies.ts` (satu dokumen = satu objek) |
| Urutan section beranda | `src/app/(main)/page.tsx` |
| Tema halaman store (cream/hijau) | `src/app/(store)/store.css` |

### Menambah produk

```ts
// src/data/products.ts
{
  slug: "wpml-multilingual",
  name: "WPML Multilingual",
  categorySlug: "utility",     // harus ada di data/categories.ts
  price: 55_000,
  compareAt: 1_200_000,        // harga resmi → dasar harga coret & badge diskon
  rating: 4.7,
  reviews: 320,
  sold: 410,
  version: "4.6.x",
  updated: "12 Sep 2026",
  art: {
    label: "WPML",
    from: "#FFFFFF",           // gradient muka box
    to: "#E7F0FA",
    accent: "#2E7DD1",         // sisi + bibir box
    logo: wpmlLogo,            // logo resmi, taruh di src/assets/brands/
  },
  // …highlights, description, specs, faq
}
```

---

## Sistem Desain

Dua identitas visual dalam satu aplikasi, dipisah lewat **route group**:

| | Brand `(main)` | Store `(store)` |
| --- | --- | --- |
| Nuansa | Gelap + cream + emas | Cream + aksen hijau |
| Token | `@theme` di `globals.css` | Variabel CSS di `store.css` (scope `.store`) |
| Dipakai di | Beranda, Tentang, Kebijakan | Katalog, detail produk, Bantuan |

**Token global** (`src/app/globals.css`)

| Peran | Nilai |
| --- | --- |
| `ink` / `ink-700` | `#0b0b0c` / `#1b1b1e` — latar gelap & teks utama |
| `cream` / `cream-200` / `sand` | `#f7f3ec` / `#efe9dd` / `#ece3d2` — latar terang |
| `gold` / `gold-soft` / `gold-deep` | `#c9a664` / `#e2cb9c` / `#a3803c` — aksen brand (ikon, garis, latar) |
| `gold-ink` | `#7d5f28` — emas khusus **teks kecil di latar terang**: 5,4:1 di atas cream, sedangkan `gold-deep` hanya 3,3:1 (gagal WCAG AA) |
| `line` / `line-dark` | `#e7dfd1` / `#2b2b2e` — garis |
| `muted` / `muted-dark` | `#6f675b` / `#a2a2a6` — teks sekunder |
| `shadow-card` / `shadow-lift` | Elevasi kartu & hover |

**Token store** (`src/app/(store)/store.css`): `--bg`, `--surface`, `--ink`,
`--muted`, `--line`, `--accent` (`#15803d`), `--accent-soft`, `--amber`, `--radius`.

Tipografi memakai **Plus Jakarta Sans** lewat `next/font` (self-hosted, tanpa request
ke Google, tanpa layout shift) untuk seluruh situs — konsistensi brand lebih penting
daripada font display terpisah per halaman.

---

## Catatan Teknis

Beberapa keputusan yang sengaja diambil, dan alasannya:

1. **Dua chrome lewat route group.** `(main)` dan `(store)` punya layout, tema, dan
   CSS sendiri tanpa saling bocor — `store.css` di-scope ke `.store` supaya tidak
   menimpa gaya halaman brand.
2. **Filter katalog dibaca di server** dari `?q=`, `?kategori=`, `?urut=`; hanya
   bagian yang butuh interaksi (filter bintang di ulasan, tab produk) yang jadi
   Client Component. Hasil filter tetap bisa dibagikan dan dirender di server.
3. **Aset di-`import`, bukan path mentah.** URL-nya ber-hash konten, jadi menimpa
   file gambar langsung membatalkan cache browser — tanpa rename atau hard refresh.
4. **Logo brand pihak ketiga dipakai apa adanya** (tidak di-recolor, tidak digambar
   ulang) dan diambil dari kanal resmi vendor. Warna box disesuaikan lewat properti
   `tone` supaya logonya tetap kontras, bukan logonya yang diubah.
5. **Halaman produk ter-prerender** dengan `generateStaticParams`, plus metadata
   (`title`, `description`, Open Graph) per produk.
6. **Klaim & copy dipisah dari komponen.** Semua teks jualan ada di `src/data/`,
   memakai aturan: satu klaim hanya punya satu nilai di seluruh situs.
7. **UI diverifikasi dengan pengukuran**, bukan perkiraan: Chrome headless dipakai
   untuk memeriksa overflow horizontal, ukuran target sentuh, ukuran artwork, dan
   panjang baris teks di banyak lebar layar selama pengembangan.
8. **Hero mobile dipisah; dua blok promo dihapus.** Mobile memakai hero ringkas
   (sapaan + judul + pencarian) di latar cream, desktop memakai panel gelap dengan
   artwork. Banner promo geser dan kartu kode promo pernah dicoba di beranda mobile,
   keduanya dibuang: terlalu banyak konten berdesakan di satu layar kecil. Efeknya
   mobile langsung masuk ke baris kategori setelah kolom pencarian.
9. **Keranjang memakai `localStorage` sebagai store, dibaca lewat
   `useSyncExternalStore`** (`lib/cart.ts` + `components/cart/use-cart.ts`). Jadi
   tidak ada provider/context yang perlu dipasang: header, tab bar mobile, halaman
   keranjang, dan checkout semuanya membaca angka yang sama, dan tab lain yang
   mengubah keranjang pun ikut tersinkron. Mengubah isi keranjang membuat React
   otomatis render ulang semua yang membacanya.
   Yang disimpan hanya `slug` + jumlah — harga selalu diambil ulang dari katalog,
   sehingga tidak pernah ada harga basi yang tertinggal di browser pembeli.
   Status buka/tutup drawer juga store terpisah (`useCartDrawer`), supaya tombol di
   halaman produk, ikon di header, dan FAB di tab bar mobile bisa membuka panel yang
   sama tanpa saling mengirim prop.
10. **Checkout tanpa backend.** Pesanan disimpan di `localStorage` (untuk halaman
   konfirmasi) dan salinannya dikirim ke WhatsApp admin. Ini jujur terhadap kondisi
   sekarang: tidak ada server yang menampung data pembeli, dan tidak ada nomor
   rekening palsu yang ditampilkan di halaman konfirmasi — rincian pembayaran tetap
   dikirim admin lewat chat.
11. **Password WP-Admin TIDAK disimpan di browser.** Formulir checkout meminta
   kredensial WP-Admin (dipakai admin untuk memasang pluginnya), tapi
   `createOrder()` sengaja tidak memasukkannya ke objek pesanan — password hanya ada
   di memori form, ikut ke pesan WhatsApp, lalu dibuang dari state. Halaman
   konfirmasi menampilkan username tanpa passwordnya dan menyebutkan alasannya,
   dan formulir memberi catatan agar password diganti setelah plugin terpasang.
   Kalau keamanan jadi prioritas, langkah berikutnya adalah akun WP sementara atau
   tautan instalasi sekali-pakai — sudah masuk daftar di bawah.
12. **Drawer keranjang memakai `inert` saat tertutup.** Panel yang cuma digeser ke
   luar layar tetap bisa di-Tab — jadi panelnya benar-benar dimatikan (bukan sekadar
   transparan), `Escape` menutup, fokus dipindah ke panel saat dibuka dan
   dikembalikan ke tombol pemicunya saat ditutup, dan scroll halaman dikunci selama
   panel terbuka.
13. **Empat dokumen kebijakan memakai satu kerangka** (`components/kebijakan/`).
   Isinya di `data/policies.ts`, jadi menambah dokumen kelima cukup menambah satu
   objek + satu `page.tsx` sebaris. Navigasi (pindah dokumen & daftar isi) memakai
   `<details>` di mobile, jadi seluruh halaman jalan tanpa JavaScript, dan setiap
   bagian diberi nomor supaya bisa dirujuk ("lihat bagian 4").

---

## Yang Perlu Diputuskan Sebelum Dipakai

Isi keempat dokumen sudah lengkap dan konsisten dengan klaim di halaman lain, tapi
beberapa hal masih memakai nilai default dan **harus dikonfirmasi pemilik toko**.
Semuanya sudah ditandai `← PERLU DIPUTUSKAN` di `src/data/policies.ts`:

| Hal | Nilai sekarang | Ada di |
| --- | --- | --- |
| **Kredensial WP-Admin** | Diminta di checkout lalu dikirim lewat WhatsApp | `data/store.ts` → `checkoutCopy.passwordNote` |
| Identitas badan hukum & alamat | **belum dicantumkan** — hanya brand MODIGI | seluruh dokumen |
| Lama penyimpanan data pesanan | 12 bulan setelah masa aktif | Kebijakan Privasi → “Berapa lama data disimpan” |
| SLA permintaan data pembeli | balasan 1×24 jam, proses maks. 7 hari kerja | Kebijakan Privasi → “Hak Anda” |
| Waktu proses refund | disetujui 1×24 jam, dana 1–3 hari kerja | Refund & Garansi → “Berapa lama uangnya kembali” |
| Konsekuensi pelanggaran lisensi | lisensi bisa dinonaktifkan tanpa refund | Syarat & Ketentuan → “Yang tidak boleh dilakukan” |
| Kustomisasi kode khusus | tidak termasuk dalam lisensi | Lisensi Produk → “Yang tidak termasuk” |

Nomor WhatsApp, email (`halo@modigi.id`), jam operasional, dan seluruh angka klaim
(masa aktif 1 tahun, support 30 hari, garansi 7 hari) diambil dari `store.ts` &
`support.ts` — jadi satu nilai hanya hidup di satu tempat.

---

## Roadmap

- [x] **Keranjang** — `localStorage` + badge jumlah hidup di header & FAB mobile
- [x] **Halaman `/keranjang`** — ubah jumlah, hapus item, ringkasan, hemat
- [x] **Halaman `/checkout`** — data pembeli + domain, ringkasan, persetujuan lisensi
- [x] **Konfirmasi pesanan** — nomor pesanan, rincian, langkah pembayaran
- [x] **Halaman `/kategori` & `/testimoni`** — semua tautan header & footer hidup
- [ ] **Payment gateway** — QRIS/transfer otomatis, bukan konfirmasi manual di chat
- [ ] **Backend/CMS** untuk produk, pesanan, dan pengiriman lisensi otomatis
- [ ] **Akun pelanggan** — riwayat lisensi, perpanjangan (tombol "Masuk" masih
      mengarah ke `/masuk` yang belum ada)
- [ ] **Blog/artikel** untuk kebutuhan SEO

---

## Lisensi

Kode di repo ini dilisensikan **MIT** — lihat [LICENSE](LICENSE).

Aset pihak ketiga tidak termasuk dalam lisensi tersebut: nama dan logo produk
(Elementor, WP Rocket, Wordfence, Rank Math, Essential Addons, dan lainnya) adalah
merek dagang milik pemiliknya masing-masing, dipakai hanya untuk keperluan
identifikasi produk yang dijual.
