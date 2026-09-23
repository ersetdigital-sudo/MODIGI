import { CategoryShowcase } from "@/components/home/category-showcase";
import { CtaBanner } from "@/components/home/cta-banner";
import { HeroSection } from "@/components/home/hero-section";
import { PromoCodeBanner } from "@/components/home/promo-code-banner";
import { TrendingProducts } from "@/components/home/trending-products";

/**
 * Halaman utama.
 * Urutan section ada di sini — atur/reorder cukup dengan memindahkan baris.
 * `PromoCodeBanner` menyembunyikan dirinya sendiri di desktop (`lg:hidden`).
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryShowcase />
      <PromoCodeBanner />
      <TrendingProducts />
      <CtaBanner />
    </>
  );
}
