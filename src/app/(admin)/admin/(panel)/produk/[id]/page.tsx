import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";

import { hapusProdukAction } from "@/app/actions/admin";
import { ConfirmSubmit } from "@/components/admin/buttons";
import { ProductForm } from "@/components/admin/product-form";
import { Alert, Card, PageHeader } from "@/components/admin/ui";
import { formatWaktu } from "@/lib/format";
import { ambilSupabase, supabaseSiap, type BarisKategori, type BarisProduk } from "@/lib/supabase";

export const metadata: Metadata = { title: "Edit produk" };

/**
 * Edit satu produk — termasuk mengganti foto & logonya.
 *
 * Ditambah satu kartu "Hapus produk" di bawah: menghapus produk selalu punya
 * akibat (halaman detailnya hilang dari katalog), jadi tindakan itu dipisah dari
 * tombol simpan supaya tidak tertekan karena salah posisi.
 */
export default async function ProdukEditPage(props: PageProps<"/admin/produk/[id]">) {
  if (!supabaseSiap()) notFound();

  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const galat = typeof searchParams.galat === "string" ? searchParams.galat : "";

  const supabase = ambilSupabase();

  const [{ data: produk }, { data: kategori }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  if (!produk) notFound();

  const baris = produk as BarisProduk;

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
        title={baris.name}
        description={`Dibuat ${formatWaktu(baris.created_at)} · terakhir diubah ${formatWaktu(baris.updated_at)}`}
      />

      {galat ? <Alert tone="gagal">Gagal menyimpan: {galat}</Alert> : null}

      <ProductForm
        product={baris}
        categories={(kategori as BarisKategori[]) ?? []}
        galat={galat || undefined}
      />

      <Card
        className="mt-5"
        title="Hapus produk"
        description="Menghapus produk juga menghapus foto & logonya di Cloudinary. Tindakan ini tidak bisa dibatalkan."
      >
        <form action={hapusProdukAction}>
          <input type="hidden" name="id" value={baris.id} />

          <ConfirmSubmit
            message={`Hapus produk “${baris.name}”? Halaman /produk/${baris.slug} akan hilang dan gambar di Cloudinary ikut dihapus.`}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Hapus produk ini
          </ConfirmSubmit>
        </form>

        <p className="mt-3 text-[12.5px] leading-relaxed text-[#6f6f74]">
          Cuma ingin menyembunyikannya sementara? Ubah statusnya jadi <b>draft</b> di formulir
          atas — produknya hilang dari katalog tapi datanya tetap tersimpan.
        </p>
      </Card>
    </>
  );
}
