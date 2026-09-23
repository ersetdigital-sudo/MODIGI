"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import {
  clearCart,
  countItems,
  getCartDrawerServerSnapshot,
  getCartDrawerSnapshot,
  getCartServerSnapshot,
  getCartSnapshot,
  getKatalogServerSnapshot,
  getKatalogSnapshot,
  getOrderServerSnapshot,
  getOrderSnapshot,
  getPaymentServerSnapshot,
  getPaymentSnapshot,
  normalizeQty,
  readCart,
  setCartDrawer,
  subscribeCart,
  subscribeCartDrawer,
  subscribeKatalog,
  subscribeOrder,
  subscribePayment,
  summarize,
  toLines,
  writeCart,
} from "@/lib/cart";
import type { CartItem, Product } from "@/types";

/** Penanda \"sudah jalan di browser\" — server `false`, klien `true`. */
const subscribeNihil = () => () => {};
const trueDiKlien = () => true;
const falseDiServer = () => false;

/**
 * Isi keranjang, dibaca langsung dari `localStorage`.
 *
 * Tidak ada provider/context: `localStorage` memang store-nya, dan
 * `useSyncExternalStore` membuat setiap komponen yang memanggil hook ini ikut
 * ter-render saat isinya berubah. Jadi badge di header, halaman keranjang, dan
 * checkout selalu menampilkan angka yang sama — termasuk setelah tab lain mengubah
 * keranjang, karena `subscribeCart` juga mendengarkan event `storage`.
 *
 * `ready` dipakai untuk menahan tampilan sampai data browser terbaca, supaya tidak
 * ada kedipan \"keranjang kosong\" atau badge 0 pada detik pertama.
 */
export function useCart() {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getCartServerSnapshot);
  const diKlien = useSyncExternalStore(subscribeNihil, trueDiKlien, falseDiServer);

  // Katalog (harga terbaru dari database) datang dari server lewat <CatalogSync />.
  const katalog = useSyncExternalStore(subscribeKatalog, getKatalogSnapshot, getKatalogServerSnapshot);

  const lines = useMemo(() => toLines(items, katalog), [items, katalog]);
  const ringkasan = useMemo(() => summarize(lines), [lines]);

  const add = useCallback((product: Product, qty = 1) => {
    const sekarang = readCart();
    const ada = sekarang.find((item) => item.slug === product.slug);
    const baru: CartItem[] = ada
      ? sekarang.map((item) =>
          item.slug === product.slug ? { ...item, qty: normalizeQty(item.qty + qty) } : item,
        )
      : [...sekarang, { slug: product.slug, qty: normalizeQty(qty) }];

    writeCart(baru);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    writeCart(readCart().map((item) => (item.slug === slug ? { ...item, qty: normalizeQty(qty) } : item)));
  }, []);

  const remove = useCallback((slug: string) => {
    writeCart(readCart().filter((item) => item.slug !== slug));
  }, []);

  const clear = useCallback(() => clearCart(), []);

  return {
    items,
    lines,
    count: countItems(items),
    total: ringkasan.total,
    savings: ringkasan.savings,
    /**
     * Baru `true` kalau keranjang DAN katalog sudah terbaca di browser.
     * Tanpa syarat kedua, keranjang bisa menampilkan harga basi sesaat sebelum
     * katalog dari server sampai.
     */
    ready: diKlien && katalog.length > 0,
    add,
    setQty,
    remove,
    clear,
  };
}

/**
 * Status drawer keranjang (panel yang muncul dari kanan saat menambah produk).
 *
 * Dipisah dari `useCart` karena drawer harus bisa dibuka dari mana saja, termasuk
 * halaman yang tidak menampilkan isi keranjang sama sekali.
 */
export function useCartDrawer() {
  const terbuka = useSyncExternalStore(
    subscribeCartDrawer,
    getCartDrawerSnapshot,
    getCartDrawerServerSnapshot,
  );

  return {
    terbuka,
    buka: useCallback(() => setCartDrawer(true), []),
    tutup: useCallback(() => setCartDrawer(false), []),
  };
}

/**
 * Pesanan terakhir yang dikirim dari browser ini — dipakai halaman konfirmasi.
 * Berpasangan dengan `useCart`, tapi ada di penyimpanan terpisah karena pesanan
 * tidak dihapus saat keranjang dikosongkan.
 */
export function useLastOrder() {
  const order = useSyncExternalStore(subscribeOrder, getOrderSnapshot, getOrderServerSnapshot);
  const ready = useSyncExternalStore(subscribeNihil, trueDiKlien, falseDiServer);

  return { order, ready };
}

/**
 * Cara bayar yang dipilih pembeli di perangkat ini.
 *
 * Dipakai dua halaman: `/checkout/pembayaran` (supaya pilihan sebelumnya tidak
 * hilang saat halaman dimuat ulang) dan `/checkout/selesai` (supaya status
 * pembayarannya bisa ditampilkan apa adanya).
 */
export function usePaymentChoice() {
  const pilihan = useSyncExternalStore(
    subscribePayment,
    getPaymentSnapshot,
    getPaymentServerSnapshot,
  );
  const ready = useSyncExternalStore(subscribeNihil, trueDiKlien, falseDiServer);

  return { pilihan, ready };
}
