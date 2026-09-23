import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, LifeBuoy, X } from "lucide-react";

import { WhatsappIcon } from "@/components/store/whatsapp-icon";
import {
  activationSection,
  contactChannels,
  contactSection,
  guaranteeSection,
  orderSection,
  quickOrderSteps,
  supportFaq,
  supportHero,
  supportTopics,
  updateSection,
} from "@/data/support";
import { orderSteps, paymentNote, productStatsCopy } from "@/data/store";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  // `absolute`: judul SEO lengkap tanpa dobel brand dari template root layout.
  title: { absolute: "Pusat Bantuan — Cara Order, Aktivasi & Garansi | MODIGI" },
  description:
    "Pusat bantuan MODIGI: cara order lewat WhatsApp, aktivasi lisensi ke domain Anda, update dari dashboard WordPress, dan garansi uang kembali 100%.",
};

const sectionTitle =
  "text-[24px] font-extrabold tracking-[-0.02em] md:text-[30px]";
const sectionLead = "mt-2.5 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]";

/**
 * Halaman Support (/bantuan).
 *
 * Urutan section mengikuti pertanyaan pembeli setelah membayar: cara order →
 * aktivasi → update → garansi → FAQ → kontak. Tiap section punya `id` yang
 * dipakai juga oleh link di footer (`/bantuan#aktivasi`, dst), dan semua section
 * diberi `scroll-mt` supaya judulnya tidak tertutup header yang menempel.
 */
export default function SupportPage() {
  return (
    <div className="pb-20">
      <div className="mx-auto max-w-6xl px-5">
        <nav aria-label="Breadcrumb" className="pt-8 text-[13px] text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--ink)]">
            Beranda
          </Link>{" "}
          /{" "}
          <Link href="/produk" className="hover:text-[var(--ink)]">
            Katalog
          </Link>{" "}
          / <span className="font-semibold text-[var(--ink)]">{supportHero.breadcrumb}</span>
        </nav>

        <header className="mt-5 max-w-3xl">
          <span className="kicker block">{supportHero.eyebrow}</span>
          <h1 className="mt-2.5 text-[30px] font-extrabold leading-[1.1] tracking-[-0.03em] text-balance md:text-[42px]">
            {supportHero.title}
          </h1>
          <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--muted)]">
            {supportHero.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              className="btn btn-wa"
              href={whatsappLink(supportHero.primary.message)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsappIcon className="size-[18px]" />
              {supportHero.primary.label}
            </a>

            <Link className="btn btn-ghost" href={supportHero.secondary.href}>
              {supportHero.secondary.label}
            </Link>
          </div>
        </header>

        {/* Bantuan cepat — sekaligus navigasi ke tiap section. */}
        <nav aria-label="Bantuan cepat" className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {supportTopics.map(({ anchor, title, description, icon: Icon }) => (
            <a
              key={anchor}
              href={`#${anchor}`}
              className="card group flex h-full flex-col p-5 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span className="ico-wrap bg-[var(--accent-soft)] text-[var(--accent)]">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <span className="mt-3.5 text-[15px] font-bold">{title}</span>
              <span className="mt-1 text-[13.5px] leading-relaxed text-[var(--muted)]">
                {description}
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 pt-1 text-[13px] font-bold text-[var(--accent)]">
                Baca
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </a>
          ))}
        </nav>

        {/* 1. Cara order */}
        <section id="cara-order" className="mt-14 scroll-mt-24">
          <h2 className={sectionTitle}>{orderSection.title}</h2>
          <p className={sectionLead}>{orderSection.description}</p>

          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {orderSteps.map(({ icon: Icon, title, description }, index) => (
              <li key={title} className="card p-5">
                <span className="grid size-10 place-items-center rounded-2xl bg-[var(--ink)] text-white">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[11px] font-bold tracking-[0.14em] text-[var(--muted)]">
                  LANGKAH {index + 1}
                </p>
                <p className="mt-1 text-[15.5px] font-bold">{title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--muted)]">
                  {description}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-4 flex items-start gap-2.5 text-[13px] leading-relaxed text-[var(--muted)]">
            <LifeBuoy className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {paymentNote} Belum yakin produk mana yang pas? Tanya dulu — tidak ada kewajiban membeli.
          </p>
        </section>

        {/* 2. Aktivasi */}
        <section id="aktivasi" className="mt-14 scroll-mt-24">
          <h2 className={sectionTitle}>{activationSection.title}</h2>
          <p className={sectionLead}>{activationSection.description}</p>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <ul className="card p-5 sm:p-6">
              {activationSection.received.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="ico-wrap shrink-0 bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Check className="size-4" strokeWidth={2.6} aria-hidden="true" />
                  </span>
                  <span className="pt-0.5 text-[14.5px] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              {activationSection.notes.map(({ title, description }) => (
                <div key={title} className="card p-5">
                  <p className="text-[14.5px] font-bold">{title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[var(--muted)]">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Update */}
        <section id="update" className="mt-14 scroll-mt-24">
          <h2 className={sectionTitle}>{updateSection.title}</h2>
          <p className={sectionLead}>{updateSection.description}</p>

          <ul className="card mt-6 p-5 sm:p-6">
            {updateSection.facts.map((fact) => (
              <li key={fact} className="flex items-start gap-3 border-b border-[var(--line)] py-3 last:border-b-0 last:pb-0 first:pt-0">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-[var(--accent)]"
                  strokeWidth={2.6}
                  aria-hidden="true"
                />
                <span className="text-[14.5px] leading-relaxed">{fact}</span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-[13px] text-[var(--muted)]">
            Versi terbaru selalu ada di baris “{productStatsCopy.versionLabel}” pada tab
            Spesifikasi di setiap halaman produk.
          </p>
        </section>

        {/* 4. Garansi */}
        <section id="garansi" className="mt-14 scroll-mt-24">
          <h2 className={sectionTitle}>{guaranteeSection.title}</h2>
          <p className={sectionLead}>{guaranteeSection.description}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="card p-5 sm:p-6">
              <h3 className="text-[15px] font-bold text-[var(--accent)]">Ditanggung</h3>
              <ul className="mt-3 space-y-2.5">
                {guaranteeSection.covered.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[var(--accent)]"
                      strokeWidth={2.6}
                      aria-hidden="true"
                    />
                    <span className="text-[14px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5 sm:p-6">
              <h3 className="text-[15px] font-bold text-[var(--muted)]">Tidak ditanggung</h3>
              <ul className="mt-3 space-y-2.5">
                {guaranteeSection.notCovered.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <X
                      className="mt-0.5 size-4 shrink-0 text-[var(--muted)]"
                      strokeWidth={2.6}
                      aria-hidden="true"
                    />
                    <span className="text-[14px] leading-relaxed text-[var(--muted)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 5. FAQ */}
        <section id="faq" className="mt-14 scroll-mt-24">
          <h2 className={sectionTitle}>Pertanyaan yang sering muncul</h2>

          <div className="mt-6">
            {supportFaq.map(([question, answer], index) => (
              <details key={question} className="faq" open={index === 0}>
                <summary>{question}</summary>
                <p className="max-w-2xl pb-5 text-[14.5px] leading-relaxed text-[var(--muted)]">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 6. Kontak */}
        <section id="kontak" className="mt-14 scroll-mt-24">
          <div className="card p-6 sm:p-8">
            <h2 className={sectionTitle}>{contactSection.title}</h2>
            <p className={sectionLead}>{contactSection.description}</p>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {contactChannels.map(({ label, value, note, icon: Icon, href, message }) => {
                  const inner = (
                    <>
                      <span className="ico-wrap bg-[var(--accent-soft)] text-[var(--accent)]">
                        <Icon className="size-[18px]" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                          {label}
                        </span>
                        <span className="mt-0.5 block text-[14.5px] font-bold break-words">
                          {value}
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-relaxed text-[var(--muted)]">
                          {note}
                        </span>
                      </span>
                    </>
                  );

                  const className =
                    "flex items-start gap-3 rounded-2xl border border-[var(--line)] p-4 transition hover:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:outline-none";

                  if (message) {
                    return (
                      <li key={label}>
                        <a
                          className={className}
                          href={whatsappLink(message)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {inner}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={label}>
                      {href ? (
                        <a className={className} href={href}>
                          {inner}
                        </a>
                      ) : (
                        <div className={className}>{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="rounded-2xl bg-[#fbf9f5] p-5 ring-1 ring-[var(--line)]">
                <p className="text-[14.5px] font-bold">Supaya langsung ditangani</p>
                <ol className="mt-3 space-y-2.5">
                  {contactSection.prepare.map((item, index) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="tabular mt-px grid size-5 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-[11px] font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="text-[14px] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ol>

                <div className="divider my-5" />

                <ul className="space-y-2.5">
                  {quickOrderSteps.map(({ icon: Icon, title, description }) => (
                    <li key={title} className="flex items-start gap-2.5">
                      <Icon className="mt-0.5 size-4 shrink-0 text-[var(--muted)]" aria-hidden="true" />
                      <span className="text-[13px] leading-relaxed text-[var(--muted)]">
                        <span className="font-bold text-[var(--ink)]">{title}</span> — {description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
