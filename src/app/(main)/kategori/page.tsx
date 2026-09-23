import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes, FolderTree, Tag } from "lucide-react";

import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { StarRating } from "@/components/ui/star-rating";
import { categories } from "@/data/categories";
import { kategoriCta, kategoriHero, kategoriKosong, kategoriSections } from "@/data/kategori";
import { products } from "@/data/products";
import { formatRupiah } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: { absolute: "Kategori Produk — Pilih Sesuai Kebutuhan | MODIGI" },
  description:
    "Plugin, tema, dan tools MODIGI dikelompokkan sesuai kebutuhan: page builder, SEO, performa, keamanan, WooCommerce, tema, dan utility. Lihat jumlah produk dan harga mulai tiap kategori.",
};

/**
 * Halaman Kategori (/kategori) — tujuan link "Kategori" di menu header & footer.
 *
 * Isinya dihitung dari `categories.ts` + `products.ts`, jadi menambah produk atau
 * kategori tidak perlu menyentuh file ini. Kategori yang belum punya produk tetap
 * ditampilkan (dengan label "Belum ada produk") supaya tidak ada link yang
 * mengarah ke hasil pencarian kosong tanpa penjelasan.
 */
export default function KategoriPage() {
  const groups = categories.map((category) => {
    const items = products.filter((product) => product.categorySlug === category.slug);

    return {
      category,
      items,
      cheapest: items.length ? Math.min(...items.map((product) => product.price)) : null,
    };
  });

  const terisi = groups.filter((group) => group.items.length > 0);
  const hargaTerendah = Math.min(...products.map((product) => product.price));

  const statistik = [
    { label: "Kategori", value: String(categories.length), icon: FolderTree },
    { label: "Produk tersedia", value: String(products.length), icon: Boxes },
    { label: "Harga mulai", value: formatRupiah(hargaTerendah), icon: Tag },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_85%_0%,rgba(201,166,100,0.22),transparent_70%)]"
        />

        <Container className="relative py-14 sm:py-18 lg:py-24">
          <Eyebrow tone="onDark">{kategoriHero.eyebrow}</Eyebrow>

          <h1 className="mt-4 max-w-3xl text-[30px] font-extrabold leading-[1.08] tracking-[-0.03em] text-balance sm:text-[42px] lg:text-[52px]">
            {kategoriHero.title}
          </h1>

          <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-muted-dark sm:text-[17px]">
            {kategoriHero.description}
          </p>

          <div className="mt-7">
            <Link href={kategoriHero.action.href} className={buttonClass({ variant: "gold", size: "lg" })}>
              {kategoriHero.action.label}
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line-dark pt-8 sm:grid-cols-3">
            {statistik.map(({ label, value, icon: Icon }) => (
              <div key={label}>
                <dt className="flex items-center gap-2 text-muted-dark">
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em]">{label}</span>
                </dt>
                <dd className="tabular-nums mt-2 text-[24px] font-extrabold leading-none sm:text-[28px]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section aria-labelledby="pilih-kategori" className="py-14 sm:py-18 lg:py-20">
        <Container>
          {/* `text-gold-ink` (5,4:1) bukan `gold-deep` (3,3:1) — label 11px ini
              teks normal, jadi harus lolos ambang WCAG AA 4,5:1. */}
          <Eyebrow className="text-gold-ink">Kategori</Eyebrow>

          <h2
            id="pilih-kategori"
            className="mt-3 max-w-3xl text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-balance sm:text-[34px]"
          >
            {kategoriSections.grid.title}
          </h2>

          <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-muted">
            {kategoriSections.grid.description}
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map(({ category, items, cheapest }) => {
              const Icon = category.icon;
              const isi = (
                <>
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-cream-200 text-gold-deep transition group-hover:border-gold/60 group-hover:bg-gold/15">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>

                  <h3 className="mt-4 text-[17px] font-extrabold tracking-[-0.01em] text-ink">
                    {category.name}
                  </h3>

                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
                    {category.description}
                  </p>

                  <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] font-semibold text-ink">
                    {items.length > 0 ? (
                      <>
                        <span>{items.length} produk</span>
                        {/* Pakai `text-muted` (5:1), bukan `text-line` (1,3:1) —
                            titik pemisah tetap harus terbaca, bukan cuma hiasan. */}
                        <span aria-hidden="true" className="text-muted">
                          ·
                        </span>
                        <span className="text-muted">mulai {formatRupiah(cheapest ?? 0)}</span>
                      </>
                    ) : (
                      <span className="text-muted">{kategoriKosong}</span>
                    )}
                  </p>
                </>
              );

              if (items.length === 0) {
                return (
                  <li
                    key={category.slug}
                    className="flex flex-col rounded-2xl border border-dashed border-line p-5"
                  >
                    {isi}
                  </li>
                );
              }

              return (
                <li key={category.slug}>
                  <Link
                    href={`/produk?kategori=${category.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none"
                  >
                    {isi}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-gold-ink">
                      Lihat kategori
                      <ArrowRight
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="produk-per-kategori" className="pb-14 sm:pb-18 lg:pb-20">
        <Container>
          <Eyebrow className="text-gold-ink">Daftar Produk</Eyebrow>

          <h2
            id="produk-per-kategori"
            className="mt-3 max-w-3xl text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-balance sm:text-[34px]"
          >
            {kategoriSections.list.title}
          </h2>

          <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-muted">
            {kategoriSections.list.description}
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-10">
            {terisi.map(({ category, items }) => (
              <div key={category.slug}>
                <h3 className="text-[13px] font-bold uppercase tracking-[0.16em] text-gold-ink">
                  {category.name}
                </h3>

                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {items.map((product) => (
                    <li key={product.slug}>
                      <Link
                        href={`/produk/${product.slug}`}
                        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3.5 transition-colors hover:text-gold-ink focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none"
                      >
                        <span className="min-w-0">
                          <span className="block text-[15px] font-bold text-ink">{product.name}</span>
                          <StarRating rating={product.rating} reviews={product.reviews} className="mt-1" />
                        </span>
                        <span className="tabular-nums text-[15px] font-extrabold text-ink">
                          {formatRupiah(product.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="kategori-bantuan" className="pb-20">
        <Container>
          <div className="rounded-2xl bg-ink p-6 text-white sm:p-8">
            <h2
              id="kategori-bantuan"
              className="max-w-2xl text-[22px] font-extrabold tracking-[-0.01em] text-balance sm:text-[26px]"
            >
              {kategoriCta.title}
            </h2>

            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-dark">
              {kategoriCta.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={whatsappLink(kategoriCta.action.message)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass({ variant: "gold", size: "lg" })}
              >
                {kategoriCta.action.label}
              </a>

              {/* `py-1.5` bikin area kliknya ≥24px (WCAG 2.2) tanpa menggeser tata letak. */}
              <Link
                href="/bantuan"
                className="inline-block py-1.5 text-[14px] font-semibold text-muted-dark underline decoration-line-dark underline-offset-4 transition-colors hover:text-white"
              >
                atau baca pusat bantuan
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
