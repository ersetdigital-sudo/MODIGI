import { ambilSupabase, supabaseSiap } from "@/lib/supabase";

/**
 * Titik denyut untuk layanan penjadwal (cron-job.org, Vercel Cron, UptimeRobot).
 *
 * Project Supabase **Free** otomatis di-pause kalau tidak ada **aktivitas
 * database** selama sepekan — bukan sekadar "ada request masuk ke situs". Ping ke
 * beranda tidak menolong sama sekali di sini: `/` dan `/kategori` di-prerender
 * saat build, jadi disajikan sebagai HTML jadi tanpa menyentuh database. Halaman
 * `/produk` memang membaca database tiap request, tapi sifatnya kebetulan — begitu
 * halaman itu di-cache atau dijadikan statis, ping-nya diam-diam berhenti berguna.
 *
 * Jadi endpoint ini ada supaya ada satu URL yang memang dibuat untuk membangunkan
 * database, dan niatnya kelihatan dari kodenya sendiri.
 *
 * Ini satu-satunya route handler di proyek: situs sengaja tidak punya endpoint API
 * (data dikirim dari server component, lihat `lib/catalog.ts`). Pengecualiannya di
 * sini karena penjadwal butuh URL yang stabil dan tidak ikut berubah saat halaman
 * toko diutak-atik.
 */

/**
 * `force-dynamic` wajib, bukan hiasan: tanpa itu Next.js boleh menganggap
 * jawabannya statis dan melayani dari cache — ping-nya lapor "sukses" padahal
 * database tidak pernah dibangunkan.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  if (!supabaseSiap()) {
    return Response.json(
      { ok: false, pesan: "Supabase belum dikonfigurasi." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Query kecil tapi nyata: satu baris dari tabel yang selalu ada. Yang dihitung
  // Supabase adalah aktivitas database, jadi harus benar-benar sampai ke Postgres.
  const { error } = await ambilSupabase().from("products").select("slug").limit(1);

  if (error) {
    // Pesan aslinya sengaja tidak dikirim ke luar: endpoint ini publik dan pesan
    // galat database suka membocorkan detail infrastruktur. Masuk ke log server saja.
    console.error("[keepalive] gagal membaca database:", error.message);

    return Response.json(
      { ok: false, pesan: "Database tidak bisa dihubungi." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  return Response.json(
    { ok: true, waktu: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
