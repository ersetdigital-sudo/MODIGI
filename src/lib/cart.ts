import { getProduct } from "@/data/products";
import { formatCompact, formatRupiah } from "@/lib/format";
import type { CartItem, CartLine, Customer, Order, OrderItem } from "@/types";

/**
 * Isi keranjang & pesanan — semuanya di browser.
 *
 * Aplikasi ini tidak punya database. Keranjang disimpan di `localStorage` (hanya
 * slug + jumlah), dan setiap kali dibaca harganya diambil ulang dari
 * `data/products.ts` supaya tidak pernah ada harga basi yang ikut tersimpan.
 *
 * Semua fungsi di berkas ini aman dipanggil di server (dicek lewat
 * `typeof window`), jadi komponen server tidak perlu berubah jadi client hanya
 * untuk membaca store.
 */

export const CART_STORAGE_KEY = "modigi:keranjang";
export const ORDER_STORAGE_KEY = "modigi:pesanan-terakhir";

/** Nama event internal supaya badge keranjang ikut berubah tanpa reload. */
export const CART_EVENT = "modigi:keranjang-berubah";

/** Batas jumlah per produk (lisensi per domain, bukan stok gudang). */
export const MAX_QTY = 10;

function adaWindow() {
  return typeof window !== "undefined";
}

/** Bulatkan & jepit jumlah ke 1–MAX_QTY, supaya tidak ada qty 0 / -3 / 2,7. */
export function normalizeQty(qty: number) {
  if (!Number.isFinite(qty)) return 1;
  return Math.min(MAX_QTY, Math.max(1, Math.trunc(qty)));
}

/** Buang baris ganda (satu produk satu baris), lalu urutkan sesuai katalog. */
export function normalizeItems(items: CartItem[]): CartItem[] {
  const digabung = new Map<string, number>();

  for (const item of items) {
    if (!item || typeof item.slug !== "string") continue;
    const qty = normalizeQty(Number(item.qty));
    digabung.set(item.slug, normalizeQty((digabung.get(item.slug) ?? 0) + qty));
  }

  return [...digabung].map(([slug, qty]) => ({ slug, qty }));
}

/**
 * Cocokkan isi keranjang dengan katalog.
 * Slug yang sudah tidak ada di katalog otomatis dibuang (produk dihapus/diganti).
 */
export function toLines(items: CartItem[]): CartLine[] {
  return normalizeItems(items).flatMap(({ slug, qty }) => {
    const product = getProduct(slug);
    if (!product) return [];

    return [{ slug, qty, product, subtotal: product.price * qty }];
  });
}

/** Jumlah produk (dijumlahkan, mis. 3 lisensi → 3). */
export function countItems(items: CartItem[]) {
  return normalizeItems(items).reduce((total, item) => total + item.qty, 0);
}

/** Ringkasan angka keranjang dari daftar baris yang sudah dicocokkan. */
export function summarize(lines: CartLine[]) {
  const total = lines.reduce((jumlah, line) => jumlah + line.subtotal, 0);
  const compareAtTotal = lines.reduce(
    (jumlah, line) => jumlah + line.product.compareAt * line.qty,
    0,
  );

  return {
    /** Jumlah baris (produk berbeda). */
    lines: lines.length,
    /** Jumlah lisensi. */
    count: lines.reduce((jumlah, line) => jumlah + line.qty, 0),
    total,
    compareAtTotal,
    /** Selisih harga resmi vs harga jual — disebut "hemat" di UI. */
    savings: compareAtTotal - total,
  };
}

/** Baris keranjang → baris pesanan (bentuk ringkas untuk disimpan). */
export function toOrderItems(lines: CartLine[]): OrderItem[] {
  return lines.map((line) => ({
    slug: line.slug,
    name: line.product.name,
    price: line.product.price,
    qty: line.qty,
    subtotal: line.subtotal,
  }));
}

// ---------------------------------------------------------------------------
// Keranjang (localStorage)
// ---------------------------------------------------------------------------

function bacaMentah() {
  if (!adaWindow()) return "";

  try {
    return window.localStorage.getItem(CART_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

/** Teks JSON → daftar item. JSON rusak / diblokir dianggap keranjang kosong. */
function uraiCart(mentah: string | null): CartItem[] {
  if (!mentah) return [];

  try {
    const data: unknown = JSON.parse(mentah);
    if (!Array.isArray(data)) return [];

    return normalizeItems(data as CartItem[]);
  } catch {
    return [];
  }
}

export function readCart(): CartItem[] {
  return uraiCart(bacaMentah());
}

/*
 * Bagian di bawah ini adalah "external store" versi React.
 *
 * `useSyncExternalStore` memanggil `getCartSnapshot` berulang kali dan
 * membandingkan hasilnya dengan `Object.is` — kalau setiap panggilan mengembalikan
 * array baru, React menganggap datanya selalu berubah dan render jadi tak henti.
 * Karena itu hasil parse di-cache per teks mentah: teks yang sama → array yang sama.
 */
let snapshotMentah: string | null = null;
let snapshot: CartItem[] = [];

/** Keranjang versi tetap & kosong — dipakai server dan saat hidrasi. */
export const emptyCart: CartItem[] = [];

export function getCartSnapshot(): CartItem[] {
  const mentah = bacaMentah();

  if (mentah !== snapshotMentah) {
    snapshotMentah = mentah;
    snapshot = uraiCart(mentah);
  }

  return snapshot;
}

/** Snapshot server: kosong dan stabil, supaya HTML awal tidak menebak-nebak. */
export function getCartServerSnapshot(): CartItem[] {
  return emptyCart;
}

/** Berlangganan perubahan keranjang: dari komponen lain maupun tab lain. */
export function subscribeCart(callback: () => void) {
  if (!adaWindow()) return () => {};

  window.addEventListener(CART_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(CART_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function writeCart(items: CartItem[]) {
  if (!adaWindow()) return;

  const bersih = normalizeItems(items);

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(bersih));
  } catch {
    // Mode privat: keranjang tetap jalan di memori, hanya tidak tersimpan.
  }

  window.dispatchEvent(new Event(CART_EVENT));
}

export function clearCart() {
  if (!adaWindow()) return;

  try {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    // abaikan
  }

  window.dispatchEvent(new Event(CART_EVENT));
}

// ---------------------------------------------------------------------------
// Pesanan
// ---------------------------------------------------------------------------

/** Nomor pesanan yang bisa dibacakan di WhatsApp: MDG-260923-4F7A. */
export function makeOrderNo(date = new Date()) {
  const tanggal = [
    String(date.getFullYear()).slice(2),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");

  const acak = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `MDG-${tanggal}-${acak}`;
}

export function createOrder(customer: Customer, lines: CartLine[]): Order {
  const ringkasan = summarize(lines);

  return {
    orderNo: makeOrderNo(),
    createdAt: new Date().toISOString(),
    items: toOrderItems(lines),
    customer,
    total: ringkasan.total,
    compareAtTotal: ringkasan.compareAtTotal,
  };
}

/** Event internal: pesanan terakhir berubah (dipakai halaman konfirmasi). */
export const ORDER_EVENT = "modigi:pesanan-berubah";

export function writeLastOrder(order: Order) {
  if (!adaWindow()) return;

  try {
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch {
    // abaikan
  }

  window.dispatchEvent(new Event(ORDER_EVENT));
}

/** Teks JSON → pesanan, dengan pengecekan bentuk minimal. */
function uraiOrder(mentah: string | null): Order | null {
  if (!mentah) return null;

  try {
    const data: unknown = JSON.parse(mentah);
    if (!data || typeof data !== "object") return null;

    const order = data as Order;
    if (!order.orderNo || !Array.isArray(order.items)) return null;

    return order;
  } catch {
    return null;
  }
}

let orderMentah: string | null = null;
let orderSnapshot: Order | null = null;

/** Sama seperti keranjang: hasil parse di-cache supaya snapshotnya stabil. */
export function getOrderSnapshot(): Order | null {
  let mentah = "";

  try {
    mentah = window.localStorage.getItem(ORDER_STORAGE_KEY) ?? "";
  } catch {
    mentah = "";
  }

  if (mentah !== orderMentah) {
    orderMentah = mentah;
    orderSnapshot = uraiOrder(mentah);
  }

  return orderSnapshot;
}

export function getOrderServerSnapshot(): Order | null {
  return null;
}

export function subscribeOrder(callback: () => void) {
  if (!adaWindow()) return () => {};

  window.addEventListener(ORDER_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(ORDER_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function readLastOrder(): Order | null {
  const mentah = adaWindow() ? (() => {
    try {
      return window.localStorage.getItem(ORDER_STORAGE_KEY);
    } catch {
      return null;
    }
  })() : null;

  return uraiOrder(mentah);
}

/**
 * Teks pesanan yang dikirim ke WhatsApp admin.
 *
 * Ditulis apa adanya (bukan tabel/kode) supaya admin bisa langsung membalas
 * tanpa perlu membuka sistem apa pun — ini pengganti halaman admin yang belum ada.
 */
export function orderMessage(order: Order, wpPassword?: string) {
  const baris = order.items.map(
    (item, index) =>
      `${index + 1}. ${item.name} — ${item.qty} lisensi × ${formatRupiah(item.price)} = ${formatRupiah(item.subtotal)}`,
  );

  const hemat = order.compareAtTotal - order.total;

  return [
    `Halo MODIGI, saya mau order.`,
    ``,
    ...baris,
    ``,
    `Total: ${formatRupiah(order.total)}`,
    hemat > 0 ? `Hemat: ${formatRupiah(hemat)} dari harga resmi` : null,
    ``,
    `No. pesanan: ${order.orderNo}`,
    `Nama: ${order.customer.name}`,
    `WhatsApp: ${order.customer.whatsapp}`,
    `Domain WordPress: ${order.customer.domain}`,
    `Username WP-Admin: ${order.customer.wpUser}`,
    // Password TIDAK ikut disimpan di pesanan (`Order`) — hanya ada di pesan ini,
    // yang dikirim langsung dari formulir saat pembeli menekan "Buat Pesanan".
    wpPassword ? `Password WP-Admin: ${wpPassword}` : null,
    ``,
    `${formatCompact(order.items.length)} jenis produk · mohon info cara pembayarannya.`,
  ]
    .filter((teks): teks is string => teks !== null)
    .join("\n");
}

// ---------------------------------------------------------------------------
// Drawer keranjang
// ---------------------------------------------------------------------------

/**
 * Status buka/tutup drawer keranjang.
 *
 * Disimpan sebagai store eksternal kecil (sama seperti keranjang) supaya tombol
 * "Tambah ke Keranjang", ikon keranjang di header, dan FAB di tab bar mobile bisa
 * membuka panel yang sama tanpa saling mengirim prop atau memakai context.
 */
export const DRAWER_EVENT = "modigi:drawer-keranjang";

let drawerTerbuka = false;

export function setCartDrawer(terbuka: boolean) {
  if (!adaWindow()) return;
  if (drawerTerbuka === terbuka) return;

  drawerTerbuka = terbuka;
  window.dispatchEvent(new Event(DRAWER_EVENT));
}

export function getCartDrawerSnapshot() {
  return drawerTerbuka;
}

/** Server & hidrasi: selalu tertutup. */
export function getCartDrawerServerSnapshot() {
  return false;
}

export function subscribeCartDrawer(callback: () => void) {
  if (!adaWindow()) return () => {};

  window.addEventListener(DRAWER_EVENT, callback);

  return () => window.removeEventListener(DRAWER_EVENT, callback);
}
