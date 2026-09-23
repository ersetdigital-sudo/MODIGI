import {
  ChartColumn,
  LayoutTemplate,
  Palette,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Zap,
} from "lucide-react";

import type { Category } from "@/types";

/** Kategori produk. Tambah/ubah di sini; kartu kategori mengikuti otomatis. */
export const categories: Category[] = [
  {
    slug: "page-builder",
    name: "Page Builder",
    description: "Buat website dengan mudah",
    icon: LayoutTemplate,
  },
  {
    slug: "seo-tools",
    name: "SEO Tools",
    description: "Optimasi dan tingkatkan trafik",
    icon: ChartColumn,
  },
  {
    slug: "performance",
    name: "Performance",
    description: "Website lebih cepat dan stabil",
    icon: Zap,
  },
  {
    slug: "security",
    name: "Security",
    description: "Lindungi website dari ancaman",
    icon: ShieldCheck,
  },
  {
    slug: "woocommerce",
    name: "WooCommerce",
    description: "Solusi toko online profesional",
    icon: ShoppingBag,
  },
  {
    slug: "tema",
    name: "Tema",
    description: "Desain terbaik untuk website",
    icon: Palette,
  },
  {
    slug: "utility",
    name: "Utility",
    description: "Tools pendukung untuk produktivitas",
    icon: Settings,
  },
];

/** Cari kategori berdasarkan slug — dipakai di halaman katalog. */
export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

/** Ambil nama kategori dari slug produk (fallback: slug-nya sendiri). */
export function getCategoryName(slug: string) {
  return getCategory(slug)?.name ?? slug;
}
