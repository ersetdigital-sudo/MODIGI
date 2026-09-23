import { CategoryShowcase } from "@/components/home/category-showcase";
import { CtaBanner } from "@/components/home/cta-banner";
import { HeroSection } from "@/components/home/hero-section";
import { PromoCarousel } from "@/components/home/promo-carousel";
import { PromoCodeBanner } from "@/components/home/promo-code-banner";
import { TrendingProducts } from "@/components/home/trending-products";
import { Container } from "@/components/ui/container";

/**
 * Halaman utama.
 * Urutan section ada di sini — atur/reorder cukup dengan memindahkan baris.
 * Dua section menyembunyikan dirinya sendiri di desktop: `PromoCarousel`
 * dan `PromoCodeBanner` (keduanya `lg:hidden`).
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/*
        Banner promo geser — sengaja di luar hero supaya hero tampil identik dengan
        desktop; di sini tetap mobile-only (`lg:hidden`).
      */}
      <section className="pt-6 lg:hidden">
        <Container>
          <PromoCarousel />
        </Container>
      </section>

      <CategoryShowcase />
      <PromoCodeBanner />
      <TrendingProducts />
      <CtaBanner />
    </>
  );
}
