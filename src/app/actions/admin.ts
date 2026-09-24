"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { buatTokenSesi, opsiCookieSesi, passwordBenar, sudahMasuk } from "@/lib/admin-auth";
import { FOLDER_BAYAR, FOLDER_PRODUK, hapusGambar, unggahGambar } from "@/lib/cloudinary";
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
 * Dua kolom berpasangan dari formulir → `[[judul, isi], …]` (spesifikasi & FAQ).
 *
 * Formulirnya mengirim dua daftar bernama sama — `{dasar}_label` dan `{dasar}_value`
 * — satu entri per baris. `formData.getAll()` mempertahankan urutan elemen di DOM,
 * jadi baris ke-n di dashboard = baris ke-n di tabel halaman produk tanpa perlu
 * penanda indeks. Baris yang judulnya kosong dibuang (baris sisa tombol tambah).
 */
function kolomPasangan(formData: FormData, dasar: string): [string, string][] {
  const judul = formData.getAll(`${dasar}_label`);
  const isi = formData.getAll(`${dasar}_value`);

  return judul
    .map((nilai, index) => [teks(nilai), teks(isi[index] ?? null)] as [string, string])
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

  /**
   * Baris lama diambil lebih dulu, untuk dua hal:
   * 1. tahu `public_id` gambar yang perlu dibersihkan saat diganti, dan
   * 2. **mempertahankan kolom yang tidak lagi ada di formulir** (versi, tanggal
   *    update, warna box 3D). Formulir yang lebih ringkas tidak boleh menghapus
   *    data yang sudah ada — produk lama tetap utuh walau disimpan ulang.
   */
  const lama = idLama
    ? (
        await supabase
          .from("products")
          .select(
            "image_url,image_public_id,logo_url,logo_public_id,version,updated,art_label,art_from,art_to,art_accent,art_tone",
          )
          .eq("id", idLama)
          .single()
      ).data
    : null;

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
    version: teks(formData.get("version")) || lama?.version || "",
    updated: teks(formData.get("updated")) || lama?.updated || "",
    highlights: daftarBaris(formData.get("highlights")),
    specs: kolomPasangan(formData, "specs"),
    faq: kolomPasangan(formData, "faq"),
    art_label: teks(formData.get("art_label")) || lama?.art_label || nama,
    art_from: teks(formData.get("art_from")) || lama?.art_from || "#1f2937",
    art_to: teks(formData.get("art_to")) || lama?.art_to || "#0b0b0c",
    art_accent: teks(formData.get("art_accent")) || lama?.art_accent || null,
    art_tone:
      (teks(formData.get("art_tone")) || lama?.art_tone) === "dark" ? "dark" : "light",
    status: teks(formData.get("status")) === "draft" ? "draft" : "aktif",
  };

  const urlFoto = teks(formData.get("image_url"));
  const urlLogo = teks(formData.get("logo_url"));

  /*
   * Kolom URL di formulir selalu terisi URL yang sedang dipakai, jadi "isinya tidak
   * kosong" BUKAN tanda gambar baru. Yang menentukan adalah apakah URL-nya berubah:
   *
   * - URL sama dengan yang tersimpan (admin cuma menekan Simpan) → `public_id`
   *   dipertahankan. Kalau tidak, berkas lama di Cloudinary jadi yatim: tidak
   *   dipakai lagi tapi tidak pernah bisa dihapus.
   * - URL berbeda → gambar diganti, berkas Cloudinary lama langsung dibuang.
   */
  const gantiFoto = unggahanFoto !== null || (Boolean(urlFoto) && urlFoto !== lama?.image_url);
  const gantiLogo = unggahanLogo !== null || (Boolean(urlLogo) && urlLogo !== lama?.logo_url);

  let imageUrl = urlFoto || lama?.image_url || null;
  let imagePublicId = gantiFoto ? null : (lama?.image_public_id ?? null);
  let logoUrl = urlLogo || lama?.logo_url || null;
  let logoPublicId = gantiLogo ? null : (lama?.logo_public_id ?? null);

  try {
    if (unggahanFoto) {
      const hasil = await unggahGambar(unggahanFoto, { folder });
      if (lama?.image_public_id) await hapusGambar(lama.image_public_id);
      imageUrl = hasil.url;
      imagePublicId = hasil.publicId;
    } else if (gantiFoto && lama?.image_public_id) {
      await hapusGambar(lama.image_public_id);
    }

    if (unggahanLogo) {
      const hasil = await unggahGambar(unggahanLogo, { folder });
      if (lama?.logo_public_id) await hapusGambar(lama.logo_public_id);
      logoUrl = hasil.url;
      logoPublicId = hasil.publicId;
    } else if (gantiLogo && lama?.logo_public_id) {
      await hapusGambar(lama.logo_public_id);
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

// ---------------------------------------------------------------------------
// Metode pembayaran (rincian yang dilihat pembeli)
// ---------------------------------------------------------------------------

/** Jenis metode yang diizinkan — nilai lain jatuh ke "bank". */
const KIND_BAYAR = ["bank", "qris", "ewallet"];

/**
 * Segarkan halaman pembeli **dan** halaman admin yang menampilkannya.
 *
 * Halaman `/checkout/pembayaran` menampilkan nomor rekening yang dilihat pembeli
 * — kalau admin menambah rekening dan halaman itu masih memakai versi lama,
 * pembeli bisa mengirim uang ke nomor yang sudah tidak dipakai.
 */
function segarkanPembayaran() {
  revalidatePath("/checkout/pembayaran");
  revalidatePath("/admin/pembayaran");
  revalidatePath("/admin");
}

/**
 * Simpan metode pembayaran — satu formulir untuk **tambah** dan **edit**.
 *
 * Gambar QRIS opsional: diunggah ke Cloudinary seperti foto produk, dan berkas
 * lamanya dihapus saat diganti supaya akun tidak menumpuk sampah. Ada juga jalur
 * "hapus gambar" untuk metode yang pindah dari QRIS ke transfer bank.
 */
export async function simpanMetodeBayarAction(formData: FormData) {
  await jaga();

  const supabase = ambilSupabase();
  const id = teks(formData.get("id"));
  const label = teks(formData.get("label"));

  if (!label) redirect("/admin/pembayaran?galat=label-kosong");

  const kind = teks(formData.get("kind"), "bank");

  const lama = id
    ? (
        await supabase
          .from("payment_methods")
          .select("qr_url,qr_public_id")
          .eq("id", id)
          .single()
      ).data
    : null;

  let qrUrl = lama?.qr_url ?? null;
  let qrPublicId = lama?.qr_public_id ?? null;

  const berkasQr = berkasDari(formData.get("qr"));
  const buangQr = teks(formData.get("buang_qr")) === "1";

  try {
    if (berkasQr) {
      const hasil = await unggahGambar(berkasQr, { folder: FOLDER_BAYAR });
      if (lama?.qr_public_id) await hapusGambar(lama.qr_public_id);
      qrUrl = hasil.url;
      qrPublicId = hasil.publicId;
    } else if (buangQr && qrPublicId) {
      await hapusGambar(qrPublicId);
      qrUrl = null;
      qrPublicId = null;
    }
  } catch (galat) {
    const pesan = galat instanceof Error ? galat.message : "unggahan gagal";
    redirect(`/admin/pembayaran?galat=${encodeURIComponent(pesan)}`);
  }

  const baris = {
    kind: KIND_BAYAR.includes(kind) ? kind : "bank",
    label,
    account_no: teks(formData.get("account_no")),
    account_name: teks(formData.get("account_name")),
    instructions: teks(formData.get("instructions")),
    qr_url: qrUrl,
    qr_public_id: qrPublicId,
    // Checkbox yang tidak dicentang tidak terkirim sama sekali. Form-nya mengirim
    // nilai "0" dari input tersembunyi di belakang checkbox, jadi "tidak ada" dan
    // "nonaktif" tidak tertukar.
    is_active: teks(formData.get("is_active")) === "1",
    sort_order: angka(formData.get("sort_order")),
  };

  const { error } = id
    ? await supabase.from("payment_methods").update(baris).eq("id", id)
    : await supabase.from("payment_methods").insert(baris);

  if (error) redirect(`/admin/pembayaran?galat=${encodeURIComponent(error.message)}`);

  segarkanPembayaran();
  redirect(`/admin/pembayaran?pesan=${id ? "diperbarui" : "dibuat"}`);
}

/** Tombol cepat tampil/sembunyi di daftar metode. */
export async function ubahStatusMetodeAction(formData: FormData) {
  await jaga();

  const supabase = ambilSupabase();
  const id = teks(formData.get("id"));
  const aktif = teks(formData.get("is_active")) === "1";

  const { error } = await supabase
    .from("payment_methods")
    .update({ is_active: aktif })
    .eq("id", id);

  if (error) redirect(`/admin/pembayaran?galat=${encodeURIComponent(error.message)}`);

  segarkanPembayaran();
  redirect(`/admin/pembayaran?pesan=${aktif ? "ditampilkan" : "disembunyikan"}`);
}

export async function hapusMetodeBayarAction(formData: FormData) {
  await jaga();

  const supabase = ambilSupabase();
  const id = teks(formData.get("id"));

  const { data } = await supabase
    .from("payment_methods")
    .select("qr_public_id")
    .eq("id", id)
    .single();

  // Hapus gambar QRIS di Cloudinary dulu; kalau gagal, barisnya tetap dihapus.
  if (data?.qr_public_id) await hapusGambar(data.qr_public_id);

  const { error } = await supabase.from("payment_methods").delete().eq("id", id);
  if (error) redirect(`/admin/pembayaran?galat=${encodeURIComponent(error.message)}`);

  segarkanPembayaran();
  redirect("/admin/pembayaran?pesan=dihapus");
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

// ---------------------------------------------------------------------------
// Pengaturan (WhatsApp, dll)
// ---------------------------------------------------------------------------

/** Segarkan semua halaman yang menampilkan nomor WhatsApp. */
function segarkanWhatsapp() {
  revalidatePath("/");
  revalidatePath("/produk");
  revalidatePath("/bantuan");
  revalidatePath("/tentang");
  revalidatePath("/testimoni");
  revalidatePath("/kategori");
  revalidatePath("/checkout");
  revalidatePath("/checkout/pembayaran");
  revalidatePath("/admin/pengaturan");
}

export async function simpanWhatsappAction(formData: FormData) {
  await jaga();

  const supabase = ambilSupabase();
  const nomor = teks(formData.get("whatsapp_number"));

  if (!nomor) redirect("/admin/pengaturan?galat=nomor-kosong");

  const { error } = await supabase
    .from("settings")
    .upsert({ key: "whatsapp_number", value: nomor }, { onConflict: "key" });

  if (error) redirect(`/admin/pengaturan?galat=${encodeURIComponent(error.message)}`);

  segarkanWhatsapp();
  redirect("/admin/pengaturan?pesan=berhasil");
}
