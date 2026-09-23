import type { ReactNode } from "react";

import { LogOut } from "lucide-react";
import Link from "next/link";

import { keluarAction } from "@/app/actions/admin";
import { AdminNav } from "@/components/admin/admin-nav";

/**
 * Kerangka dashboard.
 *
 * Tata letaknya sengaja sederhana supaya tetap benar di semua lebar:
 * - **Sidebar menempel di tepi kiri** dan setinggi layar (desktop). Tidak ada
 *   pembungkus ber-`max-width` di sekelilingnya — kalau ada, sidebar-nya "mengambang"
 *   dengan celah kosong di kiri pada layar ≥1500px.
 * - **Lebar konten dibatasi di dalam `<main>`**, bukan di seluruh halaman, jadi
 *   kartu & formulir tetap enak dibaca di monitor lebar sementara sidebar tetap
 *   menempel di tepi.
 * - **Di layar kecil** sidebar jadi header ringkas: nama brand + baris menu yang
 *   bisa digeser ke samping (pola yang sama dengan chip kategori di situs depan).
 *
 * Tombol "Keluar" memakai `<form action={...}>` server action — jadi logout tetap
 * jalan walau JavaScript belum sempat termuat.
 */
export function AdminShell({
  children,
  akun,
  lencanaPesanan,
}: {
  children: ReactNode;
  /** Label akun yang sedang masuk, mis. "Admin MODIGI". */
  akun: string;
  lencanaPesanan: number;
}) {
  return (
    <div className="min-h-dvh bg-[#f5f5f7] text-[#151310]">
      <div className="flex min-h-dvh flex-col lg:flex-row">
        <aside className="shrink-0 bg-[#151310] px-4 py-4 lg:sticky lg:top-0 lg:h-dvh lg:w-[252px] lg:self-start lg:px-4 lg:py-6">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin" className="flex items-baseline gap-2">
              <span className="text-[17px] font-extrabold tracking-tight text-white">MODIGI</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold tracking-[0.14em] text-[#c9a664] uppercase">
                Admin
              </span>
            </Link>

            <Link
              href="/"
              className="inline-flex min-h-6 items-center text-[12px] font-semibold text-[#c9c9ce] underline underline-offset-2 lg:hidden"
            >
              Lihat situs
            </Link>
          </div>

          <div className="mt-4 lg:mt-7">
            <AdminNav lencanaPesanan={lencanaPesanan} />
          </div>

          <div className="mt-6 hidden border-t border-white/10 pt-4 lg:block">
            <p className="truncate text-[12px] text-[#c9c9ce]" title={akun}>
              {akun}
            </p>

            <form action={keluarAction} className="mt-2">
              <button
                type="submit"
                className="inline-flex min-h-6 items-center gap-2 text-[13px] font-semibold text-[#c9c9ce] transition-colors hover:text-white"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Keluar
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1240px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            {children}

            <form action={keluarAction} className="mt-10 lg:hidden">
              <button
                type="submit"
                className="inline-flex min-h-6 items-center gap-2 text-[13px] font-semibold text-[#6f6f74] underline underline-offset-2"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Keluar dari {akun.toLowerCase()}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
