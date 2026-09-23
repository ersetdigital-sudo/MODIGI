import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EyebrowProps = {
  children: ReactNode;
  /** Warna label: emas untuk latar terang, putih redup untuk latar gelap. */
  tone?: "gold" | "onDark";
  className?: string;
};

/** Label kecil kapital di atas judul section, mis. "KATEGORI". */
export function Eyebrow({ children, tone = "gold", className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-[11px] font-bold uppercase tracking-[0.22em]",
        tone === "gold" ? "text-gold-deep" : "text-muted-dark",
        className,
      )}
    >
      {children}
    </p>
  );
}
