import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";

import { Alert, Card, EmptyState, PageHeader, Pill, statusPesananNada } from "@/components/admin/ui";
import { formatRupiah, formatWaktu } from "@/lib/format";
import { ambilSupabase, supabaseSiap, type BarisItemPesanan, type BarisPesanan } from "@/lib/supabase";

export const metadata: Metadata = { title: "Pesanan" };

/**
 * Daftar pesanan.
 *
 * Pesanan dibuat otomatis saat pembeli menekan "Buat Pesanan" di halaman checkout
 * (server action `buatPesananAction`), jadi isinya sama dengan yang masuk ke
 * WhatsApp admin — hanya saja yang ini bisa dicari, diberi status, dan dicatat
 * pembayarannya.
 *
 * Dua bentuk, satu data:
 * - **Desktop (≥ lg)** memakai `<table>`: pesanan itu baris berkolom (nomor, item,
 *   total, status), jadi bentuk tabel jauh lebih cepat dibaca dan dibandingkan
 *   daripada tumpukan kartu — apalagi kolomnya bisa sejajar dari atas ke bawah.
 * - **Layar kecil** tetap kartu: tabel selebar itu tidak akan terbaca di ponsel,
 *   dan admin memang sering membuka pesanan dari HP.
 */
export default async function PesananAdminPage() {
  if (!supabaseSiap()) {
    return (
      <>
        <PageHeader title="Pesanan" />
        <Alert tone="gagal">Supabase belum dikonfigurasi.</Alert>
      </>
    );
  }

  const supabase = ambilSupabase();

  const [{ data: pesanan }, { data: item }] = await Promise.all([
    supabase
      .from("orders")
      .select("id,order_no,customer_name,customer_whatsapp,customer_domain,total,status,created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.from("order_items").select("order_id,product_name,qty"),
  ]);

  const daftar = (pesanan ?? []) as BarisPesanan[];
  const itemPerPesanan = new Map<string, BarisItemPesanan[]>();

  for (const baris of (item ?? []) as BarisItemPesanan[]) {
    const kumpulan = itemPerPesanan.get(baris.order_id) ?? [];
    kumpulan.push(baris);
    itemPerPesanan.set(baris.order_id, kumpulan);
  }

  const baru = daftar.filter((baris) => baris.status === "baru").length;

  return (
    <>
      <PageHeader
        title="Pesanan"
        description={
          daftar.length === 0
            ? "Belum ada pesanan yang masuk."
            : `${daftar.length} pesanan terakhir${baru > 0 ? ` · ${baru} belum ditindak` : ""}.`
        }
      />

      {daftar.length === 0 ? (
        <EmptyState
          title="Belum ada pesanan"
          description="Setiap pesanan dari halaman checkout tercatat di sini, lengkap dengan data instalasi dan pembayarannya."
        />
      ) : (
        <>
          {/* Desktop: tabel. Barisnya bisa diklik — tautannya "dipanjangkan" ke
              seluruh baris lewat `after:absolute`, karena <tr> tidak boleh
              dibungkus <a>. */}
          <div className="hidden overflow-hidden rounded-2xl border border-[#e8e8ec] bg-white lg:block">
            <table className="w-full text-left text-[13.5px]">
              <caption className="sr-only">
                Pesanan terakhir beserta pembeli, item, total, dan statusnya
              </caption>

              <thead className="bg-[#fafafb] text-[11.5px] uppercase tracking-[0.08em] text-[#6f6f74]">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold">
                    Pembeli
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    Nomor pesanan
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    Item
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    Domain
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-bold">
                    Total
                  </th>
                  <th scope="col" className="px-4 py-3 font-bold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0f0f3]">
                {daftar.map((baris) => {
                  const itemnya = itemPerPesanan.get(baris.id) ?? [];
                  const jumlahLisensi = hitungLisensi(itemnya);

                  return (
                    <tr key={baris.id} className="relative transition-colors hover:bg-[#fafafb]">
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/pesanan/${baris.id}`}
                          className="font-bold tracking-[-0.01em] after:absolute after:inset-0 focus-visible:outline-none"
                        >
                          {baris.customer_name}
                        </Link>
                        <p className="mt-0.5 text-[12px] text-[#6f6f74]">{baris.customer_whatsapp}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="tabular font-semibold">{baris.order_no}</p>
                        <p className="mt-0.5 text-[12px] text-[#6f6f74]">
                          {formatWaktu(baris.created_at)}
                        </p>
                      </td>

                      <td className="max-w-[20rem] px-4 py-3.5">
                        <p className="line-clamp-2 text-[#3a3a3f]">{ringkasItem(itemnya)}</p>
                        <p className="mt-0.5 text-[12px] text-[#6f6f74]">{jumlahLisensi} lisensi</p>
                      </td>

                      <td className="px-4 py-3.5 text-[#3a3a3f]">{baris.customer_domain || "—"}</td>

                      <td className="tabular px-4 py-3.5 text-right font-extrabold">
                        {formatRupiah(baris.total)}
                      </td>

                      <td className="px-4 py-3.5">
                        <Pill tone={statusPesananNada(baris.status)}>{baris.status}</Pill>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Layar kecil: kartu, seperti sebelumnya. */}
          <ul className="flex flex-col gap-3 lg:hidden">
            {daftar.map((baris) => {
              const itemnya = itemPerPesanan.get(baris.id) ?? [];

              return (
                <li key={baris.id}>
                  <Link href={`/admin/pesanan/${baris.id}`} className="block">
                    <Card bodyClassName="flex flex-wrap items-start gap-4 px-4 py-4 transition-colors hover:bg-[#fafafb]">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#151310] text-[#c9a664]">
                        <ShoppingCart className="size-[18px]" aria-hidden="true" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[15px] font-bold tracking-[-0.01em]">
                            {baris.customer_name}
                          </p>
                          <Pill tone={statusPesananNada(baris.status)}>{baris.status}</Pill>
                        </div>

                        <p className="mt-1 text-[12.5px] text-[#6f6f74]">
                          {baris.order_no} · {formatWaktu(baris.created_at)} · {baris.customer_whatsapp}
                        </p>

                        <p className="mt-2 line-clamp-2 text-[13px] text-[#3a3a3f]">
                          {ringkasItem(itemnya)}
                        </p>

                        <p className="mt-1.5 text-[12.5px] text-[#6f6f74]">
                          Domain: {baris.customer_domain || "—"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="tabular text-[15px] font-extrabold">
                            {formatRupiah(baris.total)}
                          </p>
                          <p className="text-[12px] text-[#6f6f74]">
                            {hitungLisensi(itemnya)} lisensi
                          </p>
                        </div>

                        <ArrowRight className="size-4 text-[#8a8a90]" aria-hidden="true" />
                      </div>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}

/** Ringkasan item satu pesanan: "Elementor Pro ×1 · WP Rocket ×2". */
function ringkasItem(itemnya: BarisItemPesanan[]) {
  return itemnya.map((satu) => `${satu.product_name} ×${satu.qty}`).join(" · ") || "Tanpa item";
}

/** Jumlah lisensi (qty dijumlahkan, bukan jumlah baris). */
function hitungLisensi(itemnya: BarisItemPesanan[]) {
  return itemnya.reduce((total, satu) => total + satu.qty, 0);
}
