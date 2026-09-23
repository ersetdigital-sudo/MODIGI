import type { Metadata } from "next";

import { PolicyPage } from "@/components/kebijakan/policy-page";
import { syaratKetentuan } from "@/data/policies";

export const metadata: Metadata = {
  // `absolute`: judul SEO lengkap tanpa dobel brand dari template root layout.
  title: { absolute: "Syarat & Ketentuan — Aturan Pembelian | MODIGI" },
  description:
    "Aturan pembelian di MODIGI: masa aktif lisensi 1 tahun, update dari dashboard, support 30 hari, dan hal-hal yang tidak boleh dilakukan — ditulis dengan bahasa yang gampang dibaca.",
};

export default function SyaratKetentuanPage() {
  return <PolicyPage doc={syaratKetentuan} />;
}
