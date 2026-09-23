import { LayoutGrid } from "lucide-react";
import Link from "next/link";

import { CategoryCard } from "@/components/ui/category-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories } from "@/data/categories";

export function CategoryShowcase() {
  return (
    <section className="pt-8 pb-4 lg:py-16">
      <Container>
        <SectionHeading
          eyebrow="Kategori"
          title="Jelajahi Produk Sesuai Kebutuhan Anda"
          action={{ label: "Lihat Semua Kategori", href: "/kategori" }}
          // Di mobile pilihan "semua" sudah ada sebagai tile pertama di baris geser.
          actionClassName="hidden lg:inline-flex"
        />

        <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-8 lg:grid lg:grid-cols-7 lg:gap-3 lg:overflow-visible lg:pb-0 xl:gap-4">
          <AllCategoriesTile />

          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/** Tile "Semua" — hanya di mobile, menggantikan link "Lihat Semua Kategori". */
function AllCategoriesTile() {
  return (
    <Link
      href="/kategori"
      className="flex min-w-[60px] shrink-0 flex-col items-center gap-1.5 rounded-2xl text-center transition focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none lg:hidden"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink text-gold shadow-card">
        <LayoutGrid className="size-5" aria-hidden="true" />
      </span>
      <span className="text-[10px] font-bold leading-tight text-ink">Semua</span>
    </Link>
  );
}
