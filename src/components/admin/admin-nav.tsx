"use client";

import { Boxes, ExternalLink, FolderTree, LayoutDashboard, Receipt, ShoppingCart } from "lucide-react";
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
 * Menu sidebar dashboard.
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
  ];

  const aktif = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav aria-label="Menu dashboard" className="flex flex-col gap-1">
      {menu.map(({ label, href, icon: Icon, lencana }) => {
        const ini = aktif(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={ini ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-colors",
              ini ? "bg-white text-[#151310] shadow-sm" : "text-[#a2a2a6] hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="size-[18px] shrink-0" aria-hidden="true" />
            <span className="flex-1">{label}</span>

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
        className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-[#a2a2a6] transition-colors hover:bg-white/5 hover:text-white"
      >
        <ExternalLink className="size-[18px] shrink-0" aria-hidden="true" />
        Lihat situs
      </Link>

      <span className="mt-3 flex items-center gap-3 px-3 text-[13px] text-[#6f6f74]">
        <Receipt className="size-[18px] shrink-0" aria-hidden="true" />
        Pembayaran dicatat per pesanan
      </span>
    </nav>
  );
}
