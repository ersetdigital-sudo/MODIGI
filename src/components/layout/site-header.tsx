"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CartLink } from "@/components/cart/cart-link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { SearchForm } from "@/components/ui/search-form";
import { mainNav } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenu = () => setMobileOpen(false);

  // Cegah halaman ikut ter-scroll saat panel mobile terbuka.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-ink/95 backdrop-blur lg:border-line-dark">
      <HeaderWave />

      <Container className="flex h-16 items-center gap-4 lg:h-[72px] lg:gap-8">
        <Link href="/" aria-label={siteConfig.name} onClick={closeMenu}>
          <Logo />
        </Link>

        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      className="size-3.5 opacity-60 transition-transform group-hover:rotate-180"
                      aria-hidden="true"
                    />
                  )}
                </Link>

                {item.children && (
                  <div className="invisible absolute left-0 top-full z-50 w-72 translate-y-1 rounded-xl border border-line-dark bg-ink-800 p-2 opacity-0 shadow-lift transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 transition-colors hover:bg-white/5"
                      >
                        <span className="block text-sm font-semibold text-white">
                          {child.label}
                        </span>
                        {child.description && (
                          <span className="mt-0.5 block text-xs text-muted-dark">
                            {child.description}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          <SearchForm id="header-search" variant="header" className="hidden md:flex" />

          {/* Di mobile keranjang dipindah ke FAB di bottom tab bar.
              Jumlahnya datang dari state keranjang asli (`CartLink`). */}
          <CartLink />

          <ButtonLink href="/masuk" size="sm" className="hidden sm:inline-flex">
            Masuk
          </ButtonLink>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            className="grid size-10 place-items-center rounded-lg text-white transition-colors hover:bg-white/5 lg:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <div id="mobile-nav" className="border-t border-line-dark bg-ink lg:hidden">
          <Container className="space-y-6 py-6">
            <SearchForm id="mobile-search" variant="header" className="max-w-none" />

            <nav aria-label="Navigasi mobile">
              <ul className="space-y-4">
                {mainNav.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="block text-sm font-bold text-white"
                    >
                      {item.label}
                    </Link>

                    {item.children && (
                      <ul className="mt-2 space-y-1 border-l border-line-dark pl-3">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              onClick={closeMenu}
                              className="block py-1 text-sm text-muted-dark transition-colors hover:text-gold"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <ButtonLink href="/masuk" onClick={closeMenu} className="w-full">
              Masuk
            </ButtonLink>
          </Container>
        </div>
      )}
    </header>
  );
}

/**
 * Pembatas gelombang di bawah header — hanya di mobile, mengikuti wireframe.
 * Warnanya sama dengan latar halaman (cream), jadi tepi bawah header terlihat berombak
 * tanpa perlu elemen pemisah tambahan.
 */
function HeaderWave() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 top-full h-4 w-full fill-cream lg:hidden"
    >
      <path d="M0,50 C320,150 420,-50 1440,50 L1440,100 L0,100 Z" />
    </svg>
  );
}
