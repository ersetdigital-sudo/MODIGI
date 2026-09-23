import Image from "next/image";
import Link from "next/link";

import heroBackground from "@/assets/hero-background.png";
import { Container } from "@/components/ui/container";
import { SearchForm } from "@/components/ui/search-form";
import { heroStats, popularSearches } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Hero halaman utama — **satu tampilan untuk semua ukuran layar**: panel gelap
 * full-bleed dengan artwork, eyebrow emas, judul, kolom pencarian, kata kunci
 * populer, dan empat statistik. Yang berubah antar breakpoint hanya skala
 * tipografi + kerapatan jarak, jadi mobile & desktop tidak lagi dua desain berbeda.
 *
 * Isi teks/warna sepenuhnya dari token di `globals.css` dan data di `src/data/site.ts`.
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <HeroBackdrop />

      <Container className="relative">
        <div className="max-w-2xl py-10 sm:py-14 lg:py-24">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-gold sm:tracking-[0.22em]">
            Plugin Original, Website Lebih Maju
            <span className="hidden h-px w-10 shrink-0 bg-gold/50 sm:block" aria-hidden="true" />
          </p>

          <h1 className="mt-3 text-[27px] font-extrabold leading-[1.15] tracking-tight text-white lg:mt-5 lg:text-[52px] lg:leading-[1.05]">
            Butuh Plugin WordPress?
            <br />
            Cari di <span className="text-gold">MODIGI</span>.
          </h1>

          <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-dark lg:mt-5 lg:text-[15px]">
            Plugin dan tools pilihan untuk membangun, mengelola, dan mengembangkan website.
          </p>

          <SearchForm id="hero-search" className="mt-5 lg:mt-8" />

          <div className="mt-5 flex flex-wrap items-center gap-2">
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

          <dl className="mt-8 grid grid-cols-2 gap-x-3 gap-y-5 border-t border-line-dark pt-7 sm:grid-cols-4 sm:gap-x-0 sm:gap-y-6 lg:mt-10 lg:pt-8">
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

        <div className="border-t border-line-dark py-5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-dark">
            Lebih dari Sekadar Plugin
          </p>
        </div>
      </Container>
    </section>
  );
}

/**
 * Elemen dekoratif hero: artwork full-bleed (`src/assets/hero-background.png`) plus
 * lapisan gelap supaya teks tetap kontras, lalu teks vertikal sebagai aksen sudut.
 *
 * Lapisan gelapnya dua bentuk karena kebutuhan berbeda:
 * - mobile : tirai rata (`bg-ink/65`) — teks memakai hampir seluruh lebar layar,
 *            jadi seluruh bidang digelapkan. Angka 65% bukan tebakan: artwork ini
 *            memang gelap (median luminance 0,021 / puncak 0,364), dan pada 65%
 *            kontras teks putih terukur 13:1 — jauh di atas ambang WCAG AAA.
 * - desktop: gradien dari kiri — teks hanya di kolom kiri, artwork boleh terlihat.
 *
 * Asset di-import (bukan path mentah) supaya URL-nya ikut ber-hash: cukup timpa filenya,
 * cache browser otomatis kebuang.
 */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src={heroBackground}
        alt=""
        fill
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-ink/65 lg:hidden" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-ink via-ink/80 to-ink/30 lg:block" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <span className="absolute right-6 top-24 hidden text-[10px] font-semibold uppercase tracking-[0.4em] text-muted-dark [writing-mode:vertical-rl] lg:block">
        Tools for a Better Tomorrow
      </span>
    </div>
  );
}
