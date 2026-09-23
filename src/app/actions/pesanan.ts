"use server";

import { ambilSupabase, supabaseSiap } from "@/lib/supabase";
import type { Customer, OrderItem } from "@/types";

/**
 * Mencatat pesanan checkout ke database.
 *
 * Sebelum ini, pesanan hanya hidup di dua tempat: `localStorage` pembeli dan pesan
 * WhatsApp admin. Akibatnya dashboard tidak punya apa pun untuk dikelola — dan
 * kalau chat WhatsApp-nya ketimbun, pesanannya hilang. Sekarang setiap pesanan
 * punya barisnya sendiri di tabel `orders` + `order_items`.
 *
 * Aturan mainnya:
 * - **Password WP-Admin tidak ikut dikirim ke sini.** Kolomnya memang tidak ada di
 *   database (lihat `supabase/schema.sql`), jadi tidak ada tempat untuk bocor.
 * - Kalau database belum dikonfigurasi atau gagal, hasilnya `{ ok: false }` — dan
 *   pembeli tetap lanjut seperti biasa, karena WhatsApp adalah jalur utama pesanan.
 */

export type HasilPesanan = { ok: true } | { ok: false; pesan: string };

/** Batas kewarasan supaya endpoint publik ini tidak bisa dipakai mengirim data raksasa. */
const MAKS_ITEM = 20;
const MAKS_PANJANG = 200;

function bersih(nilai: unknown) {
  return typeof nilai === "string" ? nilai.trim().slice(0, MAKS_PANJANG) : "";
}

export async function buatPesananAction(input: {
  orderNo: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  compareAtTotal: number;
}): Promise<HasilPesanan> {
  if (!supabaseSiap()) {
    return { ok: false, pesan: "Database belum dikonfigurasi." };
  }

  const nama = bersih(input.customer?.name);
  const whatsapp = bersih(input.customer?.whatsapp);
  const domain = bersih(input.customer?.domain);
  const wpUser = bersih(input.customer?.wpUser);
  const orderNo = bersih(input.orderNo);

  const items = (Array.isArray(input.items) ? input.items : [])
    .slice(0, MAKS_ITEM)
    .map((item) => ({
      product_slug: bersih(item.slug),
      product_name: bersih(item.name),
      price: Math.max(0, Math.trunc(Number(item.price) || 0)),
      qty: Math.min(10, Math.max(1, Math.trunc(Number(item.qty) || 1))),
      subtotal: Math.max(0, Math.trunc(Number(item.subtotal) || 0)),
    }))
    .filter((item) => item.product_slug && item.product_name);

  if (!orderNo || !nama || !whatsapp || items.length === 0) {
    return { ok: false, pesan: "Data pesanan tidak lengkap." };
  }

  const supabase = ambilSupabase();

  const { data: pesanan, error } = await supabase
    .from("orders")
    .insert({
      order_no: orderNo,
      customer_name: nama,
      customer_whatsapp: whatsapp,
      customer_domain: domain,
      wp_user: wpUser || null,
      subtotal: Math.max(0, Math.trunc(Number(input.total) || 0)),
      compare_at_total: Math.max(0, Math.trunc(Number(input.compareAtTotal) || 0)),
      total: Math.max(0, Math.trunc(Number(input.total) || 0)),
      status: "baru",
    })
    .select("id")
    .single();

  if (error || !pesanan) {
    // Nomor pesanan duplikat (mis. tombol ditekan dua kali) bukan kegagalan yang
    // perlu ditampilkan ke pembeli — pesan WhatsApp-nya sudah terkirim.
    return { ok: false, pesan: error?.message ?? "Pesanan gagal dicatat." };
  }

  const { error: errorItem } = await supabase
    .from("order_items")
    .insert(items.map((item) => ({ ...item, order_id: pesanan.id })));

  if (errorItem) {
    return { ok: false, pesan: errorItem.message };
  }

  return { ok: true };
}
