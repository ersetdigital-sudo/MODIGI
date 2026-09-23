"use client";

import { Check, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useCart } from "@/components/cart/use-cart";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

/**
 * Tombol "Tambah ke Keranjang".
 *
 * Setelah diklik, labelnya berubah sebentar jadi "Ditambahkan" + tautan ke
 * keranjang. Ini penting: tanpa umpan balik, orang menekan tombol lalu tidak
 * tahu apa yang terjadi — dan menekannya berkali-kali.
 */
export function AddToCartButton({
  product,
  label = "Tambah ke Keranjang",
  className,
  icon = true,
}: {
  product: Product;
  label?: string;
  className?: string;
  icon?: boolean;
}) {
  const { add } = useCart();
  const [ditambahkan, setDitambahkan] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleClick = () => {
    add(product);
    setDitambahkan(true);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDitambahkan(false), 2600);
  };

  return (
    <div className={cn("flex flex-col items-stretch gap-2", className)}>
      <button
        type="button"
        onClick={handleClick}
        className={cn("btn btn-ghost w-full", ditambahkan && "border-[var(--ink)]")}
      >
        {ditambahkan ? (
          <Check className="size-[18px] text-[var(--accent)]" aria-hidden="true" />
        ) : (
          icon && <ShoppingCart className="size-[18px]" aria-hidden="true" />
        )}
        {ditambahkan ? "Ditambahkan ke keranjang" : label}
      </button>

      {/* Diucapkan pembaca layar begitu produk masuk keranjang. */}
      <p aria-live="polite" className="min-h-0 text-[12.5px] text-[var(--muted)]">
        {ditambahkan && (
          <>
            Sudah masuk keranjang.{" "}
            <Link href="/keranjang" className="font-bold text-[var(--accent)] hover:underline">
              Lihat keranjang
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

/**
 * Tombol "Beli Sekarang": masukkan ke keranjang lalu langsung ke checkout.
 * Pembeli yang sudah yakin tidak perlu mampir ke halaman keranjang dulu.
 */
export function BuyNowButton({
  product,
  className,
  label = "Beli Sekarang",
}: {
  product: Product;
  className?: string;
  label?: string;
}) {
  const { add } = useCart();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        add(product);
        router.push("/checkout");
      }}
      className={cn("btn btn-dark w-full", className)}
    >
      <ShoppingCart className="size-[18px]" aria-hidden="true" />
      {label}
    </button>
  );
}
