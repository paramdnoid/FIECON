"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/animations/FadeIn";

const VALUE_ICONS: Record<string, React.ReactNode> = {
  expertise: (
    <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  personal: (
    <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  trust: (
    <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
};

const VALUES = [
  { key: "expertise", number: "01" },
  { key: "personal", number: "02" },
  { key: "trust", number: "03" },
] as const;

export function Philosophy() {
  const t = useTranslations("approach");

  return (
    <section id="approach" className="py-32 sm:py-40 bg-beige-50">
      <Container size="lg">
        <FadeIn>
          <SectionHeading badge={t("badge")} headline={t("headline")} gradient italic />
        </FadeIn>

        {/* Gradient divider */}
        <div aria-hidden="true" className="h-px bg-gradient-to-r from-transparent via-beige-400/30 to-transparent mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {VALUES.map((value, index) => (
            <FadeIn
              key={value.key}
              delay={0.1 + index * 0.15}
              className="h-full"
            >
              <div className="group relative flex h-full flex-col bg-white rounded-2xl border border-beige-200/60 p-8 text-center overflow-hidden transition-all duration-400 hover:shadow-lg hover:shadow-bordeaux-900/8 hover:border-beige-400/50">
                {/* Accent bar top */}
                <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-bordeaux-900 via-bordeaux-700 to-beige-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                {/* Number watermark */}
                <span aria-hidden="true" className="absolute top-4 right-5 font-display text-6xl font-light text-bordeaux-900 opacity-[0.04] select-none pointer-events-none">
                  {value.number}
                </span>

                {/* Icon circle */}
                <div className="w-14 h-14 rounded-full bg-bordeaux-900/5 group-hover:bg-bordeaux-900/10 flex items-center justify-center mx-auto mb-6 text-accent transition-colors duration-400">
                  {VALUE_ICONS[value.key]}
                </div>

                <h3 className="font-display italic text-xl font-normal text-text-primary mb-3">
                  {t(`values.${value.key}.title`)}
                </h3>
                <p className="flex-1 text-text-muted leading-relaxed text-sm max-w-xs mx-auto">
                  {t(`values.${value.key}.description`)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
