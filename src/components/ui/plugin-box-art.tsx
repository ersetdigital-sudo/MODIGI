import Image from "next/image";

import { cn } from "@/lib/utils";
import type { ProductArt } from "@/types";

type PluginBoxArtProps = {
  art: ProductArt;
  className?: string;
  /**
   * Petunjuk lebar tampil untuk gambar produk (`art.image`). Isi sesuai ukuran
   * wadahnya — kalau tidak, browser bisa mengambil varian yang terlalu kecil dan
   * gambarnya jadi sedikit kabur.
   */
  sizes?: string;
  /** Gunakan `object-cover` (isi penuh, potong tepi) alih-alih `object-contain`. */
  cover?: boolean;
};

/**
 * Mockup box produk 3D (axonometric) — SATU template untuk seluruh katalog.
 *
 * Yang berbeda antar produk hanya tiga hal: logo resmi (`art.logo`), nama produk
 * (`art.label`), dan warna brand (`art.from`/`art.to`/`art.accent`). Bentuk box,
 * sudut kamera, pencahayaan, bayangan, dan komposisinya identik — jadi semua box
 * berikutnya otomatis konsisten.
 *
 * Logo brand di-render APA ADANYA: tidak di-recolor, tidak dibuat ulang. Karena itu
 * `art.tone` dipilih per produk supaya logonya tetap kontras di muka box.
 *
 * Struktur box: muka depan (label) + sisi kanan + bibir atas, digambar dengan
 * `clip-path` (bukan transform 3D) supaya geometrinya pasti sama di semua browser.
 */
export function PluginBoxArt({ art, className, sizes, cover }: PluginBoxArtProps) {
  if (art.image) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        <Image
          src={art.image}
          alt=""
          fill
          sizes={sizes ?? "(min-width: 1024px) 240px, 45vw"}
          className={cn("drop-shadow-lg", cover ? "object-cover" : "object-contain")}
        />
      </div>
    );
  }

  const dark = art.tone === "dark";
  const accent = art.accent ?? art.to;
  const logoSrc = typeof art.logo === "string" ? art.logo : art.logo?.src;

  return (
    <div
      aria-hidden="true"
      className={cn("relative grid h-full w-full place-items-center", className)}
    >
      {/* Studio: sorot lembut di belakang box. */}
      <span className="absolute inset-0 bg-[radial-gradient(58%_46%_at_50%_40%,rgba(255,255,255,0.8),transparent_72%)]" />

      {/* Bayangan kontak + bayangan ambient (di bawah box, bikin kesan berdiri). */}
      <span className="absolute bottom-[4%] h-[7%] w-[50%] rounded-[50%] bg-ink/25 blur-md" />
      <span className="absolute bottom-[6%] h-[16%] w-[72%] rounded-[50%] bg-ink/[0.08] blur-2xl" />

      {/* Box. */}
      <div className="relative aspect-[4/5] h-[90%]">
        {/* Bibir atas box. */}
        <span
          className="absolute left-0 top-0 h-[10%] w-[84%]"
          style={{
            backgroundImage: `linear-gradient(90deg, color-mix(in srgb, ${accent} 74%, #000) 0%, color-mix(in srgb, ${accent} ${dark ? "100%" : "88%"}, #fff) 100%)`,
            clipPath: "polygon(0 100%, 19% 0, 100% 0, 100% 100%)",
          }}
        />

        {/* Sisi kanan box. */}
        <span
          className="absolute right-0 top-0 h-full w-[16%]"
          style={{
            backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${accent} 78%, #000) 0%, color-mix(in srgb, ${accent} 52%, #000) 100%)`,
            clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)",
          }}
        />

        {/* Muka depan box. */}
        <div
          className="absolute bottom-0 left-0 h-[90%] w-[84%] overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(158deg, ${art.from} 0%, ${art.to} 100%)`,
            boxShadow: dark
              ? "inset 0 0 0 1px rgba(255,255,255,0.10)"
              : "inset 0 0 0 1px rgba(11,11,12,0.05)",
          }}
        >
          {/* Kilau permukaan. */}
          <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-white/[0.2]" />

          {/* Logo resmi — apa adanya. */}
          {logoSrc && (
            <span className="absolute inset-x-[12%] bottom-[27%] top-[9%]">
              <Image
                src={logoSrc}
                alt=""
                fill
                unoptimized
                sizes="(min-width: 1024px) 200px, 45vw"
                className="object-contain"
              />
            </span>
          )}

          {/* Nama produk + garis aksen. */}
          <span className="absolute inset-x-[8%] bottom-[9%] flex flex-col items-center gap-[3px]">
            <span
              className={cn(
                "h-px w-[26%] opacity-30",
                dark ? "bg-white" : "bg-ink",
              )}
            />
            <span
              className={cn(
                "text-center text-[7px] font-extrabold uppercase leading-tight tracking-[0.14em]",
                dark ? "text-white/85" : "text-ink/75",
                art.textClassName,
              )}
            >
              {art.label}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
