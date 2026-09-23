import type { Metadata } from "next";

import { PolicyPage } from "@/components/kebijakan/policy-page";
import { kebijakanPrivasi } from "@/data/policies";

export const metadata: Metadata = {
  title: { absolute: "Kebijakan Privasi — Data yang Kami Simpan | MODIGI" },
  description:
    "Kebijakan privasi MODIGI: data apa yang kami simpan, untuk apa dipakai, siapa yang bisa melihat, dan cara meminta salinan atau penghapusan data Anda.",
};

export default function KebijakanPrivasiPage() {
  return <PolicyPage doc={kebijakanPrivasi} />;
}
