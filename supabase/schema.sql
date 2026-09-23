-- ============================================================================
-- MODIGI — skema database (Supabase / Postgres)
-- ============================================================================
-- Cara pakai: jalankan seluruh berkas ini sekali di SQL Editor Supabase, atau
-- lewat Management API (`POST /v1/projects/{ref}/database/query`).
--
-- Semua tabel memakai ROW LEVEL SECURITY **tanpa policy**: artinya hanya
-- `service_role` (dipakai server Next.js) yang bisa membaca/menulis. Anon key
-- tidak bisa menyentuh data apa pun, jadi kalaupun key-nya beredar, isi toko
-- tetap tidak terbaca dari browser.
--
-- Aman dijalankan berulang (`if not exists` / `create or replace`).
-- ============================================================================

create extension if not exists pgcrypto;

-- --- Kategori ---------------------------------------------------------------
create table if not exists categories (
  slug        text primary key,
  name        text not null,
  description text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- --- Produk -----------------------------------------------------------------
-- Bentuk kolomnya sengaja mengikuti tipe `Product` di `src/types/index.ts`,
-- supaya produk yang ditambah lewat dashboard langsung tampil identik dengan
-- produk yang sekarang masih berupa data statis.
create table if not exists products (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name            text not null,
  category_slug   text references categories (slug) on delete set null,
  tagline         text not null default '',
  description     text not null default '',
  price           integer not null default 0,
  compare_at      integer not null default 0,
  rating          numeric(2, 1) not null default 0,
  reviews         integer not null default 0,
  sold            integer not null default 0,
  version         text not null default '',
  -- Tanggal update sudah berbentuk teks siap tampil, mis. "12 Sep 2026".
  updated         text not null default '',
  highlights      text[] not null default '{}',
  -- [[label, nilai], …] supaya urutannya pasti (objek JSON tidak menjamin urutan).
  specs           jsonb not null default '[]'::jsonb,
  faq             jsonb not null default '[]'::jsonb,
  -- Hasil unggahan ke Cloudinary. `image_public_id` disimpan supaya berkas lama
  -- bisa dihapus saat diganti — tanpa itu, akun Cloudinary menumpuk sampah.
  --   logo_url  = logo resmi brand (dipakai muka box 3D)
  --   image_url = foto produk jadi (kalau diisi, foto ini yang tampil)
  logo_url        text,
  logo_public_id  text,
  image_url       text,
  image_public_id text,
  -- Warna & label box produk (dipakai <PluginBoxArt /> kalau tidak ada foto).
  art_label       text not null default '',
  art_from        text not null default '#1f2937',
  art_to          text not null default '#0b0b0c',
  art_accent      text,
  art_tone        text not null default 'light',
  -- 'aktif' tampil di katalog, 'draft' disembunyikan.
  status          text not null default 'aktif',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Kolom tambahan untuk database yang sudah terlanjur dibuat versi awal.
-- (`create table if not exists` tidak menambah kolom ke tabel yang sudah ada.)
alter table products add column if not exists logo_url        text;
alter table products add column if not exists logo_public_id  text;

-- --- Pesanan ----------------------------------------------------------------
create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  order_no          text unique not null,
  customer_name     text not null,
  customer_whatsapp text not null,
  customer_domain   text not null default '',
  wp_user           text,
  subtotal          integer not null default 0,
  compare_at_total  integer not null default 0,
  total             integer not null default 0,
  -- baru → dikonfirmasi → dibayar → selesai (atau batal)
  status            text not null default 'baru',
  note              text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Catatan: password WP-Admin TIDAK punya kolomnya di sini — dengan sengaja.
-- Kredensial itu tidak pernah disimpan, hanya dipakai untuk menyusun pesan
-- WhatsApp dari formulir checkout.

create table if not exists order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders (id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  price        integer not null default 0,
  qty          integer not null default 1,
  subtotal     integer not null default 0
);

-- --- Pembayaran -------------------------------------------------------------
create table if not exists payments (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders (id) on delete cascade,
  method     text not null default 'transfer', -- transfer | qris | ewallet
  amount     integer not null default 0,
  status     text not null default 'pending',  -- pending | lunas | gagal | refund
  reference  text,
  proof_url  text,
  paid_at    timestamptz,
  created_at timestamptz not null default now()
);

-- --- updated_at otomatis ----------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated on products;
create trigger products_updated before update on products
  for each row execute function set_updated_at();

drop trigger if exists orders_updated on orders;
create trigger orders_updated before update on orders
  for each row execute function set_updated_at();

-- --- Indeks -----------------------------------------------------------------
create index if not exists products_status_idx  on products (status);
create index if not exists products_kategori_idx on products (category_slug);
create index if not exists orders_status_idx    on orders (status);
create index if not exists orders_created_idx   on orders (created_at desc);
create index if not exists order_items_order_idx on order_items (order_id);
create index if not exists payments_order_idx   on payments (order_id);

-- --- RLS: aktif tanpa policy = hanya service_role yang bisa akses -----------
alter table categories  enable row level security;
alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;
alter table payments    enable row level security;
