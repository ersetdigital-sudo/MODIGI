import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { trendingProducts } from "@/data/products";
import { trendingSection } from "@/data/site";

import { TrustBar } from "./trust-bar";

export function TrendingProducts() {
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
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        <TrustBar className="mt-10" />
      </Container>
    </section>
  );
}
