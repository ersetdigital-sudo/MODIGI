import { whatsappNumber } from "@/data/store";

/**
 * Bikin tautan `wa.me` dengan pesan yang sudah terisi.
 * Nomornya diatur sekali di `src/data/store.ts` (`whatsappNumber`).
 *
 * Bisa diarahkan ke nomor lain — dipakai dashboard admin untuk membalas pembeli
 * dari nomor mereka sendiri. Nomor lokal (08…) dinormalkan ke format `62…` dulu,
 * karena `wa.me` menolak angka nol di depan.
 */
export function whatsappLink(message: string, nomor: string = whatsappNumber) {
  const rapi = nomor.replace(/\D/g, "").replace(/^0/, "62");

  return `https://wa.me/${rapi}?text=${encodeURIComponent(message)}`;
}
