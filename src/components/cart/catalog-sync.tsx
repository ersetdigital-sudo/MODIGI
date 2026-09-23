"use client";

import { useEffect } from "react";

import { setKatalog } from "@/lib/cart";
import type { CartProduct } from "@/types";

/**
 * Menitipkan katalog terbaru (dari database) ke memori tab.
 *
 * Keranjang disimpan di `localStorage` dan hanya berisi slug + jumlah; harga,
 * nama, dan artwork selalu dicocokkan ulang dengan katalog. Sebelum ada komponen
 * ini, katalog itu datang dari data statis — artinya produk yang harganya diubah
 * admin akan tampil beda antara katalog dan keranjang. Dengan ringkasan ini,
 * keduanya memakai angka yang sama.
 *
 * Ditulis di dalam `useEffect`, bukan saat render: mengubah store saat render
 * melanggar aturan React (satu komponen mengubah state komponen lain).
 * Komponennya tidak merender apa pun — hanya satu `<div hidden>` berisi data.
 */
export function CatalogSync({ products }: { products: CartProduct[] }) {
  useEffect(() => {
    setKatalog(products);
  }, [products]);

  return <div hidden aria-hidden="true" data-catalog-sync={products.length} />;
}
