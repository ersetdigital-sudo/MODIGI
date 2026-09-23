import Image from "next/image";
import Link from "next/link";

import heroBackground from "@/assets/hero-background.png";
import { Container } from "@/components/ui/container";
import { SearchForm } from "@/components/ui/search-form";
import { heroGreeting, heroStats, popularSearches } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Hero halaman utama — dua tampilan dari satu DOM:
 * - < lg : sapaan + judul + pencarian di latar cream (kerangka ala aplikasi mobile).
 * - >= lg: hero gelap full-bleed dengan artwork, kata kunci populer, dan statistik.
 *
 * Banner promo geser sudah dihapus: mobile langsung masuk ke baris kategori setelah
 * kolom pencarian, jadi hero tidak lagi menumpuk dua blok konten di layar kecil.
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream lg:bg-ink lg:text-white">
      <HeroBackdrop />

      <Container className="relative">
        {/* pt-8 memberi ruang untuk pembatas gelombang header di mobile. */}
        <div className="max-w-2xl pb-2 pt-8 lg:py-24">
          <p className="text-sm text-muted lg:hidden">{heroGreeting}</p>

          <p className="hidden items-center gap-3 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-gold sm:tracking-[0.22em] lg:flex">
            Plugin Original, Website Lebih Maju
            <span className="hidden h-px w-10 shrink-0 bg-gold/50 sm:block" aria-hidden="true" />
          </p>

          <h1 className="mt-1 text-[26px] font-extrabold leading-[1.15] tracking-tight text-ink lg:mt-5 lg:text-[52px] lg:leading-[1.05] lg:text-white">
            Butuh Plugin WordPress?
            <br />
            Cari di <span className="text-gold-deep lg:text-gold">MODIGI</span>.
          </h1>

          <p className="mt-2.5 text-[13px] leading-relaxed text-muted lg:mt-5 lg:text-[15px] lg:text-muted-dark">
            Plugin dan tools pilihan untuk membangun, mengelola, dan mengembangkan website.
          </p>

          <SearchForm id="hero-search" className="mt-5 lg:mt-8" />

          <div className="mt-5 hidden flex-wrap items-center gap-2 lg:flex">
            <span className="text-xs font-medium text-muted-dark">Pencarian populer:</span>
            {popularSearches.map((keyword) => (
              <Link
                key={keyword}
                href={`/produk?q=${encodeURIComponent(keyword)}`}
                className="rounded-md border border-line-dark px-3 py-1 text-xs font-medium text-white/85 transition hover:border-gold hover:text-gold"
              >
                {keyword}
              </Link>
            ))}
          </div>

          <dl className="mt-10 hidden grid-cols-2 gap-x-3 gap-y-5 border-t border-line-dark pt-8 sm:grid-cols-4 sm:gap-x-0 sm:gap-y-6 lg:grid">
            {heroStats.map(({ value, label, icon: Icon }, index) => (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-2.5 sm:gap-3",
                  index > 0 && "sm:border-l sm:border-line-dark sm:pl-5",
                )}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line-dark text-gold sm:size-9">
                  <Icon className="size-3.5 sm:size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="text-base font-extrabold leading-none sm:text-lg">{value}</dt>
                  <dd className="mt-1 whitespace-nowrap text-[11px] leading-tight text-muted-dark sm:text-xs">
                    {label}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="hidden border-t border-line-dark py-5 text-center lg:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-dark">
            Lebih dari Sekadar Plugin
          </p>
        </div>
      </Container>
    </section>
  );
}

/**
 * Elemen dekoratif hero: artwork full-bleed (`src/assets/hero-background.png`) + lapisan gelap
 * supaya teks di sisi kiri tetap kontras, lalu teks vertikal sebagai aksen sudut.
 * Hanya tampil di desktop — di mobile hero memakai latar cream dengan kerangka ala aplikasi.
 *
 * Asset di-import (bukan path mentah) supaya URL-nya ikut ber-hash: cukup timpa filenya,
 * cache browser otomatis kebuang.
 */
function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
    >
      <Image
        src={heroBackground}
        alt=""
        fill
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <span className="absolute right-6 top-24 hidden text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-dark [writing-mode:vertical-rl] lg:block">
        Tools for a Better Tomorrow
      </span>
    </div>
  );
}
