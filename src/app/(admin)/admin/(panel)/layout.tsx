import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { sudahMasuk } from "@/lib/admin-auth";
import { ambilSupabase, supabaseSiap } from "@/lib/supabase";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Dashboard MODIGI" },
  robots: { index: false, follow: false },
};

/**
 * Layout semua halaman dashboard (kecuali halaman masuk).
 *
 * Penjagaan sesi ada DI SINI dan juga di setiap server action: halaman admin
 * tidak boleh diandalkan sebagai satu-satunya penjaga, karena Server Action bisa
 * dipanggil langsung tanpa melewati tampilan.
 */
export default async function PanelLayout({ children }: { children: ReactNode }) {
  if (!(await sudahMasuk())) redirect("/admin/masuk");

  // Lencana "pesanan baru" di menu. Kalau Supabase belum siap, dashboard tetap
  // tampil dengan pesan yang menjelaskan (lihat halaman dasbor).
  let pesananBaru = 0;

  if (supabaseSiap()) {
    const { count } = await ambilSupabase()
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "baru");

    pesananBaru = count ?? 0;
  }

  return (
    <AdminShell akun="Admin MODIGI" lencanaPesanan={pesananBaru}>
      {children}
    </AdminShell>
  );
}
