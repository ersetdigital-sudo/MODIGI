import { createHash } from "node:crypto";

/**
 * Unggah & hapus gambar produk di Cloudinary — sisi server saja.
 *
 * Sengaja TIDAK memakai SDK: yang dibutuhkan cuma dua panggilan REST dengan
 * signature SHA-1 (`node:crypto`), jadi tidak ada dependency tambahan yang perlu
 * dirawat. Kalau nanti butuh transformasi gambar yang rumit, SDK resminya bisa
 * dipasang dan berkas ini jadi pembungkus tipisnya.
 *
 * ⚠️ Berkas ini memakai `CLOUDINARY_API_SECRET`, jadi hanya boleh diimpor dari
 * route handler / server action — JANGAN dari komponen klien.
 */

const awan = process.env.CLOUDINARY_CLOUD_NAME;
const kunci = process.env.CLOUDINARY_API_KEY;
const rahasia = process.env.CLOUDINARY_API_SECRET;

/** Folder default di akun Cloudinary. */
export const FOLDER_PRODUK = "modigi/produk";

/** `true` kalau ketiga kredensial Cloudinary sudah diisi. */
export function cloudinarySiap() {
  return Boolean(awan && kunci && rahasia);
}

export type HasilUnggah = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
};

/**
 * Signature Cloudinary: parameter (kecuali `file` & `api_key`) diurutkan
 * alfabetis, digabung `kunci=nilai&…`, ditambah API secret, lalu SHA-1.
 */
function tandaTangan(parameter: Record<string, string>) {
  const urut = Object.keys(parameter)
    .sort()
    .map((kunci2) => `${kunci2}=${parameter[kunci2]}`)
    .join("&");

  return createHash("sha1").update(`${urut}${rahasia}`).digest("hex");
}

const BATAS_BYTE = 5 * 1024 * 1024; // 5 MB — cukup untuk foto produk, ramah lambat
const FORMAT_DIIZINKAN = ["jpg", "jpeg", "png", "webp", "avif"];

/**
 * Unggah satu gambar produk.
 *
 * Mengembalikan URL `secure_url` Cloudinary (siap dipakai di `next/image`) plus
 * `public_id`-nya — public_id disimpan di database supaya berkas lama bisa
 * dihapus saat admin mengganti gambarnya.
 */
export async function unggahGambar(
  berkas: File,
  opsi: { folder?: string } = {},
): Promise<HasilUnggah> {
  if (!cloudinarySiap()) {
    throw new Error("Kredensial Cloudinary belum diisi (CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET).");
  }

  const ekstensi = (berkas.name.split(".").pop() ?? "").toLowerCase();

  if (!FORMAT_DIIZINKAN.includes(ekstensi)) {
    throw new Error(`Format .${ekstensi || "?"} tidak didukung. Pakai JPG, PNG, WebP, atau AVIF.`);
  }

  if (berkas.size > BATAS_BYTE) {
    throw new Error(
      `Ukuran berkas ${(berkas.size / 1024 / 1024).toFixed(1)} MB — maksimal 5 MB.`,
    );
  }

  const folder = opsi.folder ?? FOLDER_PRODUK;
  const timestamp = String(Math.floor(Date.now() / 1000));

  const form = new FormData();
  form.append("file", berkas);
  form.append("api_key", kunci!);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  // Batasi ukuran di sisi Cloudinary juga (jaring pengaman kedua).
  form.append("transformation", "c_limit,w_1600,h_1600,q_auto");
  form.append("signature", tandaTangan({ folder, timestamp, transformation: "c_limit,w_1600,h_1600,q_auto" }));

  const res = await fetch(`https://api.cloudinary.com/v1_1/${awan}/image/upload`, {
    method: "POST",
    body: form,
  });

  const data = (await res.json()) as {
    secure_url?: string;
    public_id?: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
    error?: { message?: string };
  };

  if (!res.ok || !data.secure_url || !data.public_id) {
    throw new Error(`Cloudinary menolak unggahan: ${data.error?.message ?? res.status}`);
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width ?? 0,
    height: data.height ?? 0,
    format: data.format ?? ekstensi,
    bytes: data.bytes ?? berkas.size,
  };
}

/**
 * Hapus gambar dari Cloudinary.
 *
 * Dipanggil saat admin mengganti/menghapus foto produk. Kalau gagal, unggahan
 * baru tetap dianggap berhasil — berkas lama yang tertinggal jauh lebih ringan
 * akibatnya daripada produk yang gambarnya hilang.
 */
export async function hapusGambar(publicId: string) {
  if (!cloudinarySiap() || !publicId) return false;

  const timestamp = String(Math.floor(Date.now() / 1000));

  const form = new FormData();
  form.append("public_id", publicId);
  form.append("api_key", kunci!);
  form.append("timestamp", timestamp);
  form.append("signature", tandaTangan({ public_id: publicId, timestamp }));

  const res = await fetch(`https://api.cloudinary.com/v1_1/${awan}/image/destroy`, {
    method: "POST",
    body: form,
  });

  return res.ok;
}
