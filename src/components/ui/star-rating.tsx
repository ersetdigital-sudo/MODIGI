import { Star } from "lucide-react";

import { formatCompact, formatRating } from "@/lib/format";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  reviews?: number;
  className?: string;
};

/** Rating produk: ★ 4,9 (2,1K) */
export function StarRating({ rating, reviews, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1 text-[11px] font-bold text-ink", className)}>
      <Star className="size-3.5 fill-gold text-gold" aria-hidden="true" />
      <span>{formatRating(rating)}</span>
      {reviews !== undefined && (
        <span className="font-medium text-muted">({formatCompact(reviews)})</span>
      )}
      <span className="sr-only">
        dari 5, berdasarkan {reviews ?? 0} ulasan
      </span>
    </div>
  );
}
