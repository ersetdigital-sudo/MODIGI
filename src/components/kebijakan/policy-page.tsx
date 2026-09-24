import Link from "next/link";
import { CalendarDays, Check, ChevronDown, Clock3, Sparkles } from "lucide-react";

import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { policies } from "@/data/policies";
import { contactChannels } from "@/data/support";
import { ambilWhatsappNumber, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { PolicyDoc, PolicySection } from "@/types";

/**
 * Shell untuk seluruh dokumen kebijakan.
 *
 * Semua dokumen memakai satu kerangka yang sama supaya tidak ada empat halaman
 * yang harus dijaga terpisah: hero gelap berisi judul + tanggal revisi, kolom
 * kiri berisi navigasi (pindah dokumen & lompat ke bagian), kolom kanan berisi
 * ringkasan singkat lalu isinya.
 *
 * Catatan tata letak & aksesibilitas yang dipegang di sini:
 * - `scroll-mt-24` di setiap section: judulnya tidak tertutup header yang menempel.
 * - Lebar baris isi dibatasi (`max-w-[68ch]`) supaya teks panjang tetap enak dibaca.
 * - Nomor bagian dipakai di daftar isi dan di judul, jadi orang bisa bilang
 *   "lihat bagian 4" tanpa harus mengutip seluruh kalimatnya.
 */
export async function PolicyPage({ doc }: { doc: PolicyDoc }) {
  const waNumber = await ambilWhatsappNumber();
  return (
    <div className="pb-20">
      <PolicyHero doc={doc} />

      <Container className="mt-8 lg:mt-12">
        <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:items-start lg:gap-12">
          <aside className="lg:sticky lg:top-24 print:hidden">
            <PolicyNav currentSlug={doc.slug} />
            <PolicyToc doc={doc} />
          </aside>

          <div className="mt-7 min-w-0 lg:mt-0">
            <PolicySummary items={doc.tldr} />
            <PolicyToc doc={doc} variant="mobile" />

            <div className="mt-8">
              {doc.sections.map((section, index) => (
                <PolicySection key={section.id} section={section} number={index + 1} />
              ))}
            </div>

            <PolicyHelpCard />
          </div>
        </div>
      </Container>
    </div>
  );
}

/** Hero: breadcrumb, judul, ringkasan halaman, dan tanggal revisi. */
function PolicyHero({ doc }: { doc: PolicyDoc }) {
  return (
    <header className="relative overflow-hidden bg-ink text-white">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_85%_0%,rgba(201,166,100,0.22),transparent_70%)]"
      />

      <Container className="relative py-12 sm:py-16 lg:py-20">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 text-[13px] text-muted-dark">
          <Link href="/" className="transition-colors hover:text-white">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span>Kebijakan</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-semibold text-white">
            {doc.navLabel}
          </span>
        </nav>

        <Eyebrow tone="onDark" className="mt-6">
          {doc.eyebrow}
        </Eyebrow>

        <h1 className="mt-3.5 max-w-3xl text-[29px] font-extrabold leading-[1.1] tracking-[-0.03em] text-balance sm:text-[40px] lg:text-[48px]">
          {doc.title}
        </h1>

        <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-muted-dark">
          {doc.description}
        </p>

        <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-dark">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-gold" aria-hidden="true" />
            Terakhir diperbarui {doc.updated}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="size-4 shrink-0 text-gold" aria-hidden="true" />
            Sekitar {doc.readMinutes} menit baca
          </span>
        </p>
      </Container>
    </header>
  );
}

/**
 * Pindah antar dokumen kebijakan.
 * Mobile: baris chip yang bisa digeser. Desktop: daftar vertikal.
 * Dokumen yang sedang dibuka ditandai `aria-current="page"`.
 */
function PolicyNav({ currentSlug }: { currentSlug: string }) {
  return (
    <>
      <nav aria-label="Dokumen kebijakan" className="lg:hidden">
        <ul className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {policies.map((item) => {
            const Icon = item.icon;
            const active = item.slug === currentSlug;

            return (
              <li key={item.slug} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:outline-none",
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-white text-muted hover:border-ink hover:text-ink",
                  )}
                >
                  <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                  {item.navLabel}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav aria-labelledby="daftar-dokumen" className="hidden lg:block">
        <h2
          id="daftar-dokumen"
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted"
        >
          Dokumen
        </h2>

        <ul className="mt-3 space-y-1">
          {policies.map((item) => {
            const Icon = item.icon;
            const active = item.slug === currentSlug;

            return (
              <li key={item.slug}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:outline-none",
                    active
                      ? "bg-ink text-white"
                      : "text-muted hover:bg-cream-200 hover:text-ink",
                  )}
                >
                  <Icon
                    className={cn("size-4 shrink-0", active ? "text-gold" : "text-gold-deep")}
                    aria-hidden="true"
                  />
                  {item.navLabel}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

/**
 * Daftar isi halaman.
 * Desktop: daftar menempel di kolom kiri. Mobile: lipatan (`<details>`) supaya
 * tidak memakan layar — jalan tanpa JavaScript.
 */
function PolicyToc({ doc, variant = "sidebar" }: { doc: PolicyDoc; variant?: "sidebar" | "mobile" }) {
  const links = (
    <ol className={variant === "mobile" ? "mt-3 space-y-0.5" : "mt-3 space-y-0.5 border-l border-line"}>
      {doc.sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className={cn(
              "flex gap-2 rounded-lg py-1.5 text-[13.5px] leading-snug text-muted transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:outline-none",
              variant === "mobile"
                ? "px-2 hover:bg-cream-200"
                : "-ml-px border-l-2 border-transparent pl-3 hover:border-gold",
            )}
          >
            <span className="tabular-nums text-[11px] font-bold text-gold-ink">
              {String(index + 1).padStart(2, "0")}
            </span>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );

  if (variant === "mobile") {
    return (
      <details className="mt-4 rounded-xl border border-line bg-white p-4 lg:hidden print:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-ink [&::-webkit-details-marker]:hidden">
          Daftar isi ({doc.sections.length} bagian)
          <ChevronDown className="size-4 shrink-0 text-muted" aria-hidden="true" />
        </summary>
        {links}
      </details>
    );
  }

  return (
    <nav aria-labelledby="daftar-isi" className="mt-8 hidden lg:block">
      <h2 id="daftar-isi" className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
        Isi halaman
      </h2>
      {links}
    </nav>
  );
}

/** Ringkasan tiga poin untuk yang cuma mau baca sekilas. */
function PolicySummary({ items }: { items: string[] }) {
  return (
    <div className="rounded-2xl border border-sand bg-white p-5 shadow-card">
      <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-ink">
        <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
        Ringkasnya
      </h2>

      <ul className="mt-3.5 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[14.5px] leading-relaxed text-ink">
            <Check className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 border-t border-line pt-3 text-[13px] text-muted">
        Tiga poin itu inti halamannya. Sisanya detail yang membuat semuanya jelas.
      </p>
    </div>
  );
}

/** Satu bagian dokumen: nomor, judul, paragraf, poin, dan catatan. */
function PolicySection({ section, number }: { section: PolicySection; number: number }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-judul`}
      className="scroll-mt-24 border-t border-line pt-8 first:border-t-0 first:pt-0"
    >
      <h2
        id={`${section.id}-judul`}
        className="flex gap-3 text-[20px] font-extrabold leading-snug tracking-[-0.01em] text-ink sm:text-[23px]"
      >
        <span className="tabular-nums text-[13px] font-bold text-gold-ink sm:text-[15px]">
          {String(number).padStart(2, "0")}
        </span>
        {section.title}
      </h2>

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="mt-3.5 max-w-[68ch] text-[15.5px] leading-relaxed text-muted">
          {paragraph}
        </p>
      ))}

      {section.bullets && (
        <ul className="mt-4 space-y-2.5">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex max-w-[68ch] gap-3 text-[15.5px] leading-relaxed text-muted">
              <Check className="mt-1 size-4 shrink-0 text-gold-deep" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {section.note && (
        <p className="mt-4 max-w-[68ch] rounded-xl border border-sand bg-cream-200 px-4 py-3 text-[14.5px] leading-relaxed text-ink">
          <strong className="font-bold">Catatan: </strong>
          {section.note}
        </p>
      )}
    </section>
  );
}

/** Penutup: satu jalur bantuan untuk semua dokumen (posisinya selalu sama). */
async function PolicyHelpCard() {
  const waNumber = await ambilWhatsappNumber();
  const whatsapp = contactChannels[0];
  const email = contactChannels[1];

  return (
    <section aria-labelledby="butuh-bantuan" className="mt-12 rounded-2xl bg-ink p-6 text-white sm:p-8">
      <h2
        id="butuh-bantuan"
        className="text-[20px] font-extrabold tracking-[-0.01em] text-balance sm:text-[24px]"
      >
        Masih ada bagian yang belum jelas?
      </h2>

      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-dark">
        Tanya saja. Pertanyaan soal aturan, garansi, atau lisensi selalu kami jawab gratis di
        WhatsApp, setiap hari pukul 08.00–22.00 WIB.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={whatsappLink(whatsapp.message ?? "Halo, saya mau tanya soal aturan di MODIGI.", waNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass({ variant: "gold", size: "lg" })}
        >
          Chat admin sekarang
        </a>

        <a
          href={email.href}
          className="text-[14px] font-semibold text-muted-dark underline decoration-line-dark underline-offset-4 transition-colors hover:text-white"
        >
          atau kirim email ke {email.value}
        </a>
      </div>
    </section>
  );
}
