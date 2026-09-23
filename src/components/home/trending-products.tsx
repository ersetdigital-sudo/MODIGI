import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { trendingSection } from "@/data/site";
import { ambilKategori, ambilProduk } from "@/lib/catalog";

import { TrustBar } from "./trust-bar";

/**
 * Section "Produk Terlaris" di beranda.
 *
 * Lima produk teratas diambil dari database (urut jumlah lisensi terjual), jadi
 * begitu admin menambah produk atau mengubah angka "terjual", urutannya ikut
 * berubah tanpa perlu deploy.
 */
export async function TrendingProducts() {
  const [semuaProduk, kategori] = await Promise.all([ambilProduk(), ambilKategori()]);
  const namaKategori = new Map(kategori.map((item) => [item.slug, item.name]));
  const trendingProducts = semuaProduk.slice(0, 5);

  return (
    <section className="pb-14 lg:pb-16">
      <Container>
        <SectionHeading
          eyebrow={trendingSection.eyebrow}
          title={trendingSection.title}
          action={trendingSection.action}
        />

        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:mt-8 lg:grid-cols-5">
          {trendingProducts.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              categoryName={namaKategori.get(product.categorySlug)}
            />
          ))}
        </div>

        <TrustBar className="mt-10" />
      </Container>
    </section>
  );
}
