import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";
import { ambilWhatsappNumber } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Keranjang",
  description:
    "Periksa produk dan jumlah lisensi di keranjang Anda sebelum lanjut ke checkout.",
  // Halaman pribadi: isinya cuma ada di browser pembeli, jadi tidak perlu diindeks.
  robots: { index: false, follow: true },
};

/** Halaman keranjang — isinya hidup di klien (`localStorage`), kerangkanya statis. */
export default async function KeranjangPage() {
  const waNumber = await ambilWhatsappNumber();
  return <CartView waNumber={waNumber} />;
}
