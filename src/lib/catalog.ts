import { cache } from "react";
import { Boxes } from "lucide-react";

import { categories as kategoriLokal } from "@/data/categories";
import { products as produkLokal } from "@/data/products";
import { ambilSupabase, supabaseSiap, type BarisProduk } from "@/lib/supabase";
import type { BarisKategori } from "@/lib/supabase";
import type { CartProduct, Category, Product, ProductFaq, ProductSpec } from "@/types";

/**
 * Sumber katalog situs depan: **Supabase**.
 *
 * `data/products.ts` & `data/categories.ts` tetap ada dan berperan sebagai:
 * 1. **data awal (seed)** — isinya sudah diunggah ke Supabase, dan
 * 2. **cadangan** kalau Supabase belum dikonfigurasi atau query-nya gagal.
 *
 * Jadi situs tidak pernah tampil kosong: kalau database tidak bisa dihubungi,
 * yang muncul adalah katalog statis, bukan halaman error. Sebaliknya, begitu
 * admin mengubah produk di dashboard, halaman situs ikut berubah
 * (`revalidatePath` dipanggil dari server action admin).
 *
 * Dipakai `cache()` dari React supaya satu query hanya jalan sekali per request
 * walau beberapa komponen (layout, kartu, drawer keranjang) memintanya.
 */

// ---------------------------------------------------------------------------
// Pemetaan baris database → tipe `Product`
// ---------------------------------------------------------------------------

/**
 * `products` (database) → `Product` (bentuk yang dipakai komponen).
 *
 * Beberapa hal sengaja jatuh ke data statis kalau kolomnya kosong:
 * - `testimonial` → hanya ada di data statis (belum punya kolom di database).
 * - `art.logo` / `art.image` → kalau database kosong, logo resmi lokal dipakai.
 *
 * `name`/`label` juga dipakai sebagai nilai cadangan supaya box produk baru yang
 * belum diisi warnanya tetap tampil rapi.
 */
function dariBaris(baris: BarisProduk, lokal?: Product): Product {
  const tone = baris.art_tone === "dark" ? "dark" : "light";

  return {
    slug: baris.slug,
    name: baris.name,
    categorySlug: baris.category_slug ?? "",
    tagline: baris.tagline,
    price: baris.price,
    compareAt: baris.compare_at,
    rating: Number(baris.rating),
    reviews: baris.reviews,
    sold: baris.sold,
    version: baris.version,
    updated: baris.updated,
    highlights: baris.highlights ?? [],
    description: baris.description,
    specs: (baris.specs ?? []) as ProductSpec[],
    faq: (baris.faq ?? []) as ProductFaq[],
    testimonial: lokal?.testimonial,
    art: {
      label: baris.art_label || baris.name,
      from: baris.art_from,
      to: baris.art_to,
      accent: baris.art_accent ?? undefined,
      tone,
      image: baris.image_url ?? lokal?.art.image,
      logo: baris.logo_url ?? lokal?.art.logo,
    },
  };
}

/** Baris kategori database → `Category` (ikon diambil dari kategori statis). */
function kategoriDariBaris(baris: BarisKategori): Category {
  return {
    slug: baris.slug,
    name: baris.name,
    description: baris.description,
    // Ikon tidak disimpan di database: kategori dengan slug yang sama memakai
    // ikon statisnya, kategori baru memakai ikon netral.
    icon: kategoriLokal.find((kategori) => kategori.slug === baris.slug)?.icon ?? Boxes,
  };
}

// ---------------------------------------------------------------------------
// Produk
// ---------------------------------------------------------------------------

const KOLOM_PRODUK =
  "id,slug,name,category_slug,tagline,description,price,compare_at,rating,reviews,sold,version,updated,highlights,specs,faq,image_url,image_public_id,logo_url,logo_public_id,art_label,art_from,art_to,art_accent,art_tone,status";

function produkLokalUntuk(slug: string) {
  return produkLokal.find((produk) => produk.slug === slug);
}

/**
 * Semua produk yang boleh tampil di situs (`status = 'aktif'`),
 * urut dari yang paling banyak terjual.
 */
export const ambilProduk = cache(async (): Promise<Product[]> => {
  if (!supabaseSiap()) return produkLokal;

  try {
    const { data, error } = await ambilSupabase()
      .from("products")
      .select(KOLOM_PRODUK)
      .eq("status", "aktif")
      .order("sold", { ascending: false })
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) return produkLokal;

    return (data as unknown as BarisProduk[]).map((baris) =>
      dariBaris(baris, produkLokalUntuk(baris.slug)),
    );
  } catch {
    return produkLokal;
  }
});

/** Satu produk berdasarkan slug — `undefined` kalau tidak ada / masih draft. */
export const ambilProdukBySlug = cache(async (slug: string): Promise<Product | undefined> => {
  if (!supabaseSiap()) return produkLokalUntuk(slug);

  try {
    const { data, error } = await ambilSupabase()
      .from("products")
      .select(KOLOM_PRODUK)
      .eq("slug", slug)
      .eq("status", "aktif")
      .maybeSingle();

    if (error) return produkLokalUntuk(slug);
    if (!data) return undefined;

    return dariBaris(data as unknown as BarisProduk, produkLokalUntuk(slug));
  } catch {
    return produkLokalUntuk(slug);
  }
});

/**
 * Bentuk ringkas katalog untuk keranjang di browser (harga, nama, artwork).
 *
 * Situs tidak punya endpoint API: ringkasan ini dikirim dari server component
 * lewat <CatalogSync /> lalu disimpan di memori tab, sehingga keranjang selalu
 * memakai harga terbaru dari database — bukan harga statis yang mungkin sudah
 * kedaluwarsa.
 */
export const ambilProdukRingkas = cache(async (): Promise<CartProduct[]> => {
  const daftar = await ambilProduk();

  return daftar.map(({ slug, name, price, compareAt, art }) => ({
    slug,
    name,
    price,
    compareAt,
    art,
  }));
});

// ---------------------------------------------------------------------------
// Kategori
// ---------------------------------------------------------------------------

/** Semua kategori, urut sesuai `sort_order` (diatur di dashboard). */
export const ambilKategori = cache(async (): Promise<Category[]> => {
  if (!supabaseSiap()) return kategoriLokal;

  try {
    const { data, error } = await ambilSupabase()
      .from("categories")
      .select("slug,name,description,sort_order,created_at")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) return kategoriLokal;

    return (data as BarisKategori[]).map(kategoriDariBaris);
  } catch {
    return kategoriLokal;
  }
});

/** Cari kategori dari slug — `undefined` kalau slug-nya tidak dikenal. */
export function cariKategori(daftar: Category[], slug: string) {
  return daftar.find((kategori) => kategori.slug === slug);
}

/** Nama kategori dari slug (cadangan: slug-nya sendiri). */
export function namaKategori(daftar: Category[], slug: string) {
  return cariKategori(daftar, slug)?.name ?? slug;
}

/** Jumlah produk per kategori — dipakai badge di kartu kategori. */
export function hitungPerKategori(daftarProduk: Product[]) {
  const hitung = new Map<string, number>();

  for (const produk of daftarProduk) {
    hitung.set(produk.categorySlug, (hitung.get(produk.categorySlug) ?? 0) + 1);
  }

  return hitung;
}

/** Filter katalog lama (`q` & `kategori`) — tetap dipakai halaman katalog. */
export function filterProduk(
  daftar: Product[],
  { q, kategori }: { q?: string; kategori?: string },
) {
  const keyword = q?.trim().toLowerCase();

  return daftar.filter((produk) => {
    const cocokKata =
      !keyword ||
      produk.name.toLowerCase().includes(keyword) ||
      produk.tagline.toLowerCase().includes(keyword);

    return cocokKata && (!kategori || produk.categorySlug === kategori);
  });
}
