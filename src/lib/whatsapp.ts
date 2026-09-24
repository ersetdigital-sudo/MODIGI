import { cache } from "react";

import { whatsappNumber as fallbackNumber } from "@/data/store";
import { ambilSupabase, supabaseSiap } from "@/lib/supabase";

/**
 * Ambil nomor WhatsApp dari database, dengan fallback ke data statis.
 * Di-cache per request supaya tidak query berulang.
 */
export const ambilWhatsappNumber = cache(async (): Promise<string> => {
  if (!supabaseSiap()) return fallbackNumber;

  try {
    const { data, error } = await ambilSupabase()
      .from("settings")
      .select("value")
      .eq("key", "whatsapp_number")
      .maybeSingle();

    if (error || !data) return fallbackNumber;
    return data.value || fallbackNumber;
  } catch {
    return fallbackNumber;
  }
});

/**
 * Bikin tautan `wa.me` dengan pesan yang sudah terisi.
 * Nomor diambil dari database (tabel settings), fallback ke `src/data/store.ts`.
 *
 * Bisa diarahkan ke nomor lain — dipakai dashboard admin untuk membalas pembeli
 * dari nomor mereka sendiri. Nomor lokal (08…) dinormalkan ke format `62…` dulu,
 * karena `wa.me` menolak angka nol di depan.
 */
export function whatsappLink(message: string, nomor: string = fallbackNumber) {
  const rapi = nomor.replace(/\D/g, "").replace(/^0/, "62");

  return `https://wa.me/${rapi}?text=${encodeURIComponent(message)}`;
}
