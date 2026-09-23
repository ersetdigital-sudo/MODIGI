import { cn } from "@/lib/utils";
import { trustPoints } from "@/data/site";

/** Baris keunggulan layanan di bawah daftar produk terlaris. */
export function TrustBar({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid gap-y-6 rounded-2xl border border-line bg-white/60 py-6 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {trustPoints.map(({ title, description, icon: Icon }, index) => (
        <li
          key={title}
          className={cn(
            "flex items-center gap-3 px-6",
            index > 0 && "lg:border-l lg:border-line",
          )}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-cream-200/60 text-gold-deep">
            <Icon className="size-[18px]" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">{title}</p>
            <p className="mt-0.5 text-xs text-muted">{description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
