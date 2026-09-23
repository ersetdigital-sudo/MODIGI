"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { PluginBoxArt } from "@/components/ui/plugin-box-art";
import { getCategoryName } from "@/data/categories";
import { trendingProducts } from "@/data/products";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Tiga produk pertama dipakai sebagai slide promo. */
const slides = trendingProducts.slice(0, 3);

/**
 * Banner promo geser (swipe) — mobile-only (`lg:hidden`), diletakkan di bawah hero
 * karena hero sendiri sekarang tampil identik dengan desktop.
 *
 * Meniru wireframe mobile: kartu cream dengan pola titik emas, teks di sisi kiri,
 * mockup box produk menempel di kanan, plus indikator titik di bawah kartu.
 * Titiknya mengikuti slide yang sedang dilihat (dihitung dari posisi scroll).
 */
export function PromoCarousel({ className }: { className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActive(Math.max(0, Math.min(slides.length - 1, index)));
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        role="group"
        aria-roledescription="carousel"
        aria-label="Promo produk pilihan"
        className="flex snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((product, index) => (
          <div
            key={product.slug}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} dari ${slides.length}`}
            className="min-w-full snap-center"
          >
            {/* Route detail produk belum ada, jadi diarahkan ke katalog terfilter. */}
            <Link
              href={`/produk?q=${encodeURIComponent(product.name)}`}
              className="relative flex min-h-[176px] items-center overflow-hidden rounded-3xl bg-cream-200 p-5 shadow-card transition focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none"
            >
              {/* Pola titik emas (dekoratif). */}
              <span
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(var(--color-gold-deep)_1px,transparent_1px)] [background-size:10px_10px]"
              />

              <div className="relative z-10 min-w-0 w-3/5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-deep">
                  {getCategoryName(product.categorySlug)}
                </p>
                <h3 className="mt-1.5 text-xl font-extrabold leading-tight tracking-tight text-ink">
                  {product.name}
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Harga mulai {formatRupiah(product.price)}
                </p>
                <span className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-xl bg-ink px-3.5 text-xs font-semibold text-white">
                  Lihat Produk
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
              </div>

              {/* Mockup box produk — template box yang sama dengan katalog. */}
              <span className="pointer-events-none absolute -bottom-4 -right-2 z-20 h-[118%] w-[50%]">
                <PluginBoxArt art={product.art} />
              </span>
            </Link>
          </div>
        ))}
      </div>

      {/* Indikator slide. */}
      <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
        {slides.map((product, index) => (
          <span
            key={product.slug}
            className={cn(
              "size-1.5 rounded-full transition-colors",
              index === active ? "bg-ink" : "bg-ink/20",
            )}
          />
        ))}
      </div>
    </div>
  );
}
