import type { ReactNode } from "react";

import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

/**
 * Layout halaman utama MODIGI: header gelap + footer lengkap + tab bar mobile.
 *
 * Padding bawah `pb-[86px]` memberi ruang untuk tab bar yang menempel di bawah
 * (diukur: tinggi bar 84px) supaya isi paling bawah tidak tertutup.
 */
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col pb-[86px] lg:pb-0">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}
