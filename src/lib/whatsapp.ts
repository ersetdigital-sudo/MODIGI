import { whatsappNumber } from "@/data/store";

/**
 * Bikin tautan `wa.me` dengan pesan yang sudah terisi.
 * Nomornya diatur sekali di `src/data/store.ts` (`whatsappNumber`).
 */
export function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
