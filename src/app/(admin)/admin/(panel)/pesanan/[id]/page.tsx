import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, MessageCircle, User } from "lucide-react";

import { ubahStatusPesananAction } from "@/app/actions/admin";
import { SubmitButton } from "@/components/admin/buttons";
import { PaymentManager } from "@/components/admin/payment-manager";
import { Alert, Card, Field, PageHeader, Pill, Select, statusPesananNada } from "@/components/admin/ui";
import { formatRupiah, formatWaktu } from "@/lib/format";
import {
  ambilSupabase,
  supabaseSiap,
  type BarisItemPesanan,
  type BarisPembayaran,
  type BarisPesanan,
} from "@/lib/supabase";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Detail pesanan" };

const statusPesanan = [
  { value: "baru", label: "Baru — belum ditindak" },
  { value: "dikonfirmasi", label: "Dikonfirmasi — menunggu bayar" },
  { value: "dibayar", label: "Dibayar — siap instalasi" },
  { value: "selesai", label: "Selesai — lisensi terkirim" },
  { value: "batal", label: "Batal" },
];

const pesanSukses: Record<string, string> = {
  status: "Status pesanan sudah diperbarui.",
  pembayaran: "Catatan pembayaran sudah disimpan.",
  "pembayaran-dihapus": "Catatan pembayaran sudah dihapus.",
};

/**
 * Detail satu pesanan — halaman kerja utama saat melayani pembeli.
 *
 * Isinya lengkap dalam satu layar: siapa pembelinya (dengan tombol langsung ke
 * WhatsApp-nya), apa yang dibeli, statusnya di mana, dan pembayaran yang sudah
 * masuk. Password WP-Admin sengaja TIDAK ditampilkan di sini: password itu tidak
 * pernah disimpan, hanya ada di pesan WhatsApp yang dikirim pembeli.
 */
export default async function PesananDetailPage(props: PageProps<"/admin/pesanan/[id]">) {
  if (!supabaseSiap()) notFound();

  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const pesan = typeof searchParams.pesan === "string" ? searchParams.pesan : "";
  const galat = typeof searchParams.galat === "string" ? searchParams.galat : "";

  const supabase = ambilSupabase();

  const [{ data: pesanan }, { data: item }, { data: pembayaran }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase.from("payments").select("*").eq("order_id", id).order("created_at", { ascending: true }),
  ]);

  if (!pesanan) notFound();

  const baris = pesanan as BarisPesanan;
  const itemnya = (item ?? []) as BarisItemPesanan[];
  const bayar = (pembayaran ?? []) as BarisPembayaran[];

  const lunas = bayar
    .filter((satu) => satu.status === "lunas")
    .reduce((total, satu) => total + satu.amount, 0);

  const pesanWhatsapp = [
    `Halo ${baris.customer_name}, terima kasih sudah order di MODIGI.`,
    ``,
    `Pesanan ${baris.order_no}:`,
    ...itemnya.map((satu) => `- ${satu.product_name} × ${satu.qty} = ${formatRupiah(satu.subtotal)}`),
    `Total: ${formatRupiah(baris.total)}`,
    ``,
    `Domain: ${baris.customer_domain}`,
  ].join("\n");

  return (
    <>
      <Link
        href="/admin/pesanan"
        className="mb-4 inline-flex min-h-6 items-center gap-2 text-[13px] font-semibold text-[#6f6f74] transition-colors hover:text-[#151310]"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Kembali ke daftar pesanan
      </Link>

      <PageHeader
        title={baris.order_no}
        description={`Masuk ${formatWaktu(baris.created_at)} · diperbarui ${formatWaktu(baris.updated_at)}`}
        action={<Pill tone={statusPesananNada(baris.status)}>{baris.status}</Pill>}
      />

      {pesan && pesanSukses[pesan] ? <Alert tone="sukses">{pesanSukses[pesan]}</Alert> : null}
      {galat ? <Alert tone="gagal">Terjadi kesalahan: {galat}</Alert> : null}

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-5">
          <Card title="Item pesanan" description={`${itemnya.length} jenis produk`} bodyClassName="px-0 py-0">
            <ul className="divide-y divide-[#f0f0f3]">
              {itemnya.map((satu) => (
                <li key={satu.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.5px] font-bold">{satu.product_name}</p>
                    <p className="text-[12.5px] text-[#6f6f74]">
                      /produk/{satu.product_slug} · {satu.qty} lisensi × {formatRupiah(satu.price)}
                    </p>
                  </div>

                  <span className="tabular text-[14px] font-bold">{formatRupiah(satu.subtotal)}</span>
                </li>
              ))}
            </ul>

            <dl className="flex flex-col gap-2 border-t border-[#f0f0f3] px-5 py-4 text-[14px]">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[#6f6f74]">Harga resmi</dt>
                <dd className="tabular line-through">{formatRupiah(baris.compare_at_total)}</dd>
              </div>

              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-bold">Total pesanan</dt>
                <dd className="tabular text-[20px] font-extrabold">{formatRupiah(baris.total)}</dd>
              </div>

              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[#6f6f74]">Sudah lunas</dt>
                <dd className="tabular font-semibold text-[#186c3a]">{formatRupiah(lunas)}</dd>
              </div>

              {lunas < baris.total ? (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[#6f6f74]">Kurang</dt>
                  <dd className="tabular font-semibold text-[#a32b1d]">
                    {formatRupiah(baris.total - lunas)}
                  </dd>
                </div>
              ) : null}
            </dl>
          </Card>

          <PaymentManager orderId={baris.id} payments={bayar} sisa={baris.total} />
        </div>

        <div className="flex flex-col gap-5">
          <Card title="Data instalasi" description="Dipakai admin untuk memasang pluginnya.">
            <ul className="flex flex-col gap-3.5 text-[14px]">
              <li className="flex items-start gap-3">
                <User className="mt-0.5 size-4 shrink-0 text-[#8a8a90]" aria-hidden="true" />
                <span>
                  <span className="block text-[12.5px] text-[#6f6f74]">Nama</span>
                  <b>{baris.customer_name}</b>
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Globe className="mt-0.5 size-4 shrink-0 text-[#8a8a90]" aria-hidden="true" />
                <span>
                  <span className="block text-[12.5px] text-[#6f6f74]">Domain WordPress</span>
                  <b>{baris.customer_domain || "—"}</b>
                </span>
              </li>

              <li className="flex items-start gap-3">
                <User className="mt-0.5 size-4 shrink-0 text-[#8a8a90]" aria-hidden="true" />
                <span>
                  <span className="block text-[12.5px] text-[#6f6f74]">Username WP-Admin</span>
                  <b>{baris.wp_user ?? "—"}</b>
                </span>
              </li>
            </ul>

            <a
              href={whatsappLink(pesanWhatsapp, baris.customer_whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#15803d] px-5 text-[14px] font-bold text-white transition-colors hover:bg-[#12672f]"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Chat pembeli ({baris.customer_whatsapp})
            </a>

            <p className="mt-3 text-[12.5px] leading-relaxed text-[#6f6f74]">
              Password WP-Admin tidak ditampilkan di sini karena tidak pernah disimpan — hanya ada
              di pesan WhatsApp yang dikirim pembeli.
            </p>
          </Card>

          <Card title="Status pesanan" description="Ubah tahapannya supaya mudah dipantau.">
            <form action={ubahStatusPesananAction} className="flex flex-col gap-4">
              <input type="hidden" name="id" value={baris.id} />

              <Field label="Status" htmlFor="status">
                <Select id="status" name="status" defaultValue={baris.status}>
                  {statusPesanan.map((pilihan) => (
                    <option key={pilihan.value} value={pilihan.value}>
                      {pilihan.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <SubmitButton pendingLabel="Menyimpan…">Simpan status</SubmitButton>
            </form>

            {baris.note ? (
              <p className="mt-4 rounded-xl bg-[#fafafb] px-4 py-3 text-[13px] leading-relaxed text-[#3a3a3f]">
                Catatan pembeli: {baris.note}
              </p>
            ) : null}
          </Card>
        </div>
      </div>
    </>
  );
}
