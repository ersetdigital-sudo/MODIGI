import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Clock, Star, Users } from "lucide-react";

import { MobileBuyBar } from "@/components/store/mobile-buy-bar";
import { ProductBuyBox } from "@/components/store/product-buy-box";
import { ProductReviews } from "@/components/store/product-reviews";
import { ProductTabs } from "@/components/store/product-tabs";
import { StoreProductCard } from "@/components/store/product-card";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { WhatsappIcon } from "@/components/store/whatsapp-icon";
import { PluginBoxArt } from "@/components/ui/plugin-box-art";
import { getCategoryName } from "@/data/categories";
import { getProduct, products } from "@/data/products";
import { orderSteps, productStatsCopy, secondOpinion } from "@/data/store";
import { formatCompact, formatRating, formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

/** Prerender semua halaman produk saat build (slug-nya sudah kita tahu). */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

/**
 * Satu kartu statistik di bawah judul produk.
 *
 * Susunannya sengaja seragam untuk keempat kartu: baris nilai (ikon + angka)
 * selalu di atas, label selalu menempel di bawah (`mt-auto`). Jadi kalau ada
 * label yang perlu 2 baris, kartunya tetap sejajar dengan yang lain.
 */
function Stat({
  icon: Icon,
  value,
  label,
  iconClassName,
  className,
}: {
  icon: LucideIcon;
  value: string;
  label: ReactNode;
  iconClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("stat flex flex-col", className)}>
      <div className="flex items-center gap-2">
        <Icon
          className={cn("size-4 shrink-0 text-[var(--muted)]", iconClassName)}
          aria-hidden="true"
        />
        <span className="tabular text-[16px] font-extrabold leading-none text-[var(--ink)]">
          {value}
        </span>
      </div>

      <p className="mt-auto pt-2 text-[11.5px] leading-tight text-[var(--muted)] text-pretty">
        {label}
      </p>
    </div>
  );
}

export async function generateMetadata(
  props: PageProps<"/produk/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);

  if (!product) return { title: "Produk tidak ditemukan" };

  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: `${product.name} — ${formatRupiah(product.price)}`,
      description: product.tagline,
    },
  };
}

/**
 * Halaman detail produk — hasil konversi
 * `katalog-plugin-wordpress/pages/produk/index.html`.
 *
 * Perubahan dari template: metabar harga di bawah tetap sama, tapi judul,
 * deskripsi, dan data produk dirender di server (bukan `innerHTML` di browser),
 * jadi isinya terbaca mesin pencari dan tiap produk punya URL sendiri.
 */
export default async function ProductDetailPage(props: PageProps<"/produk/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);

  if (!product) notFound();

  const glow = product.art.accent ?? product.art.to;
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 4);

  return (
    <div className="pb-24 lg:pb-0">
      <div className="mx-auto max-w-6xl px-5">
        <nav aria-label="Breadcrumb" className="pt-8 text-[13px] text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--ink)]">
            Beranda
          </Link>{" "}
          /{" "}
          <Link href="/produk" className="hover:text-[var(--ink)]">
            Katalog
          </Link>{" "}
          / <span className="font-semibold text-[var(--ink)]">{product.name}</span>
        </nav>

        {/* `min-w-0` di kedua kolom: tanpa itu item grid memakai `min-width: auto`
            (lebar min-content), dan baris tab yang tidak bisa dipecah melebarkan
            seluruh halaman ~19px di layar 320px. */}
        <div className="mt-5 grid items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
          <div className="min-w-0">
            <div className="hero-stage">
              <span className="grid-lines" aria-hidden="true" />
              <span className="glow" style={{ background: glow }} aria-hidden="true" />

              <div className="cover-box grid size-[220px] place-items-center overflow-hidden rounded-3xl bg-white p-3 shadow-2xl sm:size-[240px]">
                <PluginBoxArt
                  art={product.art}
                  className="p-2"
                  sizes="(min-width: 640px) 240px, 220px"
                />
              </div>
            </div>

            <div className="mt-7">
              <span className="kicker block">{getCategoryName(product.categorySlug)}</span>

              {/* Badge verifikasi duduk di samping nama produk, seperti di marketplace. */}
              <h1 className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[30px] font-extrabold leading-[1.1] tracking-[-0.03em] md:text-[42px]">
                <span className="text-balance">{product.name}</span>
                <VerifiedBadge className="size-[18px] md:size-5" />
              </h1>

              <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-[var(--muted)] text-pretty md:text-[17px]">
                {product.tagline}
              </p>
            </div>

            {/* Tiga kartu. Versi & tanggal update tidak lagi jadi kartu —
                informasinya ada di tabel Spesifikasi (satu sumber data).
                Di mobile kartu ketiga melebar penuh supaya tidak ada lubang di
                grid 2 kolom, dan `auto-rows-fr` menjaga tingginya seragam. */}
            <div className="mt-6 grid auto-rows-fr grid-cols-2 gap-3 md:grid-cols-3">
              <Stat
                icon={Star}
                iconClassName="fill-[var(--amber)] text-[var(--amber)]"
                value={`${formatRating(product.rating)} / 5`}
                label={`${formatCompact(product.reviews)} ${productStatsCopy.reviewsSuffix}`}
              />
              <Stat
                icon={Users}
                value={product.sold.toLocaleString("id-ID")}
                label={productStatsCopy.soldLabel}
              />
              <Stat
                icon={Clock}
                value={productStatsCopy.activationValue}
                label={productStatsCopy.activationLabel}
                className="col-span-2 md:col-span-1"
              />
            </div>

            <ProductTabs product={product} />
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <ProductBuyBox product={product} />

            <div className="card flex items-start gap-3 p-5">
              <span className="ico-wrap bg-[var(--accent-soft)] text-[var(--accent)]">
                <WhatsappIcon className="size-[18px]" />
              </span>
              <div>
                <p className="text-[14.5px] font-bold">{secondOpinion.title}</p>
                <p className="mt-0.5 text-[13px] text-[var(--muted)]">
                  {secondOpinion.description}
                </p>
                <a
                  className="mt-2 inline-block text-[13px] font-bold text-[var(--accent)] hover:underline"
                  href={whatsappLink(secondOpinion.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {secondOpinion.label}
                </a>
              </div>
            </div>
          </div>
        </div>

        <ProductReviews product={product} />

        <section className="card mt-14 p-6 md:p-8">
          <h2 className="text-[20px] font-extrabold tracking-[-0.02em]">Cara pesan</h2>

          <ol className="mt-5 grid gap-6 sm:grid-cols-3 sm:gap-7">
            {orderSteps.map(({ icon: Icon, title, description }, index) => (
              <li key={title} className="step-line">
                <span className="grid size-11 place-items-center rounded-2xl bg-[var(--ink)] text-white">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[11px] font-bold tracking-[0.14em] text-[var(--muted)]">
                  LANGKAH {index + 1}
                </p>
                <p className="mt-1 text-[15.5px] font-bold">{title}</p>
                <p className="mt-1 text-[13px] text-[var(--muted)]">{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[24px] font-extrabold tracking-[-0.02em] md:text-[30px]">
              Produk terkait
            </h2>
            <Link
              href="/produk"
              className="inline-flex items-center gap-2 text-[14px] font-bold transition-all hover:gap-3"
            >
              Lihat semua
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <StoreProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      </div>

      <MobileBuyBar product={product} />
    </div>
  );
}
