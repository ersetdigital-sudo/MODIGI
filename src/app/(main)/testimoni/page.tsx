import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MessageSquareQuote, Star, TrendingUp, Users } from "lucide-react";

import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { StarRating } from "@/components/ui/star-rating";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { getAllReviews, getProductReviews } from "@/data/reviews";
import { products } from "@/data/products";
import { testimoniCta, testimoniHero, testimoniSections, testimoniSummary } from "@/data/testimoni";
import { formatCompact, formatRating } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: "Testimoni Pembeli — Ulasan Asli per Produk | MODIGI" },
  description:
    "Ulasan pembeli MODIGI dikelompokkan per produk. Semuanya dari pembelian yang lisensinya sudah diaktivasi, termasuk ulasan yang bintangnya belum lima.",
};

/**
 * Halaman Testimoni (/testimoni) — tujuan link "Testimoni" di footer.
 *
 * Ulasannya diambil dari `reviews.ts`, sumber yang sama dengan halaman detail
 * produk, jadi tidak mungkin ada dua versi cerita. Ulasan dikelompokkan per produk
 * (bukan diacak) supaya pembaca bisa melihat polanya.
 */
export default function TestimoniPage() {
  const semuaUlasan = getAllReviews();
  const terverifikasi = semuaUlasan.filter((review) => review.verified).length;

  // Rata-rata berbobot: produk dengan ulasan lebih banyak ikut menaikkan/menurunkan.
  const totalUlasanProduk = products.reduce((total, product) => total + product.reviews, 0);
  const rataRata =
    products.reduce((total, product) => total + product.rating * product.reviews, 0) / totalUlasanProduk;

  const perProduk = products
    .map((product) => ({ product, ...getProductReviews(product.slug) }))
    .filter((item) => item.reviews.length > 0);

  const statistik = [
    { label: testimoniSummary.ratingLabel, value: formatRating(rataRata), icon: Star },
    { label: testimoniSummary.reviewsLabel, value: formatCompact(totalUlasanProduk), icon: MessageSquareQuote },
    { label: testimoniSummary.productsLabel, value: String(perProduk.length), icon: Users },
    { label: testimoniSummary.verifiedLabel, value: `${formatCompact(terverifikasi)} ulasan`, icon: BadgeCheck },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_85%_0%,rgba(201,166,100,0.22),transparent_70%)]"
        />

        <Container className="relative py-14 sm:py-18 lg:py-24">
          <Eyebrow tone="onDark">{testimoniHero.eyebrow}</Eyebrow>

          <h1 className="mt-4 max-w-3xl text-[30px] font-extrabold leading-[1.08] tracking-[-0.03em] text-balance sm:text-[42px] lg:text-[52px]">
            {testimoniHero.title}
          </h1>

          <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-muted-dark sm:text-[17px]">
            {testimoniHero.description}
          </p>

          <div className="mt-7">
            <Link href={testimoniHero.action.href} className={buttonClass({ variant: "gold", size: "lg" })}>
              {testimoniHero.action.label}
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line-dark pt-8 sm:grid-cols-4">
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

      <section aria-labelledby="ulasan-produk" className="py-14 sm:py-18 lg:py-20">
        <Container>
          {/* `text-gold-ink` (5,4:1) bukan `gold-deep` (3,3:1) — label 11px ini
              teks normal, jadi harus lolos ambang WCAG AA 4,5:1. */}
          <Eyebrow className="text-gold-ink">Ulasan Pembeli</Eyebrow>

          <h2
            id="ulasan-produk"
            className="mt-3 max-w-3xl text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-balance sm:text-[34px]"
          >
            {testimoniSections.list.title}
          </h2>

          <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-muted">
            {testimoniSections.list.description}
          </p>

          {/* Lompatan cepat ke tiap produk — tanpa JavaScript. */}
          <nav aria-label={testimoniSections.jump.label} className="mt-7">
            <ul className="flex flex-wrap gap-2">
              {perProduk.map(({ product }) => (
                <li key={product.slug}>
                  <a
                    href={`#${product.slug}`}
                    className="inline-flex h-9 items-center rounded-full border border-line bg-white px-3.5 text-[13px] font-semibold text-muted transition-colors hover:border-ink hover:text-ink focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none"
                  >
                    {product.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="mt-6 flex items-start gap-2.5 rounded-xl border border-sand bg-cream-200 px-4 py-3 text-[14px] leading-relaxed text-ink">
            <TrendingUp className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden="true" />
            {testimoniSummary.note}
          </p>

          <div className="mt-10 space-y-12">
            {perProduk.map(({ product, reviews }) => (
              <section key={product.slug} id={product.slug} className="scroll-mt-24">
                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-line pb-4">
                  <div className="min-w-0">
                    <h2 className="text-[22px] font-extrabold tracking-[-0.01em] text-ink sm:text-[26px]">
                      {product.name}
                    </h2>
                    <StarRating
                      rating={product.rating}
                      reviews={product.reviews}
                      className="mt-2 text-[12.5px]"
                    />
                  </div>

                  <Link
                    href={`/produk/${product.slug}`}
                    className="inline-flex h-9 items-center gap-1.5 text-[13.5px] font-bold text-gold-ink transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none"
                  >
                    Lihat produk
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <ul className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {reviews.map((review) => (
                    <li key={`${product.slug}-${review.name}`}>
                      <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card">
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="grid size-10 shrink-0 place-items-center rounded-full bg-cream-200 text-[15px] font-extrabold text-ink"
                          >
                            {review.name.charAt(0)}
                          </span>

                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 text-[14.5px] font-bold text-ink">
                              <span className="truncate">{review.name}</span>
                              {review.verified && <VerifiedBadge />}
                            </p>
                            {review.role && (
                              <p className="truncate text-[12.5px] text-muted">{review.role}</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-3.5 flex items-center gap-2">
                          <Stars rating={review.rating} />
                          <span className="text-[12px] text-muted">{review.date}</span>
                        </div>

                        <blockquote className="mt-3 text-[14.5px] leading-relaxed text-muted">
                          {review.text}
                        </blockquote>
                      </figure>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="testimoni-bantuan" className="pb-20">
        <Container>
          <div className="rounded-2xl bg-ink p-6 text-white sm:p-8">
            <h2
              id="testimoni-bantuan"
              className="max-w-2xl text-[22px] font-extrabold tracking-[-0.01em] text-balance sm:text-[26px]"
            >
              {testimoniCta.title}
            </h2>

            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-dark">
              {testimoniCta.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href={testimoniCta.primary.href} className={buttonClass({ variant: "gold", size: "lg" })}>
                {testimoniCta.primary.label}
              </Link>

              {/* `py-1.5` bikin area kliknya ≥24px (WCAG 2.2) tanpa menggeser tata letak. */}
              <a
                href={whatsappLink(testimoniCta.secondary.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-1.5 text-[14px] font-semibold text-muted-dark underline decoration-line-dark underline-offset-4 transition-colors hover:text-white"
              >
                atau {testimoniCta.secondary.label.toLowerCase()}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/** Lima bintang dengan isi sesuai rating — ikonnya dekoratif, teksnya untuk pembaca layar. */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <span className="sr-only">{formatRating(rating)} dari 5 bintang</span>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={cn("size-3.5", n <= rating ? "fill-gold text-gold" : "text-line")}
        />
      ))}
    </span>
  );
}
