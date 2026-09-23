import type { Metadata } from "next";

import { PolicyPage } from "@/components/kebijakan/policy-page";
import { refundGaransi } from "@/data/policies";

export const metadata: Metadata = {
  title: { absolute: "Refund & Garansi — Uang Kembali 100% | MODIGI" },
  description:
    "Garansi MODIGI: kalau lisensi tidak bisa diaktivasi dan tidak bisa kami selesaikan, uang Anda kembali penuh. Berikut syarat, pengecualian, dan cara mengajukannya.",
};

export default function RefundGaransiPage() {
  return <PolicyPage doc={refundGaransi} />;
}
