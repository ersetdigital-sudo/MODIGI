import { Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";

import { PluginBoxArt } from "@/components/ui/plugin-box-art";
import { StarRating } from "@/components/ui/star-rating";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { getCategoryName } from "@/data/categories";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  className?: string;
  /** Nama kategori dari database (cadangan: daftar kategori statis). */
  categoryName?: string;
};

/**
 * Kartu produk untuk grid katalog maupun section "Produk Terlaris".
 *
 * Dua tampilan, satu DOM:
 * - < lg : gaya aplikasi sesuai wireframe mobile — gambar tinggi tetap 112px,
 *   judul 2 baris, harga, dan tombol plus bulat di pojok kanan bawah.
 * - >= lg: kartu katalog lengkap (kategori, rating, tombol keranjang).
 *
 * Tanda original dipakai sama seperti di halaman katalog: seal terverifikasi
 * (`ui/verified-badge.tsx`) di samping nama produk — bukan chip teks.
 */
export function ProductCard({ product, className, categoryName }: ProductCardProps) {
  const namaKategori = categoryName ?? getCategoryName(product.categorySlug);

  return (
    <article
      className={cn(
        "group relative flex h-full min-w-0 flex-col rounded-2xl border border-line bg-white p-2 shadow-card transition duration-200 hover:border-gold/40 lg:p-3 lg:hover:-translate-y-1 lg:hover:shadow-lift",
        className,
      )}
    >
      <div className="relative h-28 overflow-hidden rounded-xl bg-cream-200/70 sm:aspect-square sm:h-auto">
        <PluginBoxArt art={product.art} className="p-4" />
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-2.5 lg:pt-4">
        <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-muted lg:block">
          {namaKategori}
        </p>

        <h3 className="mt-0.5 flex items-start gap-1.5 text-[13px] font-semibold leading-snug text-ink lg:mt-2 lg:text-[15px] lg:font-bold">
          <Link
            href={`/produk/${product.slug}`}
            className="line-clamp-2 min-w-0 transition-colors hover:text-gold-deep lg:line-clamp-none"
          >
            {product.name}
          </Link>
          <VerifiedBadge className="mt-[3px]" />
        </h3>

        <div className="mt-2 hidden flex-wrap items-center justify-between gap-x-2 gap-y-1 lg:flex">
          <StarRating rating={product.rating} reviews={product.reviews} />
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-2 pt-3 lg:pt-4">
          <p className="text-sm font-extrabold text-ink lg:text-[15px]">
            {formatRupiah(product.price)}
          </p>

          <button
            type="button"
            aria-label={`Tambah ${product.name} ke keranjang`}
            className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-full bg-ink text-gold shadow-md transition hover:bg-ink-700 lg:static lg:ml-auto lg:size-9 lg:shrink-0 lg:rounded-lg lg:border lg:border-line lg:bg-cream-200/60 lg:text-ink lg:hover:border-gold lg:hover:bg-gold"
          >
            <Plus className="size-4 lg:hidden" aria-hidden="true" />
            <ShoppingCart className="hidden size-4 lg:block" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
