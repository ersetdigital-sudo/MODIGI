"use client";

import {
  Boxes,
  ExternalLink,
  FolderTree,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

type Menu = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  /** Angka di kanan menu (mis. jumlah pesanan baru). */
  lencana?: number;
};

/**
 * Menu dashboard.
 *
 * Dua bentuk dari satu daftar yang sama:
 * - **< lg**: baris geser horizontal di bawah nama brand — hemat tinggi layar,
 *   pola yang sama dengan chip kategori di situs depan.
 * - **≥ lg**: kolom vertikal di sidebar.
 *
 * Satu komponen klien kecil hanya untuk menandai halaman aktif (`usePathname`) —
 * sisanya tetap server component, jadi data tidak ikut dikirim ke browser.
 */
export function AdminNav({ lencanaPesanan }: { lencanaPesanan: number }) {
  const pathname = usePathname();

  const menu: Menu[] = [
    { label: "Dasbor", href: "/admin", icon: LayoutDashboard },
    { label: "Produk", href: "/admin/produk", icon: Boxes },
    { label: "Kategori", href: "/admin/kategori", icon: FolderTree },
    { label: "Pesanan", href: "/admin/pesanan", icon: ShoppingCart, lencana: lencanaPesanan },
    { label: "Pembayaran", href: "/admin/pembayaran", icon: Wallet },
    { label: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
  ];

  const aktif = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Menu dashboard"
      className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {menu.map(({ label, href, icon: Icon, lencana }) => {
        const ini = aktif(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={ini ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-semibold whitespace-nowrap transition-colors lg:gap-3",
              ini ? "bg-white text-[#151310] shadow-sm" : "text-[#c9c9ce] hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="size-[18px] shrink-0" aria-hidden="true" />
            <span>{label}</span>

            {lencana ? (
              <span className="tabular grid min-w-5 place-items-center rounded-full bg-[#c9a664] px-1.5 text-[11px] font-bold text-[#151310]">
                {lencana > 99 ? "99+" : lencana}
              </span>
            ) : null}
          </Link>
        );
      })}

      <Link
        href="/"
        className="hidden min-h-6 items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-[#c9c9ce] transition-colors hover:bg-white/5 hover:text-white lg:mt-1 lg:flex"
      >
        <ExternalLink className="size-[18px] shrink-0" aria-hidden="true" />
        Lihat situs
      </Link>
    </nav>
  );
}
