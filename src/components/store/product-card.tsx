import { ShoppingCart, Star } from "lucide-react";
import Link from "next/link";

import { VerifiedBadge } from "@/components/ui/verified-badge";
import { PluginBoxArt } from "@/components/ui/plugin-box-art";
import { getCategoryName } from "@/data/categories";
import { discountPercent } from "@/data/products";
import { formatCompact, formatRating, formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

/**
 * Kartu produk halaman katalog.
 *
 * Catatan desain: badge diskon TIDAK lagi ditempel di atas artwork (dulu menutupi
 * gambar produk). Sekarang potongan harganya jadi chip kecil di baris harga —
 * jadi artwork selalu bersih dan diskon tetap kelihatan.
 *
 * Ukuran media & artwork ikut membesar lewat breakpoint, jadi kartu tetap proporsional
 * dari grid 2 kolom (mobile) sampai 4 kolom (desktop).
 */
export function StoreProductCard({
  product,
  className,
  categoryName: namaDariServer,
}: {
  product: Product;
  className?: string;
  /**
   * Nama kategori dari database. Kalau tidak dikirim, dipakai daftar kategori
   * statis — cadangan untuk kategori yang isinya belum ada di database.
   */
  categoryName?: string;
}) {
  const categoryName = namaDariServer ?? getCategoryName(product.categorySlug);

  return (
    <Link
      href={`/produk/${product.slug}`}
      className={cn(
        "card group flex flex-col p-2.5 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:outline-none sm:p-3",
        className,
      )}
    >
      <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#fbf9f5] to-[#efeae1] ring-1 ring-black/[0.05]">
        {/* Sorot lembut di belakang artwork. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(255,255,255,0.9),transparent_75%)]"
        />

        <span className="cover-box relative h-full w-full overflow-hidden rounded-2xl">
          <PluginBoxArt
            art={product.art}
            sizes="(min-width: 1024px) 164px, (min-width: 640px) 152px, 112px"
            cover
          />
        </span>
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-3.5">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
          {categoryName}
        </p>

        {/* Badge verifikasi menempel di samping nama (marketplace-style), bukan
            lagi chip "Original" yang berebut ruang dengan rating. */}
        <h3 className="mt-1.5 flex items-start gap-1.5 text-[15px] font-bold leading-snug text-[var(--ink)] lg:text-[16px]">
          <span className="line-clamp-2 min-w-0">{product.name}</span>
          <VerifiedBadge className="mt-[3px]" />
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="tabular inline-flex items-center gap-1 text-[12.5px] font-semibold">
            <Star
              className="size-3.5 fill-[var(--amber)] text-[var(--amber)]"
              aria-hidden="true"
            />
            {formatRating(product.rating)}
            <span className="font-medium text-[var(--muted)]">
              ({formatCompact(product.reviews)})
            </span>
            <span className="sr-only">
              dari 5, berdasarkan {product.reviews} ulasan
            </span>
          </span>
        </div>

        {/* `flex-wrap` + ukuran yang mengecil di layar sempit: harga tidak akan
            pernah terpotong walau kartu hanya ~134px (grid 2 kolom di 320px). */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-2 gap-y-2 pt-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span className="tabular text-[11px] leading-none text-[var(--muted)] line-through sm:text-[11.5px]">
                {formatRupiah(product.compareAt)}
              </span>
              <span className="tabular rounded-full bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-bold leading-none text-[var(--accent)]">
                -{discountPercent(product)}%
              </span>
            </div>

            <p className="tabular mt-1.5 text-[15px] font-extrabold leading-none text-[var(--ink)] sm:text-[18px] lg:text-[19px]">
              {formatRupiah(product.price)}
            </p>
          </div>

          <span
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-white transition group-hover:scale-105 group-hover:bg-[var(--accent)] sm:size-9"
          >
            <ShoppingCart className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
