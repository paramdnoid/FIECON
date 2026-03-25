"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/animations/FadeIn";
import { Link } from "@/i18n/navigation";
import { LAW_ICONS } from "@/components/sections/gesetze/law-icons";

const LAWS = [
  { key: "kwg", number: "01" },
  { key: "vag", number: "02" },
  { key: "estg", number: "03" },
] as const;

export function Gesetze() {
  const t = useTranslations("gesetze");

  return (
    <section id="gesetze" className="relative py-20 sm:py-32 lg:py-40 bg-beige-50 overflow-hidden">
      {/* Large § watermark */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[20rem] sm:text-[28rem] lg:text-[36rem] font-light text-bordeaux-900 opacity-[0.015] select-none pointer-events-none leading-none"
      >
        §
      </span>

      <Container size="lg">
        <FadeIn>
          <SectionHeading
            badge={t("badge")}
            headline={t("headline")}
            subtitle={t("subtitle")}
            gradient
            italic
          />
        </FadeIn>

        {/* Gradient divider */}
        <div aria-hidden="true" className="h-px bg-linear-to-r from-transparent via-beige-400/30 to-transparent mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {LAWS.map((law, index) => (
            <FadeIn
              key={law.key}
              delay={0.1 + index * 0.15}
              className="h-full"
            >
              <div className="group fiecon-card-frame relative flex h-full flex-col rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_-26px_rgba(98,25,28,0.7)] hover:border-beige-400/70 focus-within:-translate-y-0.5 focus-within:shadow-[0_16px_38px_-26px_rgba(98,25,28,0.7)] focus-within:border-beige-400/70">
                {/* Always-visible subtle top accent */}
                <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-linear-to-r from-bordeaux-900/20 via-bordeaux-700/15 to-beige-400/20 transition-opacity duration-500" />
                  <div className="absolute top-0 inset-x-0 h-[3px] bg-linear-to-r from-bordeaux-900 via-bordeaux-700 to-beige-400 origin-left scale-x-0 group-hover:scale-x-100 group-focus-within:scale-x-100 transition-transform duration-500" />
                </div>

                <div className="p-6 sm:p-8 flex flex-col items-center h-full text-center">
                  {/* § watermark per card */}
                  <span aria-hidden="true" className="absolute top-3 right-5 font-display text-7xl font-light text-bordeaux-900 opacity-[0.03] select-none pointer-events-none">
                    §
                  </span>

                  {/* Icon circle */}
                  <div className="w-14 h-14 rounded-full bg-bordeaux-900/5 ring-1 ring-bordeaux-900/6 group-hover:bg-bordeaux-900/10 group-hover:ring-bordeaux-900/10 flex items-center justify-center mb-5 text-accent transition-all duration-400">
                    {LAW_ICONS[law.key]}
                  </div>

                  <h3 className="font-display italic text-xl font-normal text-text-primary mb-1">
                    {t(`laws.${law.key}.abbreviation`)}
                  </h3>
                  <p className="text-sm font-medium text-accent/80 mb-4 tracking-wide">
                    {t(`laws.${law.key}.name`)}
                  </p>

                  {/* Tiny separator */}
                  <div aria-hidden="true" className="w-8 h-px bg-beige-400/40 mb-4" />

                  <p className="flex-1 text-text-muted leading-relaxed text-sm max-w-xs">
                    {t(`laws.${law.key}.description`)}
                  </p>

                  <div className="mt-6 pt-4 border-t border-beige-200/40 w-full flex justify-center">
                    <Link
                      href="/gesetze"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-bordeaux-900 transition-colors duration-300 group/link"
                    >
                      {t("mehr_erfahren")}
                      <svg
                        aria-hidden="true"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-300 group-hover/link:translate-x-1"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
