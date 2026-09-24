import type { Metadata } from "next";

import { simpanWhatsappAction } from "@/app/actions/admin";
import { ambilWhatsappNumber } from "@/lib/whatsapp";
import { ambilSupabase, supabaseSiap } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Pengaturan",
};

export default async function PengaturanPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const pesan = typeof searchParams.pesan === "string" ? searchParams.pesan : undefined;
  const galat = typeof searchParams.galat === "string" ? searchParams.galat : undefined;

  const whatsappNumber = await ambilWhatsappNumber();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-[-0.02em]">Pengaturan</h1>
        <p className="mt-1 text-[13.5px] text-[#6f6f74]">
          Atur nomor WhatsApp dan pengaturan lainnya.
        </p>
      </div>

      {pesan === "berhasil" && (
        <p className="rounded-xl border border-[#d4edda] bg-[#f0fdf4] px-4 py-3 text-[13.5px] font-medium text-[#155724]">
          Pengaturan berhasil disimpan.
        </p>
      )}

      {galat && (
        <p className="rounded-xl border border-[#f7d7d3] bg-[#fdf4f3] px-4 py-3 text-[13.5px] font-medium text-[#a32b1d]">
          Gagal menyimpan: {galat}
        </p>
      )}

      <div className="rounded-2xl border border-[#e8e8ec] bg-white p-6">
        <h2 className="text-[16px] font-bold">Nomor WhatsApp Toko</h2>
        <p className="mt-1 text-[13px] text-[#6f6f74]">
          Nomor ini dipakai di semua tombol &ldquo;Tanya via WhatsApp&rdquo; dan
          &ldquo;Beli Sekarang&rdquo; di seluruh situs. Format: 62xxxxxxxxxx (tanpa + dan
          spasi).
        </p>

        <form action={simpanWhatsappAction} className="mt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="whatsapp_number"
                className="mb-1.5 block text-[12.5px] font-semibold text-[#3a3a3f]"
              >
                Nomor WhatsApp
              </label>
              <input
                id="whatsapp_number"
                name="whatsapp_number"
                type="text"
                defaultValue={whatsappNumber}
                placeholder="6281234567890"
                className="w-full rounded-xl border border-[#d8d8de] bg-white px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-[#151310] focus:ring-2 focus:ring-[#151310]/10"
              />
              <p className="mt-1.5 text-[11.5px] text-[#6f6f74]">
                Contoh: 6281234567890 atau 08123456789 (otomatis dikonversi)
              </p>
            </div>

            <button
              type="submit"
              className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-[#151310] px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#2a2a2a] active:bg-[#3a3a3a]"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
