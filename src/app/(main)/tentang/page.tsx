import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import {
  aboutCta,
  aboutHero,
  aboutPrinciples,
  aboutProcess,
  aboutStats,
  aboutStory,
  aboutValues,
} from "@/data/about";
import { siteConfig } from "@/data/site";
import { ambilWhatsappNumber, whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  // `absolute` dipakai supaya judul tidak dobel brand (root layout menambah
  // "| MODIGI" untuk judul biasa).
  title: { absolute: `Tentang ${siteConfig.name} — Lisensi Original, Harga Transparan` },
  description:
    "MODIGI menyediakan plugin, tema, dan tools digital original dengan harga rupiah yang jelas. Aktivasi instan, update dari dashboard, garansi 100%.",
};

/**
 * Halaman Tentang (MODIGI).
 *
 * Urutan section mengikuti alur berpikir pembaca: janji singkat (hero) → kenapa
 * kami ada (cerita) → apa yang Anda dapatkan (keunggulan) → cara kerja (proses)
 * → bisa dipercaya dari mana (prinsip) → ajakan.
 *
 * Semua teksnya di `src/data/about.ts`, jadi edit copy tidak perlu menyentuh JSX.
 */
export default async function TentangPage() {
  const waNumber = await ambilWhatsappNumber();
  return (
    <>
      {/* Hero — panel gelap, sejalan dengan beranda. */}
      <section className="relative overflow-hidden bg-ink text-white">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_85%_0%,rgba(201,166,100,0.22),transparent_70%)]"
        />

        <Container className="relative py-14 sm:py-18 lg:py-24">
          <Eyebrow tone="onDark">{aboutHero.eyebrow}</Eyebrow>

          <h1 className="mt-4 max-w-3xl text-[32px] font-extrabold leading-[1.08] tracking-[-0.03em] text-balance sm:text-[44px] lg:text-[54px]">
            {aboutHero.title}
          </h1>

          <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-muted-dark sm:text-[17px]">
            {aboutHero.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ButtonLink href={aboutHero.primary.href} size="lg" variant="gold">
              {aboutHero.primary.label}
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </ButtonLink>

            <a
              href={whatsappLink(aboutHero.secondary.message, waNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-line-dark px-6 text-[15px] font-semibold text-white transition-colors hover:border-gold hover:text-gold focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
            >
              {aboutHero.secondary.label}
            </a>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line-dark pt-8 sm:grid-cols-4">
            {aboutStats.map(({ value, label, icon: Icon }) => (
              <div key={label}>
                <dt className="flex items-center gap-2 text-muted-dark">
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em]">
                    {label}
                  </span>
                </dt>
                <dd className="tabular mt-2 text-[24px] font-extrabold leading-none sm:text-[28px]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Cerita — kenapa toko ini ada. */}
      <section aria-labelledby="cerita" className="py-14 sm:py-18 lg:py-20">
        <Container>
          <Eyebrow>{aboutStory.eyebrow}</Eyebrow>
          <h2
            id="cerita"
            className="mt-3 max-w-3xl text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-balance sm:text-[34px]"
          >
            {aboutStory.title}
          </h2>

          <div className="mt-7 grid gap-6 lg:grid-cols-2 lg:gap-10">
            {aboutStory.paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-2xl text-[15.5px] leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      {/* Keunggulan — satu kartu satu manfaat. */}
      <section
        aria-labelledby="keunggulan"
        className="border-y border-line bg-cream-200/50 py-14 sm:py-18"
      >
        <Container>
          <Eyebrow>Yang Anda Dapatkan</Eyebrow>
          <h2
            id="keunggulan"
            className="mt-3 text-[26px] font-extrabold leading-tight tracking-[-0.02em] sm:text-[34px]"
          >
            Empat hal yang bikin tenang
          </h2>

          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aboutValues.map(({ title, description, icon: Icon }) => (
              <li
                key={title}
                className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-gold/15 text-gold-deep">
                  <Icon className="size-[20px]" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[15.5px] font-bold">{title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Proses — 3 langkah, angka ditonjolkan biar urutannya jelas. */}
      <section aria-labelledby="proses" className="py-14 sm:py-18 lg:py-20">
        <Container>
          <Eyebrow>Cara Kerja</Eyebrow>
          <h2
            id="proses"
            className="mt-3 text-[26px] font-extrabold leading-tight tracking-[-0.02em] sm:text-[34px]"
          >
            Sederhana, karena tidak perlu lebih rumit
          </h2>

          <ol className="mt-9 grid gap-6 sm:grid-cols-3 sm:gap-8">
            {aboutProcess.map(({ icon: Icon, title, description }, index) => (
              <li key={title} className="border-t-2 border-gold pt-5">
                <div className="flex items-center gap-3">
                  <span className="tabular text-[13px] font-extrabold text-gold-deep">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon className="size-[18px] text-ink" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-[17px] font-bold">{title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Prinsip — dipakai pembeli untuk menilai, jadi ditulis apa adanya. */}
      <section aria-labelledby="prinsip" className="pb-14 sm:pb-18 lg:pb-20">
        <Container>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-9">
            <Eyebrow>Prinsip Kami</Eyebrow>
            <h2
              id="prinsip"
              className="mt-3 text-[24px] font-extrabold leading-tight tracking-[-0.02em] sm:text-[30px]"
            >
              Tiga janji yang bisa Anda tagih
            </h2>

            <ul className="mt-8 grid gap-7 lg:grid-cols-3 lg:gap-9">
              {aboutPrinciples.map(({ title, description }) => (
                <li key={title}>
                  <h3 className="text-[15.5px] font-bold">{title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Ajakan penutup. */}
      <section aria-labelledby="mulai" className="pb-16 sm:pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-10 text-white sm:px-10 sm:py-14">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_15%_100%,rgba(201,166,100,0.22),transparent_70%)]"
            />

            <div className="relative max-w-2xl">
              <Eyebrow tone="onDark">{aboutCta.eyebrow}</Eyebrow>
              <h2
                id="mulai"
                className="mt-3 text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-balance sm:text-[34px]"
              >
                {aboutCta.title}
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-muted-dark">
                {aboutCta.description}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ButtonLink href={aboutCta.primary.href} size="lg" variant="gold">
                  {aboutCta.primary.label}
                  <ArrowRight className="size-[18px]" aria-hidden="true" />
                </ButtonLink>

                <a
                  href={whatsappLink(aboutCta.secondary.message, waNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-line-dark px-6 text-[15px] font-semibold text-white transition-colors hover:border-gold hover:text-gold focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
                >
                  {aboutCta.secondary.label}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
