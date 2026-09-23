import type { ReactNode } from "react";

import { LogOut } from "lucide-react";
import Link from "next/link";

import { keluarAction } from "@/app/actions/admin";
import { AdminNav } from "@/components/admin/admin-nav";

/**
 * Kerangka dashboard: sidebar gelap (desktop kiri, konten kanan).
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
      <div className="mx-auto flex max-w-[1500px] flex-col lg:flex-row">
        <aside className="shrink-0 bg-[#151310] px-4 py-5 lg:sticky lg:top-0 lg:h-screen lg:w-[252px] lg:px-4 lg:py-6">
          <div className="flex items-center justify-between gap-3 lg:block">
            <Link href="/admin" className="flex items-baseline gap-2">
              <span className="text-[17px] font-extrabold tracking-tight text-white">MODIGI</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold tracking-[0.14em] text-[#c9a664] uppercase">
                Admin
              </span>
            </Link>

            <Link
              href="/"
              className="inline-flex min-h-6 items-center text-[12px] font-semibold text-[#a2a2a6] underline underline-offset-2 lg:hidden"
            >
              Lihat situs
            </Link>
          </div>

          <div className="mt-5 lg:mt-7">
            <AdminNav lencanaPesanan={lencanaPesanan} />
          </div>

          <div className="mt-6 hidden border-t border-white/10 pt-4 lg:block">
            <p className="truncate text-[12px] text-[#a2a2a6]" title={akun}>
              {akun}
            </p>

            <form action={keluarAction} className="mt-2">
              <button
                type="submit"
                className="inline-flex min-h-6 items-center gap-2 text-[13px] font-semibold text-[#a2a2a6] transition-colors hover:text-white"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Keluar
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-16">
          <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            {children}

            <form action={keluarAction} className="mt-10 lg:hidden">
              <button
                type="submit"
                className="inline-flex min-h-6 items-center gap-2 text-[13px] font-semibold text-[#6f6f74] underline underline-offset-2"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Keluar dari {akun}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
