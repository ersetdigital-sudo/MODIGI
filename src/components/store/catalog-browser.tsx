"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { StoreProductCard } from "@/components/store/product-card";
import { catalogCopy, sortOptions, type SortValue } from "@/data/store";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const ALL = "all";

/** Nama kategori: dari server kalau ada, kalau tidak ya slug-nya. */
function nama(daftar: Record<string, string>, slug: string) {
  return daftar[slug] ?? slug;
}

type CatalogBrowserProps = {
  products: Product[];
  /**
   * slug → nama kategori, dikirim dari server (halaman katalog). Dipakai untuk
   * chip filter dan label kartu, supaya kategori yang dibuat di dashboard ikut
   * terbaca namanya — bukan slug mentahnya.
   */
  categoryNames?: Record<string, string>;
  /** Nilai awal dari URL (`?q=`, `?kategori=`, `?urut=`) — dibaca di server. */
  initialQuery?: string;
  initialCategory?: string;
  initialSort?: SortValue;
};

/**
 * Bagian interaktif halaman katalog: chip kategori, pencarian, dan urutan.
 *
 * Nilai awalnya dikirim dari server (dibaca dari query URL), jadi tampilan
 * pertama sudah tersaring — bagus untuk judul/tautan yang dibagikan sekaligus
 * menghindari ketidakcocokan saat hidrasi.
 */
export function CatalogBrowser({
  products,
  categoryNames = {},
  initialQuery = "",
  initialCategory = ALL,
  initialSort = "pop",
}: CatalogBrowserProps) {
  const [category, setCategory] = useState<string>(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortValue>(initialSort);

  /** Chip kategori — hanya kategori yang benar-benar dipakai produk. */
  const chips = useMemo(() => {
    const slugs = [...new Set(products.map((product) => product.categorySlug))];

    return slugs.map((slug) => ({ slug, name: nama(categoryNames, slug) }));
  }, [products, categoryNames]);

  const list = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const categoryName = nama(categoryNames, product.categorySlug);
      const matchCategory =
        category === ALL ||
        product.categorySlug === category ||
        categoryName.toLowerCase() === category.toLowerCase();

      const haystack = `${product.name} ${categoryName} ${product.tagline}`.toLowerCase();

      return matchCategory && (!keyword || haystack.includes(keyword));
    });

    const sorted = [...filtered];
    if (sort === "low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "high") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "pop") sorted.sort((a, b) => b.sold - a.sold);

    return sorted;
  }, [products, categoryNames, category, query, sort]);

  return (
    <section className="mx-auto max-w-6xl px-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter kategori">
          <button
            type="button"
            className={cn("chip", category === ALL && "is-active")}
            aria-pressed={category === ALL}
            onClick={() => setCategory(ALL)}
          >
            {catalogCopy.allCategoriesLabel}
          </button>

          {chips.map((chip) => (
            <button
              key={chip.slug}
              type="button"
              className={cn("chip", category === chip.slug && "is-active")}
              aria-pressed={category === chip.slug}
              onClick={() => setCategory(chip.slug)}
            >
              {chip.name}
            </button>
          ))}
        </div>

        <div className="flex w-full gap-3 lg:w-auto">
          <div className="relative min-w-0 flex-1 lg:w-64">
            <Search
              className="pointer-events-none absolute left-3.5 top-3 size-[15px] text-[var(--muted)]"
              aria-hidden="true"
            />
            <label htmlFor="catalog-q" className="sr-only">
              Cari produk
            </label>
            <input
              id="catalog-q"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={catalogCopy.searchPlaceholder}
              className="w-full rounded-full border border-[var(--line)] bg-white py-2.5 pl-10 pr-4 text-[14px] outline-none transition focus:border-[var(--ink)]"
            />
          </div>

          <label htmlFor="catalog-sort" className="sr-only">
            Urutkan produk
          </label>
          <select
            id="catalog-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortValue)}
            className="shrink-0 rounded-full border border-[var(--line)] bg-white px-4 py-2.5 text-[14px] font-semibold outline-none transition focus:border-[var(--ink)]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p aria-live="polite" className="mt-5 text-[13px] text-[var(--muted)]">
        Menampilkan{" "}
        <span className="tabular font-semibold text-[var(--ink)]">{list.length}</span> produk
      </p>

      {list.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {list.map((product) => (
            <StoreProductCard
              key={product.slug}
              product={product}
              categoryName={nama(categoryNames, product.categorySlug)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-3xl border border-dashed border-[var(--line)] bg-white/60 px-6 py-16 text-center text-[15px] text-[var(--muted)]">
          {catalogCopy.emptyText}
        </p>
      )}
    </section>
  );
}
