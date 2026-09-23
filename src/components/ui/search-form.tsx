import { ArrowRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SearchFormProps = {
  /** id unik karena form ini dipakai lebih dari sekali di satu halaman. */
  id: string;
  placeholder?: string;
  /** Halaman tujuan hasil pencarian. */
  action?: string;
  variant?: "hero" | "header";
  className?: string;
};

/**
 * Form pencarian GET -> /produk?q=...
 * Dibuat sebagai form HTML biasa supaya tetap jalan tanpa JavaScript.
 */
export function SearchForm({
  id,
  placeholder = "Cari plugin, tema, atau tools...",
  action = "/produk",
  variant = "hero",
  className,
}: SearchFormProps) {
  if (variant === "header") {
    return (
      <form
        action={action}
        role="search"
        className={cn(
          "flex h-10 w-full max-w-[320px] items-center gap-2 rounded-lg border border-line-dark bg-ink-800 px-3 transition focus-within:border-gold/70",
          className,
        )}
      >
        <Search className="size-4 shrink-0 text-muted-dark" aria-hidden="true" />
        <label htmlFor={id} className="sr-only">
          Cari produk
        </label>
        <input
          id={id}
          name="q"
          type="search"
          placeholder={placeholder}
          className="h-full w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-muted-dark"
        />
      </form>
    );
  }

  return (
    <form
      action={action}
      role="search"
      className={cn(
        "flex w-full max-w-xl items-center gap-2 rounded-2xl border border-line bg-white p-1.5 shadow-card",
        className,
      )}
    >
      <Search className="ml-2 size-4 shrink-0 text-muted" aria-hidden="true" />
      <label htmlFor={id} className="sr-only">
        Cari produk
      </label>
      <input
        id={id}
        name="q"
        type="search"
        placeholder={placeholder}
        className="h-9 w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted/80"
      />
      {/* Di mobile tombol disembunyikan (kirim lewat keyboard) — seperti wireframe. */}
      <Button type="submit" size="md" className="hidden shrink-0 sm:inline-flex">
        Cari
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </form>
  );
}
