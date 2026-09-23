import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProductForm } from "@/components/admin/product-form";
import { Alert, PageHeader } from "@/components/admin/ui";
import { ambilSupabase, supabaseSiap, type BarisKategori } from "@/lib/supabase";

export const metadata: Metadata = { title: "Tambah produk" };

/**
 * Tambah produk baru.
 *
 * Memakai formulir yang sama dengan halaman edit, jadi produk baru otomatis
 * memiliki halaman detail dengan susunan yang identik: box produk, harga,
 * statistik, tab fitur/deskripsi/spesifikasi/FAQ, dan produk terkait.
 */
export default async function ProdukBaruPage(props: PageProps<"/admin/produk/baru">) {
  const searchParams = await props.searchParams;
  const galat = typeof searchParams.galat === "string" ? searchParams.galat : "";

  const kategori = supabaseSiap()
    ? ((await ambilSupabase().from("categories").select("*").order("sort_order")).data ?? [])
    : [];

  return (
    <>
      <Link
        href="/admin/produk"
        className="mb-4 inline-flex min-h-6 items-center gap-2 text-[13px] font-semibold text-[#6f6f74] transition-colors hover:text-[#151310]"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Kembali ke daftar produk
      </Link>

      <PageHeader
        title="Tambah produk"
        description="Isi bagian yang perlu saja — kosongkan yang belum ada. Setelah disimpan, produknya langsung tayang dengan tampilan yang sama seperti produk lain."
      />

      {!supabaseSiap() ? <Alert tone="gagal">Supabase belum dikonfigurasi.</Alert> : null}

      <ProductForm categories={(kategori as BarisKategori[]) ?? []} galat={galat || undefined} />
    </>
  );
}
