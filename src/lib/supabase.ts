import { createClient } from "@supabase/supabase-js";

/**
 * Klien Supabase untuk sisi server.
 *
 * Memakai **service_role key**, yang menembus Row Level Security — karena itu
 * berkas ini hanya boleh diimpor dari server (route handler, server component,
 * server action). Jangan pernah mengekspor klien ini ke komponen klien.
 *
 * Semua tabel di `supabase/schema.sql` mengaktifkan RLS tanpa policy apa pun,
 * jadi kalaupun anon key beredar, isi toko (termasuk data pesanan pembeli) tetap
 * tidak bisa dibaca dari browser.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const kunciLayanan = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** `true` kalau URL & service key sudah diisi. */
export function supabaseSiap() {
  return Boolean(url && kunciLayanan);
}

/**
 * Klien Supabase (dibuat sekali per proses).
 *
 * `auth.persistSession: false` karena dashboard ini memakai auth sendiri
 * (password admin + cookie) — tidak perlu sesi GoTrue yang menulis ke storage.
 */
export const supabaseAdmin = supabaseSiap()
  ? createClient(url!, kunciLayanan!, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "X-Client-Info": "modigi-admin" } },
    })
  : null;

export function ambilSupabase() {
  if (!supabaseAdmin) {
    throw new Error(
      "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return supabaseAdmin;
}

// ---------------------------------------------------------------------------
// Tipe baris tabel (mengikuti supabase/schema.sql)
// ---------------------------------------------------------------------------

export type BarisProduk = {
  id: string;
  slug: string;
  name: string;
  category_slug: string | null;
  tagline: string;
  description: string;
  price: number;
  compare_at: number;
  rating: number;
  reviews: number;
  sold: number;
  version: string;
  updated: string;
  highlights: string[];
  specs: [string, string][];
  faq: [string, string][];
  image_url: string | null;
  image_public_id: string | null;
  /** Logo resmi brand (muka box 3D) — diunggah/diisi dari dashboard. */
  logo_url: string | null;
  logo_public_id: string | null;
  art_label: string;
  art_from: string;
  art_to: string;
  art_accent: string | null;
  art_tone: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type BarisKategori = {
  slug: string;
  name: string;
  description: string;
  sort_order: number;
  created_at: string;
};

export type BarisPesanan = {
  id: string;
  order_no: string;
  customer_name: string;
  customer_whatsapp: string;
  customer_domain: string;
  wp_user: string | null;
  subtotal: number;
  compare_at_total: number;
  total: number;
  status: string;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type BarisItemPesanan = {
  id: string;
  order_id: string;
  product_slug: string;
  product_name: string;
  price: number;
  qty: number;
  subtotal: number;
};

/**
 * Rincian cara bayar (papan pengumuman) — bukan catatan uang masuk.
 * Lihat `BarisPembayaran` di bawah untuk uang yang benar-benar diterima.
 */
export type BarisMetodeBayar = {
  id: string;
  kind: string;
  label: string;
  account_no: string;
  account_name: string;
  instructions: string;
  qr_url: string | null;
  qr_public_id: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BarisPembayaran = {
  id: string;
  order_id: string;
  method: string;
  amount: number;
  status: string;
  reference: string | null;
  proof_url: string | null;
  paid_at: string | null;
  created_at: string;
};
