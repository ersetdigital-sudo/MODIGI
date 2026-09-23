import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Lebar konten maksimum yang dipakai seluruh halaman. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8", className)}>{children}</div>
  );
}
