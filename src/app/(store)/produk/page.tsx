import type { Metadata } from "next";
import Link from "next/link";

import { CatalogBrowser } from "@/components/store/catalog-browser";
import { WhatsappIcon } from "@/components/store/whatsapp-icon";
import { getCategoryName } from "@/data/categories";
import { products } from "@/data/products";
import { catalogCopy, sortOptions, type SortValue } from "@/data/store";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Semua Produk",
  description:
    "Katalog lengkap plugin WordPress premium original: page builder, SEO, performance, security, dan utility. Lisensi original, aktivasi instan.",
};

/** Ambil nilai tunggal dari searchParams yang bisa berupa array. */
function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Halaman katalog — hasil konversi `katalog-plugin-wordpress/pages/katalog/index.html`.
 *
 * Filter awal dibaca dari URL (`?q=`, `?kategori=`, `?urut=`) lalu diedit di sisi
 * klien oleh <CatalogBrowser />. Kategori dan opsi urutan divalidasi dulu supaya
 * nilai asal-asalan dari URL tidak bikin tampilan kosong.
 */
export default async function KatalogPage(props: PageProps<"/produk">) {
  const searchParams = await props.searchParams;

  const kategori = firstValue(searchParams.kategori);
  const urut = firstValue(searchParams.urut);

  const initialCategory =
    kategori && getCategoryName(kategori) !== kategori ? kategori : undefined;
  const initialSort = sortOptions.some((option) => option.value === urut)
    ? (urut as SortValue)
    : undefined;

  return (
    <>
      <section className="fade-up mx-auto max-w-6xl px-5 pb-6 pt-12">
        <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--ink)]">
            Beranda
          </Link>{" "}
          /{" "}
          <span className="font-semibold text-[var(--ink)]">{catalogCopy.breadcrumb}</span>
        </nav>

        <h1 className="mt-3 text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-balance md:text-[44px]">
          {catalogCopy.title}
        </h1>

        <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-[var(--muted)] text-pretty">
          {catalogCopy.description}
        </p>
      </section>

      <CatalogBrowser
        products={products}
        initialQuery={firstValue(searchParams.q)}
        initialCategory={initialCategory}
        initialSort={initialSort}
      />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="card p-8 text-center md:p-10">
          <h2 className="text-[24px] font-extrabold tracking-[-0.02em] md:text-[30px]">
            {catalogCopy.request.title}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[var(--muted)]">
            {catalogCopy.request.description}
          </p>
          <a
            className="btn btn-wa mt-6"
            href={whatsappLink(catalogCopy.request.message)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappIcon className="size-[18px]" />
            {catalogCopy.request.label}
          </a>
        </div>
      </section>
    </>
  );
}
