import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { PaymentMethodManager } from "@/components/admin/payment-method-manager";
import { tombol } from "@/components/admin/tombol";
import { Alert, PageHeader } from "@/components/admin/ui";
import { ambilSupabase, supabaseSiap, type BarisMetodeBayar } from "@/lib/supabase";

export const metadata: Metadata = { title: "Pembayaran" };

const pesanSukses: Record<string, string> = {
  dibuat: "Metode pembayaran sudah ditambahkan dan langsung tampil di halaman pembeli.",
  diperbarui: "Perubahan metode pembayaran sudah disimpan.",
  dihapus: "Metode pembayaran sudah dihapus.",
  ditampilkan: "Metode ini sekarang tampil di halaman pembayaran.",
  disembunyikan: "Metode ini disembunyikan — pembeli tidak melihatnya lagi.",
};

const pesanGalat: Record<string, string> = {
  "label-kosong": "Nama metode wajib diisi — itu yang dilihat pembeli saat memilih cara bayar.",
};

/**
 * Pengaturan cara bayar — sumbernya untuk halaman `/checkout/pembayaran`.
 *
 * Dipisah dari menu **Pesanan** dengan sengaja: di sana admin mencatat uang yang
 * benar-benar masuk untuk satu pesanan, di sini admin mengatur rincian yang
 * **ditampilkan** ke semua pembeli. Dua hal berbeda yang mudah tertukar.
 */
export default async function PembayaranAdminPage(props: PageProps<"/admin/pembayaran">) {
  if (!supabaseSiap()) {
    return (
      <>
        <PageHeader title="Pembayaran" />
        <Alert tone="gagal">Supabase belum dikonfigurasi.</Alert>
      </>
    );
  }

  const searchParams = await props.searchParams;
  const pesan = typeof searchParams.pesan === "string" ? searchParams.pesan : "";
  const galat = typeof searchParams.galat === "string" ? searchParams.galat : "";

  const { data } = await ambilSupabase()
    .from("payment_methods")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <>
      <PageHeader
        title="Pembayaran"
        description="Nomor rekening & QRIS yang dilihat pembeli di halaman /checkout/pembayaran. Urutannya mengikuti kolom Urutan."
        action={
          <Link href="/checkout/pembayaran" target="_blank" className={tombol.kedua}>
            <ExternalLink className="size-4" aria-hidden="true" />
            Lihat halaman pembeli
          </Link>
        }
      />

      {pesan && pesanSukses[pesan] ? <Alert tone="sukses">{pesanSukses[pesan]}</Alert> : null}
      {galat ? <Alert tone="gagal">{pesanGalat[galat] ?? `Terjadi kesalahan: ${galat}`}</Alert> : null}

      <PaymentMethodManager methods={(data as BarisMetodeBayar[]) ?? []} />
    </>
  );
}
