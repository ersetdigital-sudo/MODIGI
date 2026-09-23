import { Tag } from "lucide-react";

import { Container } from "@/components/ui/container";
import { promoCode } from "@/data/site";

/**
 * Kartu kode promo — hanya tampil di mobile (< lg), mengikuti wireframe mobile.
 * Isinya diambil dari `promoCode` di `src/data/site.ts`.
 */
export function PromoCodeBanner() {
  return (
    <section className="pb-6 lg:hidden">
      <Container>
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-sand bg-cream-200 p-3 shadow-card">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold/25 text-gold-deep">
              <Tag className="size-[18px]" aria-hidden="true" />
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{promoCode.title}</p>
              <p className="mt-0.5 text-[10px] text-muted">
                Pakai kode:{" "}
                <span className="rounded bg-ink px-1.5 py-0.5 text-[9px] font-bold uppercase text-gold">
                  {promoCode.code}
                </span>
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-gold-deep">{promoCode.discount}</p>
            <p className="text-[9px] text-muted">{promoCode.minSpend}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
