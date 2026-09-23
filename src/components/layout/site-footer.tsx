import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { SocialIcon } from "@/components/ui/social-icon";
import { footerColumns, socialLinks } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))]">
          <div>
            <Logo />
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              {siteConfig.tagline}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-dark">
              {siteConfig.description}
            </p>

            <ul className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <li key={social.key}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="grid size-8 place-items-center rounded-lg border border-line-dark text-white/80 transition-colors hover:border-gold hover:text-gold"
                  >
                    <SocialIcon name={social.key} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-sm font-bold text-white">{column.title}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      /* tinggi minimal 24px: ukuran target pointer WCAG 2.2 AA
                         untuk link yang berdiri sendiri (bukan di tengah kalimat) */
                      className="inline-flex min-h-6 items-center text-sm text-muted-dark transition-colors hover:text-gold focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:outline-none"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-line-dark pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-dark">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-3 text-xs font-medium text-muted-dark">
            <span className="h-px w-10 bg-line-dark" aria-hidden="true" />
            {siteConfig.footerNote}
          </p>
        </div>
      </Container>
    </footer>
  );
}
