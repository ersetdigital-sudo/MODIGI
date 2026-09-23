import { Trash2 } from "lucide-react";

import { hapusKategoriAction, simpanKategoriAction } from "@/app/actions/admin";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/buttons";
import { Card, Field, Input, Textarea } from "@/components/admin/ui";

/**
 * Pengelola kategori.
 *
 * Bentuknya sengaja "daftar formulir": setiap kategori adalah satu `<form>` kecil
 * yang menyimpan perubahannya sendiri. Jadi tidak ada mode edit yang perlu
 * dinyalakan/dimatikan, dan mengubah satu kategori tidak mengirim data kategori
 * lain — sekaligus aman kalau dua tab dibuka bersamaan.
 */
export function CategoryManager({
  categories,
  jumlahProduk,
}: {
  categories: { slug: string; name: string; description: string; sort_order: number }[];
  /** slug → jumlah produk yang memakainya. */
  jumlahProduk: Map<string, number>;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Card title="Tambah kategori" description="Kategori baru langsung muncul di beranda & halaman kategori.">
        <form action={simpanKategoriAction} className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama kategori" htmlFor="kategori-baru-nama" required>
            <Input id="kategori-baru-nama" name="name" placeholder="Marketing" required />
          </Field>

          <Field label="Slug" htmlFor="kategori-baru-slug" hint="Kosongkan untuk dibuat dari nama.">
            <Input id="kategori-baru-slug" name="slug" placeholder="marketing" />
          </Field>

          <Field label="Keterangan" htmlFor="kategori-baru-deskripsi" className="sm:col-span-2">
            <Textarea
              id="kategori-baru-deskripsi"
              name="description"
              rows={2}
              placeholder="Kelola kampanye dan pelanggan"
            />
          </Field>

          <div className="sm:col-span-2">
            <SubmitButton pendingLabel="Menambah…">Tambah kategori</SubmitButton>
          </div>
        </form>
      </Card>

      {categories.map((kategori) => {
        const dipakai = jumlahProduk.get(kategori.slug) ?? 0;

        return (
          <Card
            key={kategori.slug}
            title={kategori.name}
            description={
              dipakai > 0
                ? `Dipakai ${dipakai} produk — kategori ini belum bisa dihapus.`
                : "Belum dipakai produk mana pun."
            }
          >
            <form action={simpanKategoriAction} className="grid gap-5 sm:grid-cols-2">
              <input type="hidden" name="slug_lama" value={kategori.slug} />

              <Field label="Nama" htmlFor={`nama-${kategori.slug}`} required>
                <Input id={`nama-${kategori.slug}`} name="name" defaultValue={kategori.name} required />
              </Field>

              <Field
                label="Slug"
                htmlFor={`slug-${kategori.slug}`}
                hint="Mengubah slug otomatis memindahkan produknya ke slug baru."
              >
                <Input id={`slug-${kategori.slug}`} name="slug" defaultValue={kategori.slug} />
              </Field>

              <Field label="Keterangan" htmlFor={`deskripsi-${kategori.slug}`} className="sm:col-span-2">
                <Input
                  id={`deskripsi-${kategori.slug}`}
                  name="description"
                  defaultValue={kategori.description}
                />
              </Field>

              <Field
                label="Urutan"
                htmlFor={`urutan-${kategori.slug}`}
                hint="Angka kecil tampil lebih dulu."
              >
                <Input
                  id={`urutan-${kategori.slug}`}
                  name="sort_order"
                  inputMode="numeric"
                  defaultValue={kategori.sort_order}
                />
              </Field>

              <div className="flex items-end gap-3 sm:col-span-2">
                <SubmitButton variant="kedua" pendingLabel="Menyimpan…">
                  Simpan
                </SubmitButton>
              </div>
            </form>

            {/* Form terpisah: menghapus tidak boleh ikut terkirim saat menyimpan. */}
            <form action={hapusKategoriAction} className="mt-4 border-t border-[#f0f0f3] pt-4">
              <input type="hidden" name="slug" value={kategori.slug} />

              <ConfirmSubmit
                message={`Hapus kategori “${kategori.name}”?`}
                title={dipakai > 0 ? "Masih dipakai produk" : "Hapus kategori"}
                className={dipakai > 0 ? "pointer-events-none opacity-50" : undefined}
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
                Hapus kategori
              </ConfirmSubmit>

              {dipakai > 0 ? (
                <p className="mt-2 text-[12.5px] text-[#6f6f74]">
                  Pindahkan {dipakai} produknya ke kategori lain dulu, lalu kategori ini bisa dihapus.
                </p>
              ) : null}
            </form>
          </Card>
        );
      })}

    </div>
  );
}
