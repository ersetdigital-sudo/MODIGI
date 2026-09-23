import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ctaBanner } from "@/data/site";

export function CtaBanner() {
  return (
    <section className="pb-16 lg:pb-20">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-ink px-6 py-10 text-white sm:px-10 lg:py-12">
          <CtaBackdrop />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <Eyebrow tone="onDark" className="text-muted-dark">
                {ctaBanner.eyebrow}
              </Eyebrow>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-[32px]">
                {ctaBanner.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-dark">
                {ctaBanner.description}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <ButtonLink href={ctaBanner.action.href} size="lg" className="shrink-0">
                {ctaBanner.action.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>

              <p className="hidden text-[10px] font-semibold uppercase leading-relaxed tracking-[0.24em] text-muted-dark xl:block">
                {ctaBanner.sideNote.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Sinar diagonal + garis emas di banner CTA. */
function CtaBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 right-[22%] h-[220%] w-[180px] rotate-[34deg] bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
      <div className="absolute -top-20 right-[36%] h-[200%] w-[80px] rotate-[34deg] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[38%] bg-gradient-to-l from-gold/5 to-transparent" />
    </div>
  );
}
