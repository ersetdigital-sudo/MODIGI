import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ImageIcon } from "lucide-react";

import { simpanProdukAction } from "@/app/actions/admin";
import { SubmitButton, tombol } from "@/components/admin/buttons";
import { Card, Field, Input, Select, Textarea } from "@/components/admin/ui";
import type { BarisKategori, BarisProduk } from "@/lib/supabase";

/**
 * Formulir produk — dipakai untuk **tambah** dan **edit**, satu formulir yang sama.
 *
 * Bentuk fieldnya sengaja mengikuti kolom tabel `products`, jadi apa pun yang
 * diisi di sini langsung tampil di halaman detail produk dengan susunan yang
 * identik dengan produk lama (tagline → deskripsi → fitur → spesifikasi → FAQ).
 *
 * Dua hal yang perlu diketahui admin:
 * - **Gambar**: ada dua kanal. Unggah berkas (diproses ke Cloudinary, maks 5 MB)
 *   atau tempel URL. Kalau keduanya diisi, berkas yang menang — dan berkas lama
 *   di Cloudinary otomatis dihapus supaya kuota tidak menumpuk.
 * - **Daftar bertingkat** (fitur, spesifikasi, FAQ) ditulis satu baris satu item
 *   supaya tidak perlu editor rumit; formatnya dijelaskan di bawah tiap kolom.
 */
export function ProductForm({
  product,
  categories,
  galat,
}: {
  product?: BarisProduk;
  categories: BarisKategori[];
  galat?: string;
}) {
  const baru = !product;

  return (
    <form action={simpanProdukAction} className="flex flex-col gap-5">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      {galat ? (
        <p className="rounded-xl border border-[#f7d7d3] bg-[#fdf4f3] px-4 py-3 text-[13.5px] font-medium text-[#a32b1d]">
          Gagal menyimpan: {galat}
        </p>
      ) : null}

      <Card
        title="Identitas produk"
        description="Nama, alamat halaman, dan kalimat pembuka yang tampil di bawah judul."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama produk" htmlFor="name" required>
            <Input
              id="name"
              name="name"
              defaultValue={product?.name ?? ""}
              placeholder="Elementor Pro"
              required
            />
          </Field>

          <Field
            label="Slug (alamat halaman)"
            htmlFor="slug"
            hint={
              product ? (
                <>
                  Halaman:{" "}
                  <Link
                    href={`/produk/${product.slug}`}
                    target="_blank"
                    className="font-semibold underline underline-offset-2"
                  >
                    /produk/{product.slug}
                  </Link>
                </>
              ) : (
                "Kosongkan untuk dibuat otomatis dari nama."
              )
            }
          >
            <Input
              id="slug"
              name="slug"
              defaultValue={product?.slug ?? ""}
              placeholder="elementor-pro"
            />
          </Field>

          <Field label="Kategori" htmlFor="category_slug">
            <Select
              id="category_slug"
              name="category_slug"
              defaultValue={product?.category_slug ?? ""}
            >
              <option value="">— tanpa kategori —</option>
              {categories.map((kategori) => (
                <option key={kategori.slug} value={kategori.slug}>
                  {kategori.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Status" htmlFor="status" hint="Draft tidak tampil di katalog.">
            <Select id="status" name="status" defaultValue={product?.status ?? "aktif"}>
              <option value="aktif">Aktif — tampil di situs</option>
              <option value="draft">Draft — disembunyikan</option>
            </Select>
          </Field>

          <Field
            label="Tagline"
            htmlFor="tagline"
            className="sm:col-span-2"
            hint="Satu kalimat, tampil di bawah nama produk dan di kartu katalog."
          >
            <Input
              id="tagline"
              name="tagline"
              defaultValue={product?.tagline ?? ""}
              placeholder="Bangun halaman WordPress apa pun tanpa koding."
            />
          </Field>

          <Field label="Deskripsi" htmlFor="description" className="sm:col-span-2">
            <Textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={product?.description ?? ""}
              placeholder="Paragraf penjelasan produk — tampil di tab Deskripsi."
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Harga & angka"
        description="Dipakai untuk harga, badge diskon, urutan katalog, dan kartu statistik."
      >
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Harga jual (Rp)" htmlFor="price" required>
            <Input
              id="price"
              name="price"
              inputMode="numeric"
              defaultValue={product?.price ?? 0}
              placeholder="50000"
              required
            />
          </Field>

          <Field label="Harga resmi (Rp)" htmlFor="compare_at" hint="Dasar harga coret & diskon.">
            <Input
              id="compare_at"
              name="compare_at"
              inputMode="numeric"
              defaultValue={product?.compare_at ?? 0}
              placeholder="1899000"
            />
          </Field>

          <Field label="Lisensi terjual" htmlFor="sold" hint="Makin besar, makin atas di katalog.">
            <Input id="sold" name="sold" inputMode="numeric" defaultValue={product?.sold ?? 0} />
          </Field>

          <Field label="Rating (0–5)" htmlFor="rating">
            <Input
              id="rating"
              name="rating"
              inputMode="decimal"
              defaultValue={product?.rating ?? 0}
              placeholder="4.9"
            />
          </Field>

          <Field label="Jumlah ulasan" htmlFor="reviews">
            <Input id="reviews" name="reviews" inputMode="numeric" defaultValue={product?.reviews ?? 0} />
          </Field>

          <Field label="Versi" htmlFor="version">
            <Input
              id="version"
              name="version"
              defaultValue={product?.version ?? ""}
              placeholder="3.25.x"
            />
          </Field>

          <Field
            label="Tanggal update"
            htmlFor="updated"
            hint="Ditulis apa adanya, mis. 12 Sep 2026."
          >
            <Input
              id="updated"
              name="updated"
              defaultValue={product?.updated ?? ""}
              placeholder="12 Sep 2026"
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Gambar produk"
        description="Unggah ke Cloudinary atau tempel URL. Kalau keduanya diisi, berkas unggahan yang dipakai."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-bold text-[#3a3a3f]">Foto produk</p>

            <div className="flex items-start gap-4">
              <span className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#e8e8ec] bg-[#f7f7f9]">
                {product?.image_url ? (
                  <Image
                    src={product.image_url}
                    alt=""
                    width={96}
                    height={96}
                    unoptimized
                    className="size-24 object-contain"
                  />
                ) : (
                  <ImageIcon className="size-6 text-[#8a8a90]" aria-hidden="true" />
                )}
              </span>

              <div className="min-w-0 flex-1 flex-col gap-3">
                <Field label="Unggah berkas" htmlFor="foto" hint="JPG, PNG, WebP, atau AVIF — maksimal 5 MB.">
                  <input
                    id="foto"
                    name="foto"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    className="block w-full cursor-pointer rounded-xl border border-dashed border-[#d8d8de] bg-white px-3 py-2.5 text-[13px] file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#151310] file:px-3 file:py-1.5 file:text-[12.5px] file:font-semibold file:text-white"
                  />
                </Field>

                <Field
                  label="atau URL gambar"
                  htmlFor="image_url"
                  hint="Kosongkan untuk memakai box 3D berlogo (tanpa foto)."
                >
                  <Input
                    id="image_url"
                    name="image_url"
                    defaultValue={product?.image_url ?? ""}
                    placeholder="https://…"
                  />
                </Field>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-bold text-[#3a3a3f]">
              Logo resmi brand <span className="font-normal text-[#6f6f74]">(muka box 3D)</span>
            </p>

            <div className="flex items-start gap-4">
              <span className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#e8e8ec] bg-white p-2">
                {product?.logo_url ? (
                  <Image
                    src={product.logo_url}
                    alt=""
                    width={80}
                    height={80}
                    unoptimized
                    className="max-h-20 w-auto object-contain"
                  />
                ) : (
                  <ImageIcon className="size-6 text-[#8a8a90]" aria-hidden="true" />
                )}
              </span>

              <div className="min-w-0 flex-1 flex-col gap-3">
                <Field label="Unggah logo" htmlFor="logo" hint="Pakai logo resmi vendor, jangan dimodifikasi.">
                  <input
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    className="block w-full cursor-pointer rounded-xl border border-dashed border-[#d8d8de] bg-white px-3 py-2.5 text-[13px] file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#151310] file:px-3 file:py-1.5 file:text-[12.5px] file:font-semibold file:text-white"
                  />
                </Field>

                <Field label="atau URL logo" htmlFor="logo_url">
                  <Input
                    id="logo_url"
                    name="logo_url"
                    defaultValue={product?.logo_url ?? ""}
                    placeholder="/brands/logo-resmi.svg"
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-[12.5px] leading-relaxed text-[#6f6f74]">
          Cloudinary menyimpan berkasnya; URL dan public_id-nya dicatat di database supaya
          berkas lama bisa dihapus otomatis saat diganti.
        </p>
      </Card>

      <Card
        title="Box produk (tampilan cadangan)"
        description="Dipakai kalau tidak ada foto: satu box 3D dengan logo resmi dan warna brand."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Label di box" htmlFor="art_label" hint="Biasanya nama produk.">
            <Input id="art_label" name="art_label" defaultValue={product?.art_label ?? ""} />
          </Field>

          <Field label="Warna muka" htmlFor="art_from">
            <Input
              id="art_from"
              name="art_from"
              type="color"
              defaultValue={product?.art_from ?? "#1f2937"}
              className="h-11 cursor-pointer p-1"
            />
          </Field>

          <Field label="Warna bayangan" htmlFor="art_to">
            <Input
              id="art_to"
              name="art_to"
              type="color"
              defaultValue={product?.art_to ?? "#0b0b0c"}
              className="h-11 cursor-pointer p-1"
            />
          </Field>

          <Field label="Warna aksen" htmlFor="art_accent" hint="Opsional — sisi & bibir box.">
            <Input
              id="art_accent"
              name="art_accent"
              type="color"
              defaultValue={product?.art_accent ?? "#c9a664"}
              className="h-11 cursor-pointer p-1"
            />
          </Field>

          <Field
            label="Jenis logo"
            htmlFor="art_tone"
            className="sm:col-span-2"
            hint="Pilih dark kalau logo brand-nya berwarna terang."
          >
            <Select id="art_tone" name="art_tone" defaultValue={product?.art_tone ?? "light"}>
              <option value="light">Terang — logo berwarna gelap</option>
              <option value="dark">Gelap — logo berwarna terang</option>
            </Select>
          </Field>
        </div>
      </Card>

      <Card title="Isi halaman detail" description="Fitur, spesifikasi, dan FAQ — satu baris satu item.">
        <div className="grid gap-5">
          <Field
            label="Poin fitur"
            htmlFor="highlights"
            hint="Satu fitur per baris. Contoh: “100+ widget Pro: form, slider, mega menu”."
          >
            <Textarea
              id="highlights"
              name="highlights"
              rows={5}
              defaultValue={product?.highlights?.join("\n") ?? ""}
            />
          </Field>

          <Field
            label="Spesifikasi"
            htmlFor="specs"
            hint="Format: Label | Nilai — satu baris satu baris tabel. Contoh: Masa aktif | 1 tahun update."
          >
            <Textarea
              id="specs"
              name="specs"
              rows={6}
              defaultValue={product?.specs?.map(([label, nilai]) => `${label} | ${nilai}`).join("\n") ?? ""}
            />
          </Field>

          <Field
            label="FAQ"
            htmlFor="faq"
            hint="Format: Pertanyaan | Jawaban — satu baris satu tanya-jawab."
          >
            <Textarea
              id="faq"
              name="faq"
              rows={6}
              defaultValue={product?.faq?.map(([tanya, jawab]) => `${tanya} | ${jawab}`).join("\n") ?? ""}
            />
          </Field>
        </div>
      </Card>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t border-[#e8e8ec] bg-[#f5f5f7]/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <SubmitButton pendingLabel={baru ? "Menyimpan produk…" : "Menyimpan perubahan…"}>
          {baru ? "Simpan produk" : "Simpan perubahan"}
        </SubmitButton>

        <Link href="/admin/produk" className={tombol.kedua}>
          Batal
        </Link>

        {product ? (
          <Link
            href={`/produk/${product.slug}`}
            target="_blank"
            className="ml-auto inline-flex min-h-6 items-center gap-1.5 text-[13px] font-semibold text-[#6f6f74] underline underline-offset-2"
          >
            Lihat di situs
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </form>
  );
}
