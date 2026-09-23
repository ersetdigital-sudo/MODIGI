"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Star } from "lucide-react";

import { VerifiedBadge } from "@/components/ui/verified-badge";
import { getProductReviews } from "@/data/reviews";
import { formatCompact, formatRating } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const STARS = [5, 4, 3, 2, 1] as const;

/** Jumlah ulasan yang tampil dulu — sisanya dibuka lewat tombol. */
const PAGE_SIZE = 4;

/** Ikon bintang untuk satu rating (dibulatkan ke bintang terdekat). */
function Stars({ rating, className }: { rating: number; className?: string }) {
  const filled = Math.round(rating);

  return (
    <span
      role="img"
      aria-label={`${formatRating(rating)} dari 5`}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn(
            "size-3.5",
            index <= filled
              ? "fill-[var(--amber)] text-[var(--amber)]"
              : "text-[var(--line)]",
          )}
        />
      ))}
    </span>
  );
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/**
 * Section ulasan ala marketplace: ringkasan rating (angka besar + sebaran bintang)
 * di satu kartu, lalu daftar ulasan pembeli dengan badge "pembelian terverifikasi".
 *
 * Menampilkan `PAGE_SIZE` ulasan dulu; tombol **"Lihat N ulasan lainnya"** membuka
 * sisanya (per batch), dan chip rating di atas daftar menyaring ulasan per bintang.
 * Semua ulasan tetap ada di DOM setelah dibuka, jadi bisa dicari (Ctrl+F).
 */
export function ProductReviews({ product }: { product: Product }) {
  const { reviews, breakdown } = getProductReviews(product.slug);
  const [filter, setFilter] = useState<number | "all">("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const counts = useMemo(() => {
    const map = new Map<number, number>();
    for (const review of reviews) map.set(review.rating, (map.get(review.rating) ?? 0) + 1);
    return map;
  }, [reviews]);

  const filtered = useMemo(
    () => (filter === "all" ? reviews : reviews.filter((review) => review.rating === filter)),
    [reviews, filter],
  );

  if (reviews.length === 0) return null;

  const shown = filtered.slice(0, visible);
  const remaining = filtered.length - shown.length;
  const chips: { key: number | "all"; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: reviews.length },
    ...STARS.map((star) => ({
      key: star as number,
      label: `${star} bintang`,
      count: counts.get(star) ?? 0,
    })).filter((chip) => chip.count > 0),
  ];

  return (
    <section aria-labelledby="ulasan-pembeli" className="mt-14">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <h2
          id="ulasan-pembeli"
          className="text-[24px] font-extrabold tracking-[-0.02em] md:text-[30px]"
        >
          Ulasan pembeli
        </h2>
        <p aria-live="polite" className="tabular text-[13px] text-[var(--muted)]">
          Menampilkan {shown.length} dari {formatCompact(product.reviews)} ulasan
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="card h-fit p-6">
          <div className="flex items-end gap-3">
            <p className="tabular text-[44px] font-extrabold leading-none tracking-[-0.03em]">
              {formatRating(product.rating)}
            </p>
            <div className="pb-0.5">
              <Stars rating={product.rating} />
              <p className="tabular mt-1 text-[13px] text-[var(--muted)]">
                {product.reviews.toLocaleString("id-ID")} ulasan
              </p>
            </div>
          </div>

          <ul className="mt-5 space-y-2">
            {STARS.map((star) => (
              <li key={star} className="flex items-center gap-3 text-[12px] text-[var(--muted)]">
                <span className="tabular w-6 shrink-0 font-semibold text-[var(--ink)]">
                  {star}★
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
                  <span
                    className="block h-full rounded-full bg-[var(--amber)]"
                    style={{ width: `${breakdown[star]}%` }}
                  />
                </span>
                <span className="tabular w-9 shrink-0 text-right">{breakdown[star]}%</span>
              </li>
            ))}
          </ul>

          <div className="divider my-5" />

          <p className="flex items-start gap-2 text-[12px] leading-relaxed text-[var(--muted)]">
            <BadgeCheck className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
            Semua ulasan berasal dari pembeli dengan lisensi yang sudah diaktivasi.
          </p>
        </div>

        <div className="min-w-0">
          {/* Saring ulasan per bintang. */}
          <div
            role="group"
            aria-label="Saring ulasan berdasarkan rating"
            className="flex flex-wrap items-center gap-2"
          >
            {chips.map((chip) => (
              <button
                key={String(chip.key)}
                type="button"
                aria-pressed={filter === chip.key}
                onClick={() => {
                  setFilter(chip.key);
                  setVisible(PAGE_SIZE);
                }}
                className={cn("chip chip-sm gap-1.5", filter === chip.key && "is-active")}
              >
                {chip.label}
                <span className="tabular opacity-60">{chip.count}</span>
              </button>
            ))}
          </div>

          {shown.length > 0 ? (
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {shown.map((review) => (
                <li key={`${review.name}-${review.date}`} className="card p-5">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[13px] font-bold text-[var(--accent)]"
                    >
                      {initials(review.name)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                        <p className="text-[14px] font-bold">{review.name}</p>
                        {review.verified && (
                          <VerifiedBadge className="size-3.5" label="Pembelian terverifikasi" />
                        )}
                        <span className="tabular ml-auto text-[12px] text-[var(--muted)]">
                          {review.date}
                        </span>
                      </div>

                      {review.role && (
                        <p className="mt-0.5 text-[12px] text-[var(--muted)]">{review.role}</p>
                      )}

                      <Stars rating={review.rating} className="mt-2" />

                      <p className="mt-2 text-[14px] leading-relaxed text-[#3a352e]">
                        {review.text}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="card mt-3 p-6 text-center text-[14px] text-[var(--muted)]">
              Belum ada ulasan {filter !== "all" ? `${filter} bintang` : ""} untuk produk ini.
            </p>
          )}

          {(remaining > 0 || visible > PAGE_SIZE) && (
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              {remaining > 0 && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setVisible((current) => current + PAGE_SIZE)}
                >
                  Lihat {remaining} ulasan lainnya
                </button>
              )}

              {visible > PAGE_SIZE && (
                <button
                  type="button"
                  className="text-[13px] font-bold text-[var(--muted)] underline decoration-dotted underline-offset-4 transition hover:text-[var(--ink)]"
                  onClick={() => setVisible(PAGE_SIZE)}
                >
                  Tampilkan lebih sedikit
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
