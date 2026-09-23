import Link from "next/link";

import { storeFooterNote } from "@/data/store";
import { siteConfig } from "@/data/site";

/** Footer ringkas halaman katalog & detail produk (gaya template). */
export function StoreFooter() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-[13px] text-[var(--muted)] md:flex-row">
        <Link href="/" className="font-bold text-[var(--ink)]">
          {siteConfig.name}
        </Link>
        <p>
          © {new Date().getFullYear()} {siteConfig.name} · {storeFooterNote}
        </p>
      </div>
    </footer>
  );
}
