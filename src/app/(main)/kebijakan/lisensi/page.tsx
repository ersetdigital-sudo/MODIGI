import type { Metadata } from "next";

import { PolicyPage } from "@/components/kebijakan/policy-page";
import { lisensiProduk } from "@/data/policies";

export const metadata: Metadata = {
  title: { absolute: "Lisensi Produk — Satu Lisensi Satu Domain | MODIGI" },
  description:
    "Rincian lisensi produk MODIGI: aktivasi ke satu domain, masa aktif 1 tahun termasuk update, support 30 hari, pindah domain gratis, dan hal yang tidak termasuk.",
};

export default function LisensiProdukPage() {
  return <PolicyPage doc={lisensiProduk} />;
}
