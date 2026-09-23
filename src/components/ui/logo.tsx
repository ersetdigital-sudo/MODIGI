import Image from "next/image";

import logoMark from "@/assets/logo-mark.png";
import { cn } from "@/lib/utils";

type LogoProps = {
  /** `onDark` untuk header/footer, `onLight` untuk latar terang. */
  tone?: "onDark" | "onLight";
  showWordmark?: boolean;
  className?: string;
};

/**
 * Logo MODIGI (mark artwork + wordmark teks).
 * Mark sengaja tanpa alt karena nama brand sudah diumumkan oleh wordmark / aria-label pembungkusnya.
 *
 * Catatan kontras: warna artwork-nya sudah terang (≈92% area mark lolos rasio 3:1 di atas
 * permukaan gelap), jadi satu asset dipakai untuk header, footer, maupun latar terang.
 *
 * Asset di `src/assets/` di-import (bukan path mentah) supaya URL-nya ikut ber-hash:
 * cukup timpa filenya, cache browser otomatis kebuang.
 */
export function Logo({ tone = "onDark", showWordmark = true, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={logoMark}
        alt=""
        loading="eager"
        className="h-10 w-auto"
      />

      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "text-[19px] font-extrabold tracking-[0.2em]",
              tone === "onDark" ? "text-white" : "text-ink",
            )}
          >
            MODIGI
          </span>
          <span
            className={cn(
              "mt-1 text-[7px] font-semibold uppercase tracking-[0.34em]",
              tone === "onDark" ? "text-muted-dark" : "text-muted",
            )}
          >
            Digital Products
          </span>
        </span>
      )}
    </span>
  );
}
