import { CategoryShowcase } from "@/components/home/category-showcase";
import { CtaBanner } from "@/components/home/cta-banner";
import { HeroSection } from "@/components/home/hero-section";
import { TrendingProducts } from "@/components/home/trending-products";

/**
 * Halaman utama.
 * Urutan section ada di sini — atur/reorder cukup dengan memindahkan baris.
 * Section yang tampil berbeda antar breakpoint menangani sendiri di dalam
 * komponennya (mis. hero memakai `lg:*`), jadi daftar di sini tetap ringkas.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryShowcase />
      <TrendingProducts />
      <CtaBanner />
    </>
  );
}
