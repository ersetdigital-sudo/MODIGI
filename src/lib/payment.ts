import { cache } from "react";

import { ambilSupabase, supabaseSiap, type BarisMetodeBayar } from "@/lib/supabase";
import type { MetodeBayar, MetodeBayarKind } from "@/types";

/**
 * Rincian cara bayar untuk halaman `/checkout/pembayaran`.
 *
 * Sumbernya tabel `payment_methods` — diatur dari dashboard (`/admin/pembayaran`),
 * bukan dari kode. Efeknya: admin bisa menambah rekening bank, mengganti gambar
 * QRIS, atau menonaktifkan satu metode kapan saja, dan halaman pembeli langsung
 * mengikuti tanpa deploy ulang (aksi admin memanggil `revalidatePath`).
 *
 * ⚠️ Berkas ini memakai klien service_role, jadi hanya boleh diimpor dari server
 * component / server action. Label & teksnya ada di `data/store.ts` supaya
 * komponen klien tidak perlu menyentuh berkas ini.
 *
 * **Kembalinya array kosong kalau belum ada data — dengan sengaja.** Tidak ada
 * nomor rekening contoh di kode: menampilkan rekening karangan di halaman
 * pembayaran jauh lebih berbahaya daripada menampilkan kalimat "rincian menyusul",
 * dan pembeli tetap bisa menekan tombol konfirmasi.
 */

function kindSah(nilai: string): MetodeBayarKind {
  return nilai === "qris" || nilai === "ewallet" ? nilai : "bank";
}

function dariBaris(baris: BarisMetodeBayar): MetodeBayar {
  return {
    id: baris.id,
    kind: kindSah(baris.kind),
    label: baris.label,
    accountNo: baris.account_no,
    accountName: baris.account_name,
    instructions: baris.instructions,
    qrUrl: baris.qr_url,
  };
}

/**
 * Metode pembayaran yang aktif, urut sesuai `sort_order`.
 *
 * Pakai `cache()` supaya satu query hanya jalan sekali per request, walau halaman
 * pembayaran memintanya lebih dari sekali.
 */
export const ambilMetodeBayar = cache(async (): Promise<MetodeBayar[]> => {
  if (!supabaseSiap()) return [];

  try {
    const { data, error } = await ambilSupabase()
      .from("payment_methods")
      .select("id,kind,label,account_no,account_name,instructions,qr_url")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data) return [];

    return (data as unknown as BarisMetodeBayar[]).map(dariBaris);
  } catch {
    return [];
  }
});
