import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";

import { hapusProdukAction, ubahStatusProdukAction } from "@/app/actions/admin";
import { ConfirmSubmit, SubmitButton, tombol } from "@/components/admin/buttons";
import { Alert, Card, EmptyState, PageHeader, Pill } from "@/components/admin/ui";
import { formatRupiah } from "@/lib/format";
import { ambilSupabase, supabaseSiap, type BarisKategori, type BarisProduk } from "@/lib/supabase";

export const metadata: Metadata = { title: "Produk" };

/** Pesan hasil aksi yang dikirim lewat query string oleh server action. */
const pesanSukses: Record<string, string> = {
  dibuat: "Produk baru sudah dibuat dan tayang di situs (status aktif).",
  diperbarui: "Perubahan produk sudah disimpan.",
  dihapus: "Produk sudah dihapus, termasuk gambarnya di Cloudinary.",
};

const pesanGalat: Record<string, string> = {
  "nama-kosong": "Nama produk wajib diisi.",
};

/**
 * Daftar produk.
 *
 * Semua aksi cepat (aktif/draft, hapus) adalah formulir kecil di barisnya
 * masing-masing, jadi tidak ada dialog yang perlu dibuka — dan setiap aksi
 * mencoba ulang dengan aman kalau JavaScript belum termuat.
 */
export default async function ProdukAdminPage(props: PageProps<"/admin/produk">) {
  if (!supabaseSiap()) {
    return (
      <>
        <PageHeader title="Produk" />
        <Alert tone="gagal">Supabase belum dikonfigurasi.</Alert>
      </>
    );
  }

  const searchParams = await props.searchParams;
  const pesan = typeof searchParams.pesan === "string" ? searchParams.pesan : "";
  const galat = typeof searchParams.galat === "string" ? searchParams.galat : "";

  const supabase = ambilSupabase();

  const [{ data: produk }, { data: kategori }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  const daftar = (produk ?? []) as BarisProduk[];
  const namaKategori = new Map(
    ((kategori ?? []) as BarisKategori[]).map((baris) => [baris.slug, baris.name]),
  );

  return (
    <>
      <PageHeader
        title="Produk"
        description={`${daftar.length} produk di database. Yang berstatus draft tidak tampil di katalog.`}
        action={
          <Link href="/admin/produk/baru" className={tombol.utama}>
            <Plus className="size-4" aria-hidden="true" />
            Tambah produk
          </Link>
        }
      />

      {pesan && pesanSukses[pesan] ? <Alert tone="sukses">{pesanSukses[pesan]}</Alert> : null}
      {galat ? <Alert tone="gagal">{pesanGalat[galat] ?? `Terjadi kesalahan: ${galat}`}</Alert> : null}

      {daftar.length === 0 ? (
        <EmptyState
          title="Belum ada produk"
          description="Tambahkan produk pertama — setelah disimpan, ia langsung tayang di katalog dan beranda."
          action={
            <Link href="/admin/produk/baru" className={tombol.utama}>
              <Plus className="size-4" aria-hidden="true" />
              Tambah produk
            </Link>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {daftar.map((item) => {
            const gambar = item.image_url ?? item.logo_url;
            const aktif = item.status !== "draft";

            return (
              <li key={item.id}>
                <Card bodyClassName="flex flex-col gap-4 px-4 py-4">
                  <div className="flex flex-wrap items-start gap-4">
                    <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#eeeef2] bg-[#fafafb] p-1.5">
                      {gambar ? (
                        <Image
                          src={gambar}
                          alt=""
                          width={64}
                          height={64}
                          unoptimized
                          className="max-h-14 w-auto object-contain"
                        />
                      ) : (
                        <ImageIcon className="size-5 text-[#8a8a90]" aria-hidden="true" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[15.5px] font-bold tracking-[-0.01em]">{item.name}</p>
                        <Pill tone={aktif ? "hijau" : "netral"}>
                          {aktif ? "aktif" : "draft"}
                        </Pill>
                      </div>

                      <p className="mt-1 text-[12.5px] text-[#6f6f74]">
                        /produk/{item.slug}
                        {item.category_slug
                          ? ` · ${namaKategori.get(item.category_slug) ?? item.category_slug}`
                          : " · tanpa kategori"}
                      </p>

                      <p className="tabular mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[13.5px]">
                        <span className="font-bold">{formatRupiah(item.price)}</span>
                        {item.compare_at > item.price ? (
                          <span className="text-[#6f6f74] line-through">
                            {formatRupiah(item.compare_at)}
                          </span>
                        ) : null}
                        <span className="text-[#6f6f74]">
                          {item.sold.toLocaleString("id-ID")} terjual · {item.reviews.toLocaleString("id-ID")} ulasan
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/admin/produk/${item.id}`} className={tombol.kecil}>
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Edit
                      </Link>

                      <Link
                        href={`/produk/${item.slug}`}
                        target="_blank"
                        className={tombol.kecil}
                        title="Lihat halaman produknya"
                      >
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                        Lihat
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 border-t border-[#f0f0f3] pt-3">
                    <form action={ubahStatusProdukAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="status" value={aktif ? "draft" : "aktif"} />

                      <SubmitButton variant="kecil" pendingLabel="Mengubah…">
                        {aktif ? "Jadikan draft" : "Tayangkan"}
                      </SubmitButton>
                    </form>

                    <form action={hapusProdukAction}>
                      <input type="hidden" name="id" value={item.id} />

                      <ConfirmSubmit
                        message={`Hapus produk “${item.name}”? Gambarnya juga dihapus dari Cloudinary dan tindakan ini tidak bisa dibatalkan.`}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        Hapus
                      </ConfirmSubmit>
                    </form>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
