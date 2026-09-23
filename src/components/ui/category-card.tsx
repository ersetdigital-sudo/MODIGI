import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Category } from "@/types";

/**
 * Kartu kategori — mengarah ke katalog dengan filter kategori.
 *
 * Bentuknya responsif, satu DOM untuk dua tampilan:
 * - < lg : tile ikon 48px + label 10px (baris geser horizontal), mengikuti wireframe mobile.
 * - >= lg: kartu penuh dengan deskripsi, teks rata kiri.
 *
 * Teks rata kiri di desktop (bukan center) supaya judul & deskripsi semua kartu
 * punya garis dasar yang lurus walau lebarnya sempit, dan `break-words` + `min-w-0`
 * mencegah kartu melar keluar kolom grid di layar kecil.
 */
export function CategoryCard({ category, className }: { category: Category; className?: string }) {
  const Icon = category.icon;

  return (
    <Link
      href={`/produk?kategori=${category.slug}`}
      className={cn(
        "group relative flex min-w-[60px] flex-col items-center gap-1.5 rounded-2xl text-center transition duration-200 focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none",
        "lg:min-w-0 lg:items-start lg:gap-2.5 lg:rounded-2xl lg:border lg:border-line lg:bg-white/70 lg:p-4 lg:text-left lg:hover:-translate-y-1 lg:hover:border-gold/50 lg:hover:bg-white lg:hover:shadow-card",
        className,
      )}
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line bg-white text-gold-deep shadow-card transition lg:size-11 lg:rounded-xl lg:bg-cream-200/70 lg:text-ink lg:shadow-none lg:group-hover:border-gold/60 lg:group-hover:bg-gold/15 lg:group-hover:text-gold-deep">
        <Icon className="size-5" aria-hidden="true" />
      </span>

      <span className="text-[10px] font-medium leading-tight text-muted lg:text-[13px] lg:font-bold lg:leading-snug lg:text-ink xl:text-sm">
        {category.name}
      </span>

      <span className="hidden min-w-0 break-words text-[11px] leading-snug text-muted lg:block xl:text-xs">
        {category.description}
      </span>

      <ArrowUpRight
        className="absolute right-3.5 top-3.5 hidden size-3.5 text-gold-deep opacity-0 transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 lg:block"
        aria-hidden="true"
      />
    </Link>
  );
}
