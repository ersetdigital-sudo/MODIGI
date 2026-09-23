import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Autentikasi dashboard admin.
 *
 * Satu password (`ADMIN_PASSWORD`) untuk satu pengelola toko — bukan sistem akun
 * berlapis. Itu pilihan sadar: yang dijaga cuma dashboard internal, dan menambah
 * tabel user + reset password hanya menambah hal yang bisa bocor tanpa menambah
 * keamanan nyata untuk satu orang. Kalau nanti ada beberapa staf, langkah
 * berikutnya adalah Supabase Auth (sudah ada di project yang sama).
 *
 * Sesi = cookie httpOnly berisi `kedaluwarsa.tandaTangan`. Tanda tangannya
 * HMAC-SHA256 dari waktu kedaluwarsa memakai `ADMIN_SESSION_SECRET`, jadi isi
 * cookie tidak bisa diubah dari browser tanpa tahu secret-nya.
 */

export const COOKIE_SESI = "modigi_admin";

/** Umur sesi: 12 jam — cukup untuk satu hari kerja, tidak menggantung selamanya. */
const UMUR_SESI_JAM = 12;

function rahasiaSesi() {
  const rahasia = process.env.ADMIN_SESSION_SECRET;
  if (!rahasia) throw new Error("ADMIN_SESSION_SECRET belum diisi.");
  return rahasia;
}

function tandatangani(isi: string) {
  return createHmac("sha256", rahasiaSesi()).update(isi).digest("hex");
}

/** Bandingkan dua string tanpa membocorkan isinya lewat selisih waktu. */
function samaAman(a: string, b: string) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  // timingSafeEqual menolak panjang yang berbeda — panjangnya sendiri tidak rahasia.
  if (bufferA.length !== bufferB.length) return false;

  return timingSafeEqual(bufferA, bufferB);
}

/** Cocokkan password yang diketik dengan `ADMIN_PASSWORD`. */
export function passwordBenar(tekanan: string) {
  const benar = process.env.ADMIN_PASSWORD;

  if (!benar) throw new Error("ADMIN_PASSWORD belum diisi.");
  if (!tekanan) return false;

  return samaAman(tekanan, benar);
}

/** Token sesi baru yang berlaku `UMUR_SESI_JAM` jam. */
export function buatTokenSesi() {
  const kedaluwarsa = Date.now() + UMUR_SESI_JAM * 60 * 60 * 1000;
  const isi = String(kedaluwarsa);

  return `${isi}.${tandatangani(isi)}`;
}

/** Token masih sah? (tanda tangan cocok & belum kedaluwarsa) */
export function tokenSah(token: string | undefined) {
  if (!token) return false;

  const [isi, tanda] = token.split(".");
  if (!isi || !tanda) return false;

  if (!samaAman(tanda, tandatangani(isi))) return false;

  const kedaluwarsa = Number(isi);
  return Number.isFinite(kedaluwarsa) && kedaluwarsa > Date.now();
}

/** Apakah permintaan ini datang dari admin yang sudah login? */
export async function sudahMasuk() {
  const token = (await cookies()).get(COOKIE_SESI)?.value;
  return tokenSah(token);
}

/** Opsi cookie sesi — dipakai saat login dan saat logout. */
export function opsiCookieSesi(maxAgeDetik: number) {
  return {
    name: COOKIE_SESI,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeDetik,
  };
}
