"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCart, useCartDrawer } from "@/components/cart/use-cart";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

/**
 * Tombol "Tambah ke Keranjang".
 *
 * Setelah diklik, drawer keranjang terbuka dari kanan — jadi pembeli langsung
 * melihat produknya masuk, bisa mengubah jumlah, lalu lanjut ke checkout tanpa
 * kehilangan halaman yang sedang dibaca. Panel itu sendiri yang jadi umpan baliknya,
 * dan satu baris teks `aria-live` mengumumkannya ke pembaca layar.
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
  const { add, count } = useCart();
  const { buka } = useCartDrawer();
  const [diumumkan, setDiumumkan] = useState(false);

  return (
    <div className={cn("flex flex-col items-stretch gap-2", className)}>
      <button
        type="button"
        onClick={() => {
          add(product);
          buka();
          setDiumumkan(true);
        }}
        className="btn btn-ghost w-full"
      >
        {icon && <ShoppingCart className="size-[18px]" aria-hidden="true" />}
        {label}
      </button>

      {/* Angkanya ikut dibacakan supaya teksnya berubah tiap kali ditambahkan —
          teks `aria-live` yang isinya sama persis tidak akan diumumkan lagi. */}
      <p aria-live="polite" className="sr-only">
        {diumumkan ? `${product.name} ditambahkan. Keranjang berisi ${count} produk.` : ""}
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
