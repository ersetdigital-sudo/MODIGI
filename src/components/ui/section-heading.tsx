import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  action?: { label: string; href: string };
  className?: string;
  /** Kelas tambahan untuk link aksi, mis. untuk menyembunyikannya di mobile. */
  actionClassName?: string;
};

/**
 * Judul section + link "Lihat Semua ..." di sisi kanan.
 *
 * Di mobile bentuknya dipadatkan mengikuti wireframe: eyebrow disembunyikan,
 * judul jadi `text-lg`, dan link aksi mengecil — tapi tetap satu DOM yang sama.
 */
export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
  actionClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-4", className)}>
      <div>
        <Eyebrow className="hidden lg:block">{eyebrow}</Eyebrow>
        <h2 className="text-lg font-bold tracking-tight text-ink lg:mt-3 lg:text-[32px] lg:font-extrabold">
          {title}
        </h2>
      </div>

      {action && (
        <Link
          href={action.href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-ink transition-colors hover:text-gold-deep lg:gap-2 lg:text-sm",
            actionClassName,
          )}
        >
          {action.label}
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-1 lg:size-4"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}
