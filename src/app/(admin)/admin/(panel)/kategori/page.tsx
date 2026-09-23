import type { Metadata } from "next";

import { CategoryManager } from "@/components/admin/category-manager";
import { Alert, PageHeader } from "@/components/admin/ui";
import { ambilSupabase, supabaseSiap, type BarisKategori } from "@/lib/supabase";

export const metadata: Metadata = { title: "Kategori" };

const pesanSukses: Record<string, string> = {
  tersimpan: "Kategori sudah disimpan.",
  dihapus: "Kategori sudah dihapus.",
};

const pesanGalat: Record<string, string> = {
  "nama-kosong": "Nama kategori wajib diisi.",
  "kategori-dipakai": "Kategori masih dipakai produk. Pindahkan produknya dulu ke kategori lain.",
};

/**
 * Kategori dipakai di tiga tempat: beranda (baris kategori), halaman /kategori,
 * dan label di kartu produk. Karena itu url-nya (`slug`) juga jadi bagian dari
 * alamat filter katalog (`/produk?kategori=seo-tools`) — mengubah slug akan
 * memindahkan produk yang memakainya, dan itu sudah ditangani server action.
 */
export default async function KategoriAdminPage(props: PageProps<"/admin/kategori">) {
  if (!supabaseSiap()) {
    return (
      <>
        <PageHeader title="Kategori" />
        <Alert tone="gagal">Supabase belum dikonfigurasi.</Alert>
      </>
    );
  }

  const searchParams = await props.searchParams;
  const pesan = typeof searchParams.pesan === "string" ? searchParams.pesan : "";
  const galat = typeof searchParams.galat === "string" ? searchParams.galat : "";

  const supabase = ambilSupabase();

  const [{ data: kategori }, { data: produk }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order").order("name"),
    supabase.from("products").select("category_slug"),
  ]);

  const jumlahProduk = new Map<string, number>();

  for (const baris of produk ?? []) {
    if (!baris.category_slug) continue;
    jumlahProduk.set(baris.category_slug, (jumlahProduk.get(baris.category_slug) ?? 0) + 1);
  }

  return (
    <>
      <PageHeader
        title="Kategori"
        description="Urutan di sini menentukan urutan tampil di beranda dan halaman /kategori."
      />

      {pesan && pesanSukses[pesan] ? <Alert tone="sukses">{pesanSukses[pesan]}</Alert> : null}
      {galat ? <Alert tone="gagal">{pesanGalat[galat] ?? `Terjadi kesalahan: ${galat}`}</Alert> : null}

      <CategoryManager categories={(kategori as BarisKategori[]) ?? []} jumlahProduk={jumlahProduk} />
    </>
  );
}
