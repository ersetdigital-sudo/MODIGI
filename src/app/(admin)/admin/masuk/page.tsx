import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";

import { masukAction } from "@/app/actions/admin";
import { SubmitButton } from "@/components/admin/buttons";
import { Field, Input } from "@/components/admin/ui";
import { sudahMasuk } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Masuk dashboard",
  robots: { index: false, follow: false },
};

/**
 * Halaman masuk dashboard.
 *
 * Satu password untuk satu pengelola toko (lihat `lib/admin-auth.ts` untuk
 * alasannya). Untuk mengubah passwordnya: ganti `ADMIN_PASSWORD` di `.env.local`
 * (lokal) dan di Environment Variables Vercel (produksi), lalu deploy ulang.
 *
 * Pesan gagal/berhasil dibaca dari query string (`?gagal=1`, `?keluar=1`) supaya
 * halaman ini bisa tetap server component tanpa state.
 */
export default async function MasukPage(props: PageProps<"/admin/masuk">) {
  if (await sudahMasuk()) redirect("/admin");

  const searchParams = await props.searchParams;
  const gagal = Boolean(searchParams.gagal);
  const keluar = Boolean(searchParams.keluar);
  const tujuan = typeof searchParams.tujuan === "string" ? searchParams.tujuan : "";

  return (
    <div className="grid min-h-dvh place-items-center bg-[#151310] px-4 py-12">
      <div className="w-full max-w-[420px]">
        <Link
          href="/"
          className="inline-flex min-h-6 items-center gap-2 text-[13px] font-semibold text-[#a2a2a6] transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke situs
        </Link>

        <div className="mt-5 rounded-3xl bg-white p-7 shadow-2xl">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#151310] text-[#c9a664]">
            <KeyRound className="size-5" aria-hidden="true" />
          </span>

          <h1 className="mt-5 text-[24px] font-extrabold tracking-[-0.02em]">Dashboard MODIGI</h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[#6f6f74]">
            Masukkan password admin untuk mengelola produk, kategori, pesanan, dan pembayaran.
          </p>

          {gagal ? (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-[#f7d7d3] bg-[#fdf4f3] px-4 py-3 text-[13.5px] font-medium text-[#a32b1d]"
            >
              Password salah. Coba lagi — huruf besar/kecil berpengaruh.
            </p>
          ) : null}

          {keluar ? (
            <p className="mt-5 rounded-xl border border-[#d3ecdc] bg-[#f2fbf5] px-4 py-3 text-[13.5px] font-medium text-[#186c3a]">
              Anda sudah keluar dari dashboard.
            </p>
          ) : null}

          <form action={masukAction} className="mt-6 flex flex-col gap-4">
            {tujuan ? <input type="hidden" name="tujuan" value={tujuan} /> : null}

            <Field label="Password admin" htmlFor="password" required>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                autoFocus
                required
              />
            </Field>

            <SubmitButton pendingLabel="Memeriksa…">Masuk</SubmitButton>
          </form>

          <p className="mt-5 flex items-start gap-2 text-[12.5px] leading-relaxed text-[#6f6f74]">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Sesi berlaku 12 jam dan disimpan di cookie httpOnly — bukan di alamat halaman.
          </p>
        </div>
      </div>
    </div>
  );
}
