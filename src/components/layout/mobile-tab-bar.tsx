"use client";

import { Boxes, Home, LayoutGrid, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

import { CartLink } from "@/components/cart/cart-link";
import { cn } from "@/lib/utils";

type Tab = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

/** Empat tab kiri-kanan FAB. Urutannya mengikuti wireframe mobile. */
const tabs: Tab[] = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Kategori", href: "/kategori", icon: LayoutGrid },
  { label: "Produk", href: "/produk", icon: Boxes },
  { label: "Akun", href: "/masuk", icon: User },
];

/**
 * Bottom tab bar + FAB keranjang — hanya tampil di layar < lg.
 *
 * Ini "shell" aplikasi versi mobile: konten halaman diberi padding bawah di
 * `layout.tsx` supaya bagian paling bawah tidak tertutup bar ini.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Navigasi cepat"
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
    >
      <div className="flex items-end justify-between rounded-t-2xl bg-white px-4 pb-5 pt-2 shadow-[0_-4px_6px_-1px_rgb(0_0_0_/_0.05),0_-2px_4px_-1px_rgb(0_0_0_/_0.03)]">
        <TabButton tab={tabs[0]} active={isActive(tabs[0].href)} />

        <TabButton tab={tabs[1]} active={isActive(tabs[1].href)} />

        <div className="relative -top-4">
          <CartLink variant="fab" />
        </div>

        <TabButton tab={tabs[2]} active={isActive(tabs[2].href)} />

        <TabButton tab={tabs[3]} active={isActive(tabs[3].href)} />
      </div>
    </nav>
  );
}

function TabButton({ tab, active }: { tab: Tab; active: boolean }) {
  const Icon = tab.icon;

  return (
    <Link
      href={tab.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-w-14 flex-col items-center gap-1 rounded-lg py-1 text-[10px] transition-colors focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:outline-none",
        active ? "font-bold text-ink" : "font-medium text-muted hover:text-ink",
      )}
    >
      <Icon className="size-6" strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
      <span>{tab.label}</span>
    </Link>
  );
}
