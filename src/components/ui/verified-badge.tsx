import Image from "next/image";

import badge from "@/assets/verified-badge.png";
import { cn } from "@/lib/utils";

type VerifiedBadgeProps = {
  className?: string;
  /** Teks untuk pembaca layar & tooltip saat kursor diarahkan. */
  label?: string;
};

/**
 * Seal "terverifikasi" untuk menandai lisensi original — dipakai di samping nama
 * produk (kartu katalog, judul halaman detail) dan di samping nama pengulas.
 *
 * Memakai aset `src/assets/verified-badge.png` (ikon verified badge, 16×16).
 * Karena di-import, URL-nya ber-hash konten: ganti/timpa file-nya = cache browser
 * otomatis kebuang, tidak perlu hard refresh.
 *
 * ⚠️ Ukuran: asetnya bitmap 16px. Supaya tetap tajam, tampilkan di kisaran
 * 16–20px (default `size-4`). Kalau butuh lebih besar, sebaiknya pakai versi
 * vektor (SVG) dari sumber yang sama — tinggal ganti import di baris atas.
 */
export function VerifiedBadge({
  className,
  label = "Lisensi original terverifikasi",
}: VerifiedBadgeProps) {
  return (
    <span title={label} className="inline-flex shrink-0 items-center">
      <span className="sr-only">{label}</span>
      <Image
        src={badge}
        alt=""
        aria-hidden="true"
        width={16}
        height={16}
        className={cn("size-4 shrink-0 select-none", className)}
      />
    </span>
  );
}
