"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { buatTokenSesi, opsiCookieSesi, passwordBenar, sudahMasuk } from "@/lib/admin-auth";
import { FOLDER_PRODUK, hapusGambar, unggahGambar } from "@/lib/cloudinary";
import { ambilSupabase } from "@/lib/supabase";

/**
 * Semua tindakan tulis dashboard admin.
 *
 * Memakai Server Action (bukan route API) supaya: tidak perlu fetch manual dari
 * klien, tidak ada CSRF token yang harus dijaga sendiri, dan setiap aksi bisa
 * langsung memanggil `revalidatePath` agar perubahan tampil di situs depan.
 *
 * Setiap aksi memeriksa sesi lebih dulu — Server Action bisa dipanggil siapa pun
 * yang tahu ID-nya, jadi penjagaan tidak boleh hanya ada di halaman.
 */

// ---------------------------------------------------------------------------
// Bantuan
// ---------------------------------------------------------------------------

/** Teks → angka bulat yang aman (form bisa mengirim "" / "45.000"). */
function angka(nilai: FormDataEntryValue | null, bawaan = 0) {
  if (typeof nilai !== "string") return bawaan;
  const bersih = nilai.replace(/[^\d-]/g, "");
  const hasil = Number.parseInt(bersih, 10);
  return Number.isFinite(hasil) ? hasil : bawaan;
}

/** Teks → angka desimal (rating boleh 4,9 atau 4.9). */
function desimal(nilai: FormDataEntryValue | null, bawaan = 0) {
  if (typeof nilai !== "string") return bawaan;
  const hasil = Number.parseFloat(nilai.replace(",", "."));
  return Number.isFinite(hasil) ? hasil : bawaan;
}

function teks(nilai: FormDataEntryValue | null, bawaan = "") {
  return typeof nilai === "string" ? nilai.trim() : bawaan;
}

/** Satu baris = satu poin. Baris kosong dibuang. */
function daftarBaris(nilai: FormDataEntryValue | null) {
  return teks(nilai)
    .split("\n")
    .map((baris) => baris.trim())
    .filter(Boolean);
}

/**
 * "Label | Nilai" per baris → `[[label, nilai], …]`.
 * Dipakai untuk tabel spesifikasi dan FAQ supaya editornya cukup satu textarea.
 */
function daftarPasangan(nilai: FormDataEntryValue | null): [string, string][] {
  return daftarBaris(nilai)
    .map((baris) => {
      const pisah = baris.indexOf("|");
      if (pisah === -1) return [baris.trim(), ""] as [string, string];
      return [baris.slice(0, pisah).trim(), baris.slice(pisah + 1).trim()] as [string, string];
    })
    .filter(([label]) => label.length > 0);
}

function slugDari(nilai: string) {
  return nilai
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Berkas yang benar-benar dipilih pengguna (input file kosong tetap terkirim). */
function berkasDari(nilai: FormDataEntryValue | null): File | null {
  if (typeof nilai === "string") return null;
  if (!nilai || typeof nilai.size !== "number" || nilai.size === 0) return null;
  return nilai as File;
}

async function jaga() {
  if (!(await sudahMasuk())) redirect("/admin/masuk");
}

/** Segarkan halaman admin + halaman situs yang menampilkan produk. */
function segarkanSitus(slug?: string) {
  revalidatePath("/admin/produk");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/produk");
  revalidatePath("/kategori");
  if (slug) revalidatePath(`/produk/${slug}`);
}

// ---------------------------------------------------------------------------
// Masuk / keluar
// ---------------------------------------------------------------------------

export async function masukAction(formData: FormData) {
  const password = teks(formData.get("password"));
  const tujuan = teks(formData.get("tujuan"), "/admin");

  if (!passwordBenar(password)) {
    redirect(`/admin/masuk?gagal=1${tujuan !== "/admin" ? `&tujuan=${encodeURIComponent(tujuan)}` : ""}`);
  }

  (await cookies()).set({
    ...opsiCookieSesi(12 * 60 * 60),
    value: buatTokenSesi(),
  });

  redirect(tujuan.startsWith("/admin") ? tujuan : "/admin");
}

export async function keluarAction() {
  (await cookies()).set({ ...opsiCookieSesi(0), value: "" });
  redirect("/admin/masuk?keluar=1");
}

// ---------------------------------------------------------------------------
// Produk
// ---------------------------------------------------------------------------

export async function simpanProdukAction(formData: FormData) {
  await jaga();

  const supabase = ambilSupabase();

  const idLama = teks(formData.get("id"));
  const nama = teks(formData.get("name"));
  const slug = slugDari(teks(formData.get("slug")) || nama);

  if (!nama || !slug) {
    redirect(`/admin/produk${idLama ? `/${idLama}` : "/baru"}?galat=nama-kosong`);
  }

  // --- Gambar: file unggahan menang atas URL yang ditempel ---
  const folder = teks(formData.get("slug")) ? `${FOLDER_PRODUK}` : FOLDER_PRODUK;

  const unggahanFoto = berkasDari(formData.get("foto"));
  const unggahanLogo = berkasDari(formData.get("logo"));

  const baris = {
    slug,
    name: nama,
    category_slug: teks(formData.get("category_slug")) || null,
    tagline: teks(formData.get("tagline")),
    description: teks(formData.get("description")),
    price: angka(formData.get("price")),
    compare_at: angka(formData.get("compare_at")),
    rating: desimal(formData.get("rating")),
    reviews: angka(formData.get("reviews")),
    sold: angka(formData.get("sold")),
    version: teks(formData.get("version")),
    updated: teks(formData.get("updated")),
    highlights: daftarBaris(formData.get("highlights")),
    specs: daftarPasangan(formData.get("specs")),
    faq: daftarPasangan(formData.get("faq")),
    art_label: teks(formData.get("art_label")) || nama,
    art_from: teks(formData.get("art_from"), "#1f2937") || "#1f2937",
    art_to: teks(formData.get("art_to"), "#0b0b0c") || "#0b0b0c",
    art_accent: teks(formData.get("art_accent")) || null,
    art_tone: teks(formData.get("art_tone")) === "dark" ? "dark" : "light",
    status: teks(formData.get("status")) === "draft" ? "draft" : "aktif",
  };

  // Ambil data lama dulu (untuk tahu public_id yang perlu dibersihkan).
  const lama = idLama
    ? (await supabase.from("products").select("image_url,image_public_id,logo_url,logo_public_id").eq("id", idLama).single()).data
    : null;

  let imageUrl = teks(formData.get("image_url")) || lama?.image_url || null;
  let imagePublicId = teks(formData.get("image_url")) ? null : (lama?.image_public_id ?? null);
  let logoUrl = teks(formData.get("logo_url")) || lama?.logo_url || null;
  let logoPublicId = teks(formData.get("logo_url")) ? null : (lama?.logo_public_id ?? null);

  try {
    if (unggahanFoto) {
      const hasil = await unggahGambar(unggahanFoto, { folder });
      if (lama?.image_public_id) await hapusGambar(lama.image_public_id);
      imageUrl = hasil.url;
      imagePublicId = hasil.publicId;
    }

    if (unggahanLogo) {
      const hasil = await unggahGambar(unggahanLogo, { folder });
      if (lama?.logo_public_id) await hapusGambar(lama.logo_public_id);
      logoUrl = hasil.url;
      logoPublicId = hasil.publicId;
    }
  } catch (galat) {
    const pesan = galat instanceof Error ? galat.message : "unggahan gagal";
    redirect(`/admin/produk${idLama ? `/${idLama}` : "/baru"}?galat=${encodeURIComponent(pesan)}`);
  }

  const lengkap = { ...baris, image_url: imageUrl, image_public_id: imagePublicId, logo_url: logoUrl, logo_public_id: logoPublicId };

  if (idLama) {
    const { error } = await supabase.from("products").update(lengkap).eq("id", idLama);
    if (error) redirect(`/admin/produk/${idLama}?galat=${encodeURIComponent(error.message)}`);
  } else {
    const { error } = await supabase.from("products").insert(lengkap);
    if (error) redirect(`/admin/produk/baru?galat=${encodeURIComponent(error.message)}`);
  }

  segarkanSitus(slug);
  redirect(`/admin/produk?pesan=${idLama ? "diperbarui" : "dibuat"}`);
}

export async function hapusProdukAction(formData: FormData) {
  await jaga();

  const supabase = ambilSupabase();
  const id = teks(formData.get("id"));

  const { data } = await supabase
    .from("products")
    .select("slug,image_public_id,logo_public_id")
    .eq("id", id)
    .single();

  // Hapus berkas di Cloudinary lebih dulu; kalau gagal, barisnya tetap dihapus
  // (data yatim di storage lebih ringan daripada produk yang tidak bisa dibuang).
  if (data?.image_public_id) await hapusGambar(data.image_public_id);
  if (data?.logo_public_id) await hapusGambar(data.logo_public_id);

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) redirect(`/admin/produk?galat=${encodeURIComponent(error.message)}`);

  segarkanSitus(data?.slug);
  redirect("/admin/produk?pesan=dihapus");
}

/** Tombol cepat aktif/draft di daftar produk. */
export async function ubahStatusProdukAction(formData: FormData) {
  await jaga();

  const supabase = ambilSupabase();
  const id = teks(formData.get("id"));
  const status = teks(formData.get("status")) === "aktif" ? "aktif" : "draft";

  await supabase.from("products").update({ status }).eq("id", id);
  segarkanSitus();
}

// ---------------------------------------------------------------------------
// Kategori
// ---------------------------------------------------------------------------

export async function simpanKategoriAction(formData: FormData) {
  await jaga();

  const supabase = ambilSupabase();
  const slugLama = teks(formData.get("slug_lama"));
  const nama = teks(formData.get("name"));
  const slug = slugDari(teks(formData.get("slug")) || nama);

  if (!nama || !slug) redirect("/admin/kategori?galat=nama-kosong");

  const baris = {
    slug,
    name: nama,
    description: teks(formData.get("description")),
    sort_order: angka(formData.get("sort_order")),
  };

  if (slugLama) {
    const { error } = await supabase.from("categories").update(baris).eq("slug", slugLama);
    if (error) redirect(`/admin/kategori?galat=${encodeURIComponent(error.message)}`);
    // Ganti slug kategori → produk yang memakainya ikut diperbarui.
    if (slugLama !== slug) {
      await supabase.from("products").update({ category_slug: slug }).eq("category_slug", slugLama);
    }
  } else {
    const { error } = await supabase.from("categories").insert(baris);
    if (error) redirect(`/admin/kategori?galat=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/kategori");
  revalidatePath("/kategori");
  revalidatePath("/produk");
  redirect("/admin/kategori?pesan=tersimpan");
}

export async function hapusKategoriAction(formData: FormData) {
  await jaga();

  const supabase = ambilSupabase();
  const slug = teks(formData.get("slug"));

  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_slug", slug);

  // Kategori yang masih dipakai produk tidak dihapus — produknya akan kehilangan
  // kategorinya tanpa penjelasan (FK-nya `on delete set null`).
  if ((count ?? 0) > 0) redirect("/admin/kategori?galat=kategori-dipakai");

  const { error } = await supabase.from("categories").delete().eq("slug", slug);
  if (error) redirect(`/admin/kategori?galat=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/kategori");
  revalidatePath("/kategori");
  redirect("/admin/kategori?pesan=dihapus");
}

// ---------------------------------------------------------------------------
// Pesanan & pembayaran
// ---------------------------------------------------------------------------

export async function ubahStatusPesananAction(formData: FormData) {
  await jaga();

  const supabase = ambilSupabase();
  const id = teks(formData.get("id"));
  const status = teks(formData.get("status"));

  const diizinkan = ["baru", "dikonfirmasi", "dibayar", "selesai", "batal"];
  if (!diizinkan.includes(status)) redirect(`/admin/pesanan/${id}?galat=status-tidak-dikenal`);

  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) redirect(`/admin/pesanan/${id}?galat=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/pesanan");
  revalidatePath(`/admin/pesanan/${id}`);
  redirect(`/admin/pesanan/${id}?pesan=status`);
}

export async function simpanPembayaranAction(formData: FormData) {
  await jaga();

  const supabase = ambilSupabase();
  const orderId = teks(formData.get("order_id"));
  const id = teks(formData.get("id"));
  const status = teks(formData.get("status"));

  const baris = {
    order_id: orderId,
    method: teks(formData.get("method"), "transfer") || "transfer",
    amount: angka(formData.get("amount")),
    status: ["pending", "lunas", "gagal", "refund"].includes(status) ? status : "pending",
    reference: teks(formData.get("reference")) || null,
    // Tanggal bayar diisi otomatis saat statusnya "lunas".
    paid_at: status === "lunas" ? new Date().toISOString() : null,
  };

  const { error } = id
    ? await supabase.from("payments").update(baris).eq("id", id)
    : await supabase.from("payments").insert(baris);

  if (error) redirect(`/admin/pesanan/${orderId}?galat=${encodeURIComponent(error.message)}`);

  // Status pesanan ikut naik jadi "dibayar" begitu ada pembayaran lunas.
  //
  // Hanya dari tahap sebelum pembayaran (`baru` / `dikonfirmasi`) — kalau
  // pesanannya sudah `selesai` atau `batal`, mencatat pembayaran (mis. refund
  // yang salah input) tidak boleh mengembalikannya ke tengah proses.
  if (baris.status === "lunas") {
    await supabase
      .from("orders")
      .update({ status: "dibayar" })
      .eq("id", orderId)
      .in("status", ["baru", "dikonfirmasi"]);
  }

  revalidatePath(`/admin/pesanan/${orderId}`);
  revalidatePath("/admin/pesanan");
  redirect(`/admin/pesanan/${orderId}?pesan=pembayaran`);
}

export async function hapusPembayaranAction(formData: FormData) {
  await jaga();

  const supabase = ambilSupabase();
  const id = teks(formData.get("id"));
  const orderId = teks(formData.get("order_id"));

  const { error } = await supabase.from("payments").delete().eq("id", id);
  if (error) redirect(`/admin/pesanan/${orderId}?galat=${encodeURIComponent(error.message)}`);

  revalidatePath(`/admin/pesanan/${orderId}`);
  redirect(`/admin/pesanan/${orderId}?pesan=pembayaran-dihapus`);
}
