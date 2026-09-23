"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { productStatsCopy } from "@/data/store";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const tabs = [
  { id: "fitur", label: "Fitur" },
  { id: "deskripsi", label: "Deskripsi" },
  { id: "spesifikasi", label: "Spesifikasi" },
  { id: "faq", label: "FAQ" },
] as const;

type TabId = (typeof tabs)[number]["id"];

/**
 * Tab isi produk: Fitur, Deskripsi, Spesifikasi, FAQ.
 *
 * Semua panel tetap ada di DOM (disembunyikan dengan atribut `hidden`), jadi
 * isinya tetap terbaca mesin pencari walau tab-nya tidak diklik.
 */
export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<TabId>("fitur");

  // Baris versi dihitung dari data produk (bukan ditulis ulang di `specs`),
  // jadi versi & tanggal update tetap satu sumber: `data/products.ts`.
  const specs: [string, string][] = [
    [
      productStatsCopy.versionLabel,
      `v${product.version} · update ${product.updated}`,
    ],
    ...product.specs,
  ];

  return (
    <div className="mt-9">
      <div
        role="tablist"
        aria-label="Informasi produk"
        className="flex gap-7 overflow-x-auto border-b border-[var(--line)]"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={cn("tabbtn", active === tab.id && "is-active")}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-7">
        <section
          id="panel-fitur"
          role="tabpanel"
          aria-labelledby="tab-fitur"
          hidden={active !== "fitur"}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {product.highlights.map((highlight) => (
              <div key={highlight} className="card flex items-start gap-3 p-4">
                <span className="ico-wrap bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Check className="size-[18px]" strokeWidth={2.4} aria-hidden="true" />
                </span>
                <span className="pt-1 text-[14.5px] leading-snug">{highlight}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          id="panel-deskripsi"
          role="tabpanel"
          aria-labelledby="tab-deskripsi"
          hidden={active !== "deskripsi"}
        >
          <p className="max-w-2xl text-[15.5px] leading-relaxed text-[#3a352e]">
            {product.description}
          </p>
        </section>

        <section
          id="panel-spesifikasi"
          role="tabpanel"
          aria-labelledby="tab-spesifikasi"
          hidden={active !== "spesifikasi"}
        >
          <div className="card overflow-hidden">
            {specs.map(([label, value], index) => (
              <div
                key={label}
                className={cn(
                  "flex gap-4 px-5 py-4 text-[14px]",
                  index % 2 === 1 && "bg-[#fbf9f5]",
                )}
              >
                <span className="w-40 shrink-0 text-[var(--muted)]">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          id="panel-faq"
          role="tabpanel"
          aria-labelledby="tab-faq"
          hidden={active !== "faq"}
        >
          {product.faq.map(([question, answer], index) => (
            <details key={question} className="faq" open={index === 0}>
              <summary>{question}</summary>
              <p className="max-w-2xl pb-5 text-[15px] text-[var(--muted)]">{answer}</p>
            </details>
          ))}
        </section>
      </div>
    </div>
  );
}
