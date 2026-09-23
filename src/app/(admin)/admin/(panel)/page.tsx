import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CloudUpload,
  FolderTree,
  Plus,
  Receipt,
  ShoppingCart,
  Wallet,
} from "lucide-react";

import { tombol } from "@/components/admin/tombol";
import { Alert, Card, PageHeader, Pill, statusPesananNada } from "@/components/admin/ui";
import { cloudinarySiap } from "@/lib/cloudinary";
import { formatRupiah, formatWaktu } from "@/lib/format";
import { ambilSupabase, supabaseSiap } from "@/lib/supabase";

export const metadata: Metadata = { title: "Dasbor" };

/**
 * Ringkasan dashboard.
 *
 * Angka-angka di sini dihitung dari database tiap kali halaman dibuka — sengaja
 * tidak di-cache, karena dashboard yang menampilkan data lama lebih buruk daripada
 * dashboard yang sedikit lambat.
 */
export default async function DasborPage() {
  if (!supabaseSiap()) {
    return (
      <>
        <PageHeader title="Dasbor" />
        <Alert tone="gagal">
          Supabase belum dikonfigurasi. Isi <code>NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> di <code>.env.local</code> (lokal) dan di
          Environment Variables Vercel (produksi), lalu buka ulang halaman ini.
        </Alert>
      </>
    );
  }

  const supabase = ambilSupabase();

  const [produk, produkDraft, kategori, pesanan, pesananBaru, pesananTerbaru] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("categories").select("slug", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "baru"),
    supabase
      .from("orders")
      .select("id,order_no,customer_name,total,status,created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // Omzet dihitung dari pembayaran yang benar-benar lunas — bukan dari pesanan
  // yang dibuat, karena pesanan bisa batal sebelum dibayar.
  const { data: pembayaran } = await supabase.from("payments").select("amount").eq("status", "lunas");
  const omzet = (pembayaran ?? []).reduce((total, baris) => total + baris.amount, 0);

  const statistik = [
    {
      label: "Produk aktif",
      value: String((produk.count ?? 0) - (produkDraft.count ?? 0)),
      catatan: produkDraft.count ? `${produkDraft.count} draft disembunyikan` : "Semua tayang",
      href: "/admin/produk",
      icon: Boxes,
    },
    {
      label: "Pesanan",
      value: String(pesanan.count ?? 0),
      catatan: pesananBaru.count ? `${pesananBaru.count} belum ditindak` : "Tidak ada yang baru",
      href: "/admin/pesanan",
      icon: ShoppingCart,
    },
    {
      label: "Omzet lunas",
      value: formatRupiah(omzet),
      catatan: `${(pembayaran ?? []).length} pembayaran tercatat`,
      href: "/admin/pesanan",
      icon: Wallet,
    },
    {
      label: "Kategori",
      value: String(kategori.count ?? 0),
      catatan: "Urutan diatur di menu kategori",
      href: "/admin/kategori",
      icon: FolderTree,
    },
  ];

  return (
    <>
      <PageHeader
        title="Dasbor"
        description="Ringkasan toko: produk yang tayang, pesanan yang perlu ditindak, dan uang yang sudah masuk."
        action={
          <Link href="/admin/produk/baru" className={tombol.utama}>
            <Plus className="size-4" aria-hidden="true" />
            Tambah produk
          </Link>
        }
      />

      {!cloudinarySiap() ? (
        <Alert tone="gagal">
          Kredensial Cloudinary belum lengkap, jadi unggah gambar produk akan gagal. Isi{" "}
          <code>CLOUDINARY_CLOUD_NAME</code>, <code>CLOUDINARY_API_KEY</code>, dan{" "}
          <code>CLOUDINARY_API_SECRET</code>.
        </Alert>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
        {statistik.map(({ label, value, catatan, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-2xl border border-[#e8e8ec] bg-white p-5 transition-colors hover:border-[#d5d5db]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#6f6f74]">{label}</span>
              <Icon className="size-4 text-[#8a8a90]" aria-hidden="true" />
            </div>

            <p className="tabular mt-3 text-[26px] font-extrabold leading-none tracking-[-0.02em]">
              {value}
            </p>

            <p className="mt-2 text-[12.5px] text-[#6f6f74]">{catatan}</p>
          </Link>
        ))}
      </div>

      {/* `items-start`: kartunya setinggi isinya masing-masing, jadi keadaan kosong
          tidak dipaksa melar mengikuti kartu di sebelahnya. */}
      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card
          title="Pesanan terbaru"
          description="Lima pesanan terakhir yang masuk dari halaman checkout."
          action={
            <Link
              href="/admin/pesanan"
              className="inline-flex min-h-6 items-center gap-1.5 text-[13px] font-semibold text-[#151310] hover:underline"
            >
              Lihat semua
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
          bodyClassName="px-0 py-0"
        >
          {(pesananTerbaru.data ?? []).length === 0 ? (
            <p className="px-5 py-10 text-center text-[13.5px] leading-relaxed text-[#6f6f74]">
              Belum ada pesanan. Pesanan muncul di sini begitu pembeli menekan
              <span className="font-semibold"> Buat Pesanan</span> di halaman checkout.
            </p>
          ) : (
            <ul className="divide-y divide-[#f0f0f3]">
              {(pesananTerbaru.data ?? []).map((pesanan2) => (
                <li key={pesanan2.id}>
                  <Link
                    href={`/admin/pesanan/${pesanan2.id}`}
                    className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[#fafafb]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold">{pesanan2.customer_name}</p>
                      <p className="text-[12.5px] text-[#6f6f74]">
                        {pesanan2.order_no} · {formatWaktu(pesanan2.created_at)}
                      </p>
                    </div>

                    <span className="tabular text-[14px] font-bold">
                      {formatRupiah(pesanan2.total)}
                    </span>

                    <Pill tone={statusPesananNada(pesanan2.status)}>{pesanan2.status}</Pill>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Yang sering dipakai" description="Pintasan ke pekerjaan harian.">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <li>
              <Link
                href="/admin/produk/baru"
                className={tombol.kedua + " w-full justify-start gap-2.5 text-[13.5px]"}
              >
                <Plus className="size-4 shrink-0" aria-hidden="true" />
                Tambah produk baru
              </Link>
            </li>
            <li>
              <Link
                href="/admin/produk"
                className={tombol.kedua + " w-full justify-start gap-2.5 text-[13.5px]"}
              >
                <CloudUpload className="size-4 shrink-0" aria-hidden="true" />
                Unggah & ganti gambar
              </Link>
            </li>
            <li>
              <Link
                href="/admin/kategori"
                className={tombol.kedua + " w-full justify-start gap-2.5 text-[13.5px]"}
              >
                <FolderTree className="size-4 shrink-0" aria-hidden="true" />
                Atur kategori & urutan
              </Link>
            </li>
            <li>
              <Link
                href="/admin/pesanan"
                className={tombol.kedua + " w-full justify-start gap-2.5 text-[13.5px]"}
              >
                <Receipt className="size-4 shrink-0" aria-hidden="true" />
                Catat pembayaran masuk
              </Link>
            </li>
          </ul>

          <p className="mt-4 text-[12.5px] leading-relaxed text-[#6f6f74]">
            Perubahan produk langsung tampil di situs setelah disimpan — tidak perlu deploy
            ulang.
          </p>
        </Card>
      </div>
    </>
  );
}
